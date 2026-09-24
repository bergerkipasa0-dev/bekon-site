import { ApiError } from "./api";

export async function uploadImage(file: File): Promise<{ path: string; url: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
  return (await res.json()) as { path: string; url: string };
}

export async function submitQuote(data: {
  service: string;
  description: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  files: File[];
}): Promise<void> {
  const fd = new FormData();
  fd.append("service", data.service);
  fd.append("description", data.description);
  fd.append("budget", data.budget);
  fd.append("deadline", data.deadline);
  fd.append("name", data.name);
  fd.append("email", data.email);
  fd.append("phone", data.phone);
  fd.append("whatsapp", data.whatsapp);
  fd.append("city", data.city);
  data.files.forEach((f) => fd.append("files", f));
  const res = await fetch("/api/quotes", { method: "POST", body: fd });
  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
}
