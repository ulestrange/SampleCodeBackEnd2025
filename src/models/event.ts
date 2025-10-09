import { ObjectId } from "mongodb";
import { z } from 'zod';


export interface Event {
    id?: ObjectId;
    name: string;
    attendees: [ObjectId];
}

export const createEventSchema = z.object({
    name: z.string().min(5)
});


export const updateEventSchema = z.object({
  name: z.string().min(5),
  attendees: [ObjectId]
});
