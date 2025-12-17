import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "./StatusIndicator";
import { DoctorBadge } from "./DoctorBadge";
import { formatDate, formatTime } from "@/lib/functional";
import { Calendar, Clock, User, FileText, CheckCircle, XCircle } from "lucide-react";
import type { Appointment } from "@shared/schema";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  isPending?: boolean;
}

export function AppointmentDetails({
  appointment,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  onComplete,
  isPending = false,
}: AppointmentDetailsProps) {
  if (!appointment) return null;

  const doctorInitials = appointment.doctorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const canConfirm = appointment.status === "pending";
  const canComplete = appointment.status === "confirmed";
  const canCancel = appointment.status === "pending" || appointment.status === "confirmed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Appointment Details</DialogTitle>
          <DialogDescription>
            View and manage this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-muted">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {doctorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold" data-testid="detail-doctor-name">
                Dr. {appointment.doctorName}
              </h3>
              <DoctorBadge specialty={appointment.specialty} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Patient</span>
              </div>
              <p className="font-medium" data-testid="detail-patient-name">
                {appointment.patientName}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Status</span>
              </div>
              <StatusIndicator status={appointment.status as any} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p className="font-medium" data-testid="detail-date">
                {formatDate(appointment.appointmentDate)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </div>
              <p className="font-medium" data-testid="detail-time">
                {formatTime(appointment.appointmentDate)}
              </p>
            </div>
          </div>

          {appointment.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Notes</span>
                </div>
                <p className="text-sm" data-testid="detail-notes">
                  {appointment.notes}
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {canConfirm && (
            <Button
              onClick={() => onConfirm?.(appointment)}
              disabled={isPending}
              className="w-full sm:w-auto"
              data-testid="button-confirm-appointment"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Appointment
            </Button>
          )}
          {canComplete && (
            <Button
              onClick={() => onComplete?.(appointment)}
              disabled={isPending}
              className="w-full sm:w-auto"
              data-testid="button-complete-appointment"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Complete
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel?.(appointment)}
              disabled={isPending}
              className="w-full sm:w-auto"
              data-testid="button-cancel-appointment"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Appointment
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            data-testid="button-close-details"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
