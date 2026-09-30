import { SectionHeading } from "@/components/SectionHeading";

export default function Privacy() {
  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-3xl px-5 pb-24 md:px-8">
        <SectionHeading overline="Legal" title="Politique de confidentialité" sub="Dernière mise à jour : 30 septembre 2026" />

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">1. Qui sommes-nous</h2>
            <p>
              BEKON est un studio de création et de personnalisation (customisation PC, branding, design graphique, UI/UX),
              contactable à l'adresse{" "}
              <a href="mailto:bergerkipasa0@gmail.com" className="text-electric hover:underline">
                bergerkipasa0@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">2. Quelles données nous collectons</h2>
            <p>Nous collectons uniquement les informations que vous nous transmettez volontairement via notre formulaire de devis :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Nom, adresse email, numéro de téléphone, numéro WhatsApp et ville (optionnels sauf nom et email)</li>
              <li>Description de votre projet, budget approximatif, délai souhaité</li>
              <li>Fichiers que vous choisissez de joindre (images, PDF, fichiers de design)</li>
            </ul>
            <p className="mt-2">
              Nous n'utilisons aucun outil de suivi publicitaire ni cookie de mesure d'audience (pas de Google Analytics,
              pas de pixel Facebook).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">3. Pourquoi nous utilisons ces données</h2>
            <p>Ces informations servent uniquement à :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Étudier et répondre à votre demande de devis</li>
              <li>Vous recontacter par email, téléphone ou WhatsApp au sujet de votre projet</li>
            </ul>
            <p className="mt-2">Nous ne revendons ni ne partageons vos données avec des tiers à des fins commerciales.</p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">4. Où sont stockées vos données</h2>
            <p>
              Les informations soumises via le formulaire de devis sont stockées de façon sécurisée dans notre base de
              données (MongoDB Atlas), hébergée par MongoDB Inc. Les fichiers joints sont stockés dans ce même
              environnement sécurisé.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">5. Combien de temps nous les conservons</h2>
            <p>
              Nous conservons les demandes de devis le temps nécessaire au traitement de votre projet, puis jusqu'à 24
              mois à des fins de suivi commercial, sauf demande de suppression de votre part.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">6. Vos droits</h2>
            <p>Vous pouvez à tout moment nous demander :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>L'accès aux données que nous détenons sur vous</li>
              <li>Leur correction</li>
              <li>Leur suppression définitive</li>
            </ul>
            <p className="mt-2">
              Pour cela, il suffit de nous écrire à{" "}
              <a href="mailto:bergerkipasa0@gmail.com" className="text-electric hover:underline">
                bergerkipasa0@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">7. Sécurité</h2>
            <p>
              L'accès à l'espace d'administration de BEKON est protégé par mot de passe. Nous prenons des mesures
              raisonnables pour protéger vos données contre tout accès non autorisé.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground">8. Contact</h2>
            <p>
              Pour toute question relative à cette politique de confidentialité, contactez-nous à{" "}
              <a href="mailto:bergerkipasa0@gmail.com" className="text-electric hover:underline">
                bergerkipasa0@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
