import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "BEKON Studio")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "").strip()

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _row(label: str, value: str) -> str:
    return (f'<tr><td style="padding:8px 16px;color:#94A3B8;font-size:13px;white-space:nowrap;vertical-align:top">{escape(label)}</td>'
            f'<td style="padding:8px 16px;color:#FFFFFF;font-size:14px">{value}</td></tr>')


async def notify_quote(quote: dict) -> None:
    if not OWNER_EMAIL:
        logger.info("OWNER_EMAIL not set — skipping quote notification email")
        return
    app_url = os.environ.get("APP_URL", "").rstrip("/")
    files_html = "".join(f"<li>{escape(f.get('filename', 'fichier'))}</li>" for f in quote.get("files", [])) or "<li>—</li>"
    subject = f"Nouvelle demande de devis — {quote.get('service', '')}"
    html = (
        '<table role="presentation" width="100%" style="background:#0B0F19;padding:32px 0">'
        '<tr><td align="center"><table role="presentation" width="560" style="background:#1A1F2B;border-radius:12px;overflow:hidden;font-family:Arial,sans-serif">'
        '<tr><td style="padding:24px 32px;background:#0A66FF;color:#FFFFFF;font-size:20px;font-weight:bold">BEKON — Nouvelle demande de projet</td></tr>'
        '<tr><td style="padding:8px 16px"><table role="presentation" width="100%">'
        + _row("Client", escape(quote.get("name", "")))
        + _row("E-mail", escape(quote.get("email", "")))
        + _row("Téléphone", escape(quote.get("phone", "") or "—"))
        + _row("WhatsApp", escape(quote.get("whatsapp", "") or "—"))
        + _row("Ville", escape(quote.get("city", "") or "—"))
        + _row("Service", escape(quote.get("service", "")))
        + _row("Budget", escape(quote.get("budget", "") or "À définir"))
        + _row("Délai", escape(quote.get("deadline", "") or "—"))
        + _row("Description", escape(quote.get("description", "")))
        + '</table></td></tr>'
        f'<tr><td style="padding:8px 32px;color:#CBD5E1;font-size:13px">Fichiers joints :<ul style="margin:4px 0;padding-left:18px">{files_html}</ul></td></tr>'
        f'<tr><td style="padding:24px 32px"><a href="{app_url}/admin/demandes" style="color:#0A66FF;font-size:14px">Voir la demande dans le tableau de bord</a></td></tr>'
        '<tr><td style="padding:16px 32px;color:#64748B;font-size:11px">Envoyé par le site BEKON Studio. Nous ne demandons jamais de mot de passe par e-mail.</td></tr>'
        '</table></td></tr></table>'
    )
    try:
        await send_email(to=OWNER_EMAIL, subject=subject, html=html)
        logger.info("Quote notification email sent")
    except Exception as e:
        logger.error(f"Quote notification email failed: {e}")
