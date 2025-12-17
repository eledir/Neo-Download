import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@shared/schema";

interface StatusIndicatorProps {
  status: AppointmentStatus;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusConfig: Record<AppointmentStatus, { color: string; label: string; bgColor: string }> = {
  pending: {
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    label: "Pending",
  },
  confirmed: {
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    label: "Confirmed",
  },
  completed: {
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    label: "Completed",
  },
  cancelled: {
    color: "bg-red-500",
    bgColor: "bg-red-500/10 text-red-700 dark:text-red-400",
    label: "Cancelled",
  },
};

export function StatusIndicator({ status, showLabel = true, size = "md" }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1",
        config.bgColor
      )}
      data-testid={`status-indicator-${status}`}
    >
      <span
        className={cn(
          "rounded-full",
          config.color,
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
      />
      {showLabel && (
        <span className={cn("font-medium", size === "sm" ? "text-xs" : "text-sm")}>
          {config.label}
        </span>
      )}
    </div>
  );
}
