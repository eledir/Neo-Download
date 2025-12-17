import { 
  appointments, 
  type Appointment, 
  type InsertAppointment,
  type UpdateAppointment 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(data: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, data: UpdateAppointment): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(data: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(data)
      .returning();
    return appointment;
  }

  async updateAppointment(id: number, data: UpdateAppointment): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
