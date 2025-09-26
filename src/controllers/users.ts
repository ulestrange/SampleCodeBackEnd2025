import { Request, Response } from 'express';
import { collections } from '../database';
import { User, CreateUserSchema } from '../models/user'
import { ObjectId } from 'mongodb'

export const getUsers = async (req: Request, res: Response) => {

  try {

    const users = (await collections.users?.find({}).toArray()) as unknown as User[];
    res.json(users);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with GET $(error.message)`)
    }
    res.status(500).json({ 'error': 'get failed' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  //get a single  user by ID from the database

  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne(query)) as unknown as User;

    if (user) {
      res.status(200).send(user);
    }
    else {
      res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
  } catch (error) {

    if (error instanceof Error) {
      console.log('Issue with GET for user ${id}  ${error.message}')
    }
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};

export const createUser = async (req: Request, res: Response) => {
  // create a new user in the database

  console.log(req.body); //for now still log the data

  
  const validation = CreateUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.error.format(),
    });
  }

    const { name,  phonenumber, email, dob } = req.body;
    const newUser : User = {name : name, phonenumber: phonenumber, email: email, dob : new Date(dob),
    dateJoined: new Date(), lastUpdate : new Date()}



  try {
    const result = await collections.users?.insertOne(newUser)

    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` })
    }
    else {
      res.status(500).send("Failed to create a new user.");
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


export const updateUser = async (req: Request, res: Response) => {

  const id: string = req.params.id;

  const { name,  phonenumber, email, dob } = req.body
  const newData : User = {name : name, phonenumber: phonenumber, email: email, dob : new Date(dob),
     lastUpdate : new Date()
  }

  try {
  
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.updateOne(query, { $set: newData });

    if (result) {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: `Updated User` })
      }
      else if (result.matchedCount = 0) {
        res.status(400).json({ message: `Failed to update user.` });
      }
      else {
        res.status(404).json({ "Message": `${id} not found ` });
      }
    }
    else {
      res.status(400).send(`Unable to update user ${req.params.id}`);
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`eror with ${error.message}`);
    }
    else {
      console.error(error);
    }
    res.status(400).send(`Unable to update user ${req.params.id}`);
  }
};


export const deleteUser = async (req: Request, res: Response) => {

  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };

    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).json({ message: `Successfully removed user with id ${id}` });
    } else if (!result) {
      res.status(400).json({ message: `Failed to remove user with id ${id}` });
    } else if (!result.deletedCount) {
      res.status(404).json({ message: `no user fround with id ${id}` });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }

    res.status(400).send(`Unable to create new user`);
  }



};
