import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusIndicator } from "./StatusIndicator";
import { DoctorBadge } from "./DoctorBadge";
import { formatDate, formatTime } from "@/lib/functional";
import { Calendar, Clock, User, MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Appointment } from "@shared/schema";

interface AppointmentCardProps {
  appointment: Appointment;
  onView?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
}

export function AppointmentCard({
  appointment,
  onView,
  onConfirm,
  onCancel,
  onComplete,
}: AppointmentCardProps) {
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
    <Card
      className="hover-elevate transition-all duration-200"
      data-testid={`card-appointment-${appointment.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-muted">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {doctorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none" data-testid="text-doctor-name">
              Dr. {appointment.doctorName}
            </h3>
            <DoctorBadge specialty={appointment.specialty} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="button-appointment-menu">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(appointment)} data-testid="menu-item-view">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {canConfirm && (
              <DropdownMenuItem onClick={() => onConfirm?.(appointment)} data-testid="menu-item-confirm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm
              </DropdownMenuItem>
            )}
            {canComplete && (
              <DropdownMenuItem onClick={() => onComplete?.(appointment)} data-testid="menu-item-complete">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </DropdownMenuItem>
            )}
            {canCancel && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onCancel?.(appointment)}
                  className="text-destructive focus:text-destructive"
                  data-testid="menu-item-cancel"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span data-testid="text-patient-name">{appointment.patientName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span data-testid="text-appointment-date">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span data-testid="text-appointment-time">
              {formatTime(appointment.appointmentDate)}
            </span>
          </div>
        </div>
        {appointment.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid="text-notes">
            {appointment.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-3 border-t">
        <StatusIndicator status={appointment.status as any} size="sm" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView?.(appointment)}
          data-testid="button-view-details"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
