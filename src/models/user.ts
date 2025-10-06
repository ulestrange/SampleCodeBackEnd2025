import { ObjectId } from "mongodb";
import { z } from 'zod';


export interface User {
    id?: ObjectId;
    name: string;
    phonenumber: string;
    email: string;
    dob?: Date;
    dateJoined?: Date,
    lastUpdate?: Date
}

export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    dob: z.coerce.date().max(() => new Date()),
    phonenumber: z.string()
});


export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  dob: z.date(),
  phonenumber: z.string()
});
