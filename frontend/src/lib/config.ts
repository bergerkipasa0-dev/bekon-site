import type { DivisionKey } from "./types";

export const WHATSAPP_NUMBER = "243855268657";
export const CONTACT_EMAIL = "bergerkipasa0@gmail.com";
export const CONTACT_PHONE = "+243 85 526 8657";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function fileUrl(path: string | null | undefined) {
  return path ? `/api/files/${path}` : "";
}

export const DIVISION_ORDER: DivisionKey[] = ["custom", "brand", "design", "digital"];

export const DIVISION_META: Record<DivisionKey, { num: string; image: string }> = {
  custom: {
    num: "01",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjBwYyUyMGN1c3RvbSUyMG1vZCUyMGJ1aWxkJTIwc2V0dXB8ZW58MHx8fHwxNzg5MzgzMTY4fDA&ixlib=rb-4.1.0&q=85",
  },
  brand: {
    num: "02",
    image: "https://images.unsplash.com/photo-1781643916032-c3486975e579?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxicmFuZCUyMGlkZW50aXR5JTIwdmlzdWFsJTIwZGVzaWduJTIwdHlwb2dyYXBoeSUyMG1vY2t1cHxlbnwwfHx8fDE3ODkzODMxNjh8MA&ixlib=rb-4.1.0&q=85",
  },
  design: {
    num: "03",
    image: "https://images.unsplash.com/photo-1762365189058-7be5b07e038b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwdmlzdWFsJTIwZGVzaWduJTIwdHlwb2dyYXBoeSUyMG1vY2t1cHxlbnwwfHx8fDE3ODkzODMxNjh8MA&ixlib=rb-4.1.0&q=85",
  },
  digital: {
    num: "04",
    image: "https://images.unsplash.com/photo-1634084462412-b54873c0a56d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjB3ZWIlMjBkZXZlbG9wbWVudCUyMGFwcGxpY2F0aW9uJTIwVUklMjBkZXNpZ24lMjBkYXJrJTIwbW9kZXxlbnwwfHx8fDE3ODg2NzEyNDF8MA&ixlib=rb-4.1.0&q=85",
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  custom: "Custom",
  brand: "Brand",
  design: "Design",
  digital: "Digital",
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  discussion: "En discussion",
  quote_sent: "Devis envoyé",
  accepted: "Accepté",
  in_progress: "En cours",
  done: "Terminé",
  cancelled: "Annulé",
};
