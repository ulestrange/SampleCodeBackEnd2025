import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user'
import { ObjectId } from 'mongodb'

export const getUsers = async (req: Request, res: Response) => {

    const { email, name, page, pagesize } = req.query;


    let filter : any = {}


    if (email) filter.email = email;
    if (name) filter.name = { $regex: `${name}`, $options: 'i' }
    
    console.table (filter)
    
    //{ $regex: new RegExp(name as string, "i") };


       // const { filter } = req.query;

    // If "page" and "pageSize" are not sent we will default them to 1 and 0 (no limit)

    const pageInt = parseInt(page as string) || 1;
    const pagesizeInt = parseInt(pagesize as string) || 0;



  // if (req.params.name)
  // {
  //   filterObj.name = { $regex: `${name}`, $options: 'i' }
  // }



  // this code is used to test what happens on the client side 
  //   setTimeout(() => {
  //  console.log("This runs after 3 seconds");
  //   return res.json([] );
  //   }, 1000);

   



  try {
    //const users = await collections.users?.find(filterObj).toArray();


    const users = (await collections.users?.find(filter)
      //.project({ name: 1,  _id: 0 })
   // .sort({ email: 1 })
      .skip((pageInt - 1) * pagesizeInt)
      .limit(pagesizeInt)
      .toArray()) as User[];


    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with GET ${error.message}`)
    }
    res.status(500).json({ 'error': 'get failed' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  //get a single  user by ID from the database

  let id: string = req.params.id;
  
  try {


    const newId = new ObjectId();
    const isValid = ObjectId.isValid("string")

    const newId2 = new ObjectId(newId.id)

    console.log( newId === newId2)
    console.log( newId == newId2)
    console.log( newId.equals(newId2))

    


    const timeCreated  = newId.getTimestamp();


    
    const id1 = new ObjectId("123456789123456789001234");
        const id2 = new ObjectId("A23456789123C56789001234")
            const id3 = new ObjectId("B234567891D3456789001234")
                const id4 = new ObjectId("D234567891E3456789001234")
                    const id5 = new ObjectId("D234567891F3456789001234")

                    console.log(id1);
                    console.log(id2);
                    console.log(id3);
                    console.log(id4);
                    console.log(id5);
                    console.log(id5.getTimestamp())

                    console.log (ObjectId.isValid('FFFFFFFFFFFFFFFFFFFFFFFF'))


    const query = { _id: new ObjectId(id) };

    console.log(query);
    console.log(query._id.getTimestamp())
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



  const { name, phonenumber, email, dob, tags } = req.body;
  const newUser: User = {
    name: name, phonenumber: phonenumber, email: email, dob: dob,
    tags : tags,
    dateJoined: new Date(), lastUpdated: new Date()
  }



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

  const { name, phonenumber, dob, tags } = req.body
  const newData: Partial<User> = {
    name: name, phonenumber: phonenumber, dob: dob,
    lastUpdated: new Date(),
    tags : tags
  }

  try {

    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.updateOne(query, { $set: newData });

    console.table(result)

    if (result) {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: `Updated User` })
      }
      else if (result.matchedCount == 1) {
        res.status(400).json({ message: `User found but no update` });
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
      res.status(204).json({ message: `Successfully removed user with id ${id}` });
    } else if (!result) {
      res.status(400).json({ message: `Failed to remove user with id ${id}` });
    } else if (result.deletedCount == 0) {
      res.status(404).json({ message: `no user found with id ${id}` });
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
