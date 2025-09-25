import { ObjectId } from "mongodb";

export interface User {
    id?: ObjectId;
    name: string;
    phonenumber: string;
    email: string;
    dob?: Date;
    dateJoined? : Date,
    lastUpdate?: Date
}
