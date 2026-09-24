export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  client: string | null;
  year: string | null;
  software: string[];
  services: string[];
  tags: string[];
  status: string;
  featured: boolean;
  image_path: string | null;
  gallery: string[];
  figma_url: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  key: string;
  name: string;
  tagline: string;
  summary: string;
  items: string[];
  image_url: string | null;
  active: boolean;
  order: number;
}

export interface QuoteFile {
  path: string;
  filename: string;
  size: number;
  content_type: string;
}

export interface Quote {
  id: string;
  service: string;
  description: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  files: QuoteFile[];
  status: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Stats {
  projects: number;
  published: number;
  quotes: number;
  new_quotes: number;
  services: number;
  messages: number;
  latest_quotes: Quote[];
  latest_projects: Project[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type DivisionKey = "custom" | "brand" | "design" | "digital";
