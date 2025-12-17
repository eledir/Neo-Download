import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AppointmentCard } from "@/components/functional/AppointmentCard";
import { AppointmentForm } from "@/components/functional/AppointmentForm";
import { AppointmentDetails } from "@/components/functional/AppointmentDetails";
import { AppointmentFilters } from "@/components/functional/AppointmentFilters";
import { EmptyState } from "@/components/functional/EmptyState";
import { AppointmentListSkeleton } from "@/components/functional/LoadingState";
import {
  filterAppointmentsByStatus,
  filterAppointmentsByDoctor,
  sortAppointmentsByDate,
  getUniqueDoctors,
} from "@/lib/functional";
import { Plus } from "lucide-react";
import type { Appointment, InsertAppointment, AppointmentStatus } from "@shared/schema";

export default function Appointments() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [doctorFilter, setDoctorFilter] = useState("all");

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

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(query) ||
          apt.doctorName.toLowerCase().includes(query) ||
          apt.specialty.toLowerCase().includes(query)
      );
    }

    result = filterAppointmentsByStatus(result, statusFilter);
    result = filterAppointmentsByDoctor(result, doctorFilter);
    result = sortAppointmentsByDate(result, "asc");

    return result;
  }, [appointments, searchQuery, statusFilter, doctorFilter]);

  const doctors = useMemo(() => getUniqueDoctors(appointments), [appointments]);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || doctorFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDoctorFilter("all");
  };

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
        <AppointmentListSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Appointments
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all appointments
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} data-testid="button-new-appointment">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <AppointmentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        doctorFilter={doctorFilter}
        onDoctorChange={setDoctorFilter}
        doctors={doctors}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredAppointments.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matching appointments" : "No appointments yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters to find what you're looking for."
              : "Schedule your first appointment to get started."
          }
          actionLabel={hasActiveFilters ? undefined : "Schedule Appointment"}
          onAction={hasActiveFilters ? undefined : () => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => (
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

      <p className="text-sm text-muted-foreground" data-testid="text-results-count">
        Showing {filteredAppointments.length} of {appointments.length} appointments
      </p>

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
