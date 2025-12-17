import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      data-testid="empty-state"
    >
      <div className="rounded-full bg-muted p-4 mb-6">
        <Calendar className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2" data-testid="empty-state-title">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6" data-testid="empty-state-description">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} data-testid="button-empty-state-action">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
