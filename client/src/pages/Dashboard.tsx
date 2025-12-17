import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/functional/StatsCard";
import { AppointmentCard } from "@/components/functional/AppointmentCard";
import { AppointmentForm } from "@/components/functional/AppointmentForm";
import { AppointmentDetails } from "@/components/functional/AppointmentDetails";
import { EmptyState } from "@/components/functional/EmptyState";
import { DashboardSkeleton } from "@/components/functional/LoadingState";
import {
  getAppointmentStats,
  getUpcomingAppointments,
  getTodayAppointments,
} from "@/lib/functional";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import type { Appointment, InsertAppointment } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsFormOpen(false);
      toast({
        title: "Appointment Scheduled",
        description: "The appointment has been successfully created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create appointment.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/appointments/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsDetailsOpen(false);
      setSelectedAppointment(null);
      toast({
        title: "Appointment Updated",
        description: "The appointment status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleConfirm = (appointment: Appointment) => {
    updateMutation.mutate({ id: appointment.id, status: "confirmed" });
  };

  const handleCancel = (appointment: Appointment) => {
    updateMutation.mutate({ id: appointment.id, status: "cancelled" });
  };

  const handleComplete = (appointment: Appointment) => {
    updateMutation.mutate({ id: appointment.id, status: "completed" });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  const stats = getAppointmentStats(appointments);
  const upcomingAppointments = getUpcomingAppointments(appointments).slice(0, 6);
  const todayAppointments = getTodayAppointments(appointments);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your medical appointments
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} data-testid="button-new-appointment">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={stats.today}
          icon={CalendarDays}
          description={`${todayAppointments.filter(a => a.status === "pending").length} pending`}
          variant="primary"
        />
        <StatsCard
          title="Pending Confirmations"
          value={stats.pending}
          icon={AlertCircle}
          description="Awaiting confirmation"
          variant="warning"
        />
        <StatsCard
          title="Completed This Month"
          value={stats.completed}
          icon={CheckCircle}
          description="Successfully completed"
          variant="success"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" data-testid="text-section-title">
            Upcoming Appointments
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <a href="/appointments" data-testid="link-view-all">
              View All
            </a>
          </Button>
        </div>

        {upcomingAppointments.length === 0 ? (
          <EmptyState
            title="No upcoming appointments"
            description="Schedule your first appointment to get started with managing your medical visits."
            actionLabel="Schedule Appointment"
            onAction={() => setIsFormOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onView={handleView}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </section>

      <AppointmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={(data) => createMutation.mutate(data as InsertAppointment)}
        isPending={createMutation.isPending}
      />

      <AppointmentDetails
        appointment={selectedAppointment}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onComplete={handleComplete}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
