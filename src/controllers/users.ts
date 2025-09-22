import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user'

export const getUsers = (req: Request, res: Response) => {
  //to do: get all users from the database
  res.json({ "message": "getUsers received" })
};

export const getUserById = (req: Request, res: Response) => {
  // get a single  user by ID from the database
  let id: string = req.params.id;
  res.json({ "message": `get a user ${id} received` })
};

export const createUser = async (req: Request, res: Response) => {
  // create a new user in the database

  console.log(req.body); //for now still log the data

  const newUser = req.body as User; // note this is not a secure practice but will do for now.


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
    console.error(error);
    res.status(400).send(`Unable to create new user`);
  }
};


export const updateUser = (req: Request, res: Response) => {

  console.log(req.body); //for now just log the data

  res.json({ "message": `update user ${req.params.id} with data from the post message` })
};

export const deleteUser = (req: Request, res: Response) => {
  // logic to delete user by ID from the database

  res.json({ "message": `delete user ${req.params.id} from the database` })
};
