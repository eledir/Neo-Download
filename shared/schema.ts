import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const appointmentStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
export type AppointmentStatus = typeof appointmentStatuses[number];

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  doctorName: text("doctor_name").notNull(),
  specialty: text("specialty").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
}).extend({
  appointmentDate: z.coerce.date().refine(
    (date) => date > new Date(),
    { message: "Appointment date must be in the future" }
  ),
  status: z.enum(appointmentStatuses).default("pending"),
});

export const updateAppointmentSchema = z.object({
  patientName: z.string().min(1).optional(),
  doctorName: z.string().min(1).optional(),
  specialty: z.string().min(1).optional(),
  appointmentDate: z.coerce.date().optional(),
  status: z.enum(appointmentStatuses).optional(),
  notes: z.string().nullable().optional(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
