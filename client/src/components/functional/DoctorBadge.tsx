import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DoctorBadgeProps {
  specialty: string;
  variant?: "default" | "outline";
  className?: string;
}

const specialtyColors: Record<string, string> = {
  Cardiology: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  Dermatology: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
  Neurology: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  Pediatrics: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Orthopedics: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  Oncology: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  Psychiatry: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  "General Practice": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Surgery: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  Radiology: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
};

const defaultColor = "bg-muted text-muted-foreground border-muted";

export function DoctorBadge({ specialty, variant = "default", className }: DoctorBadgeProps) {
  const colorClass = specialtyColors[specialty] || defaultColor;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium border no-default-hover-elevate no-default-active-elevate",
        colorClass,
        className
      )}
      data-testid={`badge-specialty-${specialty.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {specialty}
    </Badge>
  );
}
