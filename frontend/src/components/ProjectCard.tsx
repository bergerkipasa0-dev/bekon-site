import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Cpu, PenTool, Layers, MonitorSmartphone, Star } from "lucide-react";
import type { Project } from "@/lib/types";
import { CATEGORY_LABELS, fileUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  custom: Cpu,
  brand: PenTool,
  design: Layers,
  digital: MonitorSmartphone,
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const Icon = CATEGORY_ICONS[project.category] ?? Layers;
  const image = fileUrl(project.image_path);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/projets/${project.id}`}
        data-testid={`project-card-${project.id}`}
        className="group block overflow-hidden rounded-2xl border border-edge bg-card transition-all duration-500 hover:border-electric/70 hover:shadow-[0_20px_60px_rgba(10,102,255,0.15)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-panel">
          {image ? (
            <img
              src={image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-panel to-background">
              <Icon className="h-14 w-14 text-edge transition-colors duration-500 group-hover:text-electric" />
            </div>
          )}
          {project.featured && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-electric px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <Star className="h-3 w-3" /> Featured
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full border border-edge bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
            {CATEGORY_LABELS[project.category] ?? project.category}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-heading text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-electric">
            {project.title}
          </h3>
          <p className={cn("mt-1.5 line-clamp-2 text-sm text-muted-foreground")}>{project.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {project.year && <span>{project.year}</span>}
            {project.client && <span>· {project.client}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
