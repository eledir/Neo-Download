import { format, isAfter, isBefore, isSameDay, parseISO, addHours, startOfDay, endOfDay } from "date-fns";
import type { Appointment, AppointmentStatus } from "@shared/schema";

export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "h:mm a");
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a");
};

export const isSlotAvailable = (
  appointments: Appointment[],
  proposedDate: Date,
  doctorName: string,
  durationHours: number = 1
): boolean => {
  const proposedEnd = addHours(proposedDate, durationHours);
  
  return !appointments.some((apt) => {
    if (apt.doctorName !== doctorName) return false;
    if (apt.status === "cancelled") return false;
    
    const aptDate = new Date(apt.appointmentDate);
    const aptEnd = addHours(aptDate, durationHours);
    
    return (
      (isAfter(proposedDate, aptDate) && isBefore(proposedDate, aptEnd)) ||
      (isAfter(proposedEnd, aptDate) && isBefore(proposedEnd, aptEnd)) ||
      (isBefore(proposedDate, aptDate) && isAfter(proposedEnd, aptEnd)) ||
      isSameDay(proposedDate, aptDate) && proposedDate.getHours() === aptDate.getHours()
    );
  });
};

export const filterAppointmentsByStatus = (
  appointments: Appointment[],
  status: AppointmentStatus | "all"
): Appointment[] => {
  if (status === "all") return appointments;
  return appointments.filter((apt) => apt.status === status);
};

export const filterAppointmentsByDateRange = (
  appointments: Appointment[],
  startDate: Date | null,
  endDate: Date | null
): Appointment[] => {
  return appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    if (startDate && isBefore(aptDate, startOfDay(startDate))) return false;
    if (endDate && isAfter(aptDate, endOfDay(endDate))) return false;
    return true;
  });
};

export const filterAppointmentsByDoctor = (
  appointments: Appointment[],
  doctorName: string | "all"
): Appointment[] => {
  if (doctorName === "all") return appointments;
  return appointments.filter((apt) => apt.doctorName === doctorName);
};

export const sortAppointmentsByDate = (
  appointments: Appointment[],
  order: "asc" | "desc" = "asc"
): Appointment[] => {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(a.appointmentDate).getTime();
    const dateB = new Date(b.appointmentDate).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

export const getTodayAppointments = (appointments: Appointment[]): Appointment[] => {
  const today = new Date();
  return appointments.filter((apt) => isSameDay(new Date(apt.appointmentDate), today));
};

export const getUpcomingAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return sortAppointmentsByDate(
    appointments.filter((apt) => 
      isAfter(new Date(apt.appointmentDate), now) && 
      apt.status !== "cancelled" &&
      apt.status !== "completed"
    ),
    "asc"
  );
};

export const getAppointmentStats = (appointments: Appointment[]) => {
  const today = getTodayAppointments(appointments);
  const pending = appointments.filter((apt) => apt.status === "pending");
  const confirmed = appointments.filter((apt) => apt.status === "confirmed");
  const completed = appointments.filter((apt) => apt.status === "completed");
  const cancelled = appointments.filter((apt) => apt.status === "cancelled");

  return {
    total: appointments.length,
    today: today.length,
    pending: pending.length,
    confirmed: confirmed.length,
    completed: completed.length,
    cancelled: cancelled.length,
  };
};

export const getUniqueDoctors = (appointments: Appointment[]): string[] => {
  return [...new Set(appointments.map((apt) => apt.doctorName))];
};

export const getUniqueSpecialties = (appointments: Appointment[]): string[] => {
  return [...new Set(appointments.map((apt) => apt.specialty))];
};

export const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduce((acc, fn) => fn(acc), value);

export const compose = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), value);
