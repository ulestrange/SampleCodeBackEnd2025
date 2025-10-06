
import { initDb, closeDb } from '../src/database';

beforeAll(async () => {
  console.log('Running bofore all')
  console.log = () => {};
  //await initDb(); // wait for DB to connect

});

afterAll(async () => {
  console.log = console.log;
 // await closeDb();
});