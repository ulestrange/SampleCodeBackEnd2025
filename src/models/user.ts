import { ObjectId } from "mongodb";
import { z } from 'zod';


export interface User {
    id?: ObjectId;
    name: string;
    phonenumber: string;
    email: string;
    dob?: Date;
    dateJoined?: Date,
    lastUpdated?: Date
}

export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    dob: z.coerce.date().refine(date => date <= new Date(), {
  message: "Date of birth cannot be in the future",}),
    phonenumber: z.string().
    regex(/^09[3-9]\d{7}$/, {
  message: "Invalid Irish mobile number. Must start with 09 followed by 3–9 and 7 digits."})

});


export const updateUserSchema = z.object({
  name: z.string().min(1),
  dob: z.coerce.date().refine(date => date <= new Date(), {
  message: "Date of birth cannot be in the future",}),
    phonenumber: z.string().
    regex(/^09[3-9]\d{7}$/, {
  message: "Invalid Irish mobile number. Must start with 09 followed by 3–9 and 7 digits."})
});
