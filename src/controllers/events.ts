import { Request, Response } from 'express';
import { collections } from '../database';
import { Event , Attendee } from '../models/event'
import { ObjectId } from 'mongodb'

export const getEvents = async (req: Request, res: Response) => {

  try {

    const events = (await collections.events?.find({}).toArray()) as unknown as Event[];
    res.json(events);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with GET $(error.message)`)
    }
    res.status(500).json({ 'error': 'get failed' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  //get a single  event by ID from the database

  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const event = (await collections.events?.findOne(query)) as unknown as Event;

    if (event) {
      res.status(200).send(event);
    }
    else {
      res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
  } catch (error) {

    if (error instanceof Error) {
      console.log('Issue with GET for event ${id}  ${error.message}')
    }
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};

export const createEvent = async (req: Request, res: Response) => {
  // create a new event in the database

  console.log(req.body); //for now still log the data

  

    const { userId,  title, description, date, location, attendees } = req.body;
    
  const newEvent : Event = {userId : userId, title: title, date: date, description : description,
   location: location, attendees: attendees}



  try {
    const result = await collections.events?.insertOne(newEvent)

    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new event with id ${result.insertedId}` })
    }
    else {
      res.status(500).send("Failed to create a new event.");
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }

};



export const createAttendeeForEvent = async (req: Request, res: Response) =>{

  const eventId = req.params.id;

  if (!ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

const { name,   email,  rsvp } = req.body;
  
const newAttendee : Attendee = {name : name,  email: email, rsvp : rsvp };

  const result = await collections.events?.updateOne(
    { _id: new ObjectId(eventId) },
    { $push: { attendees: newAttendee } } as unknown as Parameters<typeof collections.events.findOneAndUpdate>,
  );

  
  if (result?.matchedCount == 0 ) {
    return res.status(404).json({ error: "Event not found" });
  }
  else if (result  && result.modifiedCount && result.modifiedCount >0 ){
    res.status(201).json({ message: "Attendee added"});
  }
  else {
    res.status(400).send(`Unable to update  ${req.params.id}`);
  }



}

export const deleteEvent = async (req: Request, res: Response) => {

  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };

    const result = await collections.events?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(204).json({ message: `Successfully removed event with id ${id}` });
    } else if (!result) {
      res.status(400).json({ message: `Failed to remove event with id ${id}` });
    } else if (result.deletedCount == 0) {
      res.status(404).json({ message: `no event found with id ${id}` });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }

    res.status(400).send(`Unable to create new event`);
  }



};
