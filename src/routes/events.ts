import express, {Router} from 'express';
import {validate} from '../middleware/validate.middleware';
import {createEventSchema, attendeeSchema}  from '../models/event';

import {
  getEvents,
  getEventById,
  createEvent,
  createAttendeeForEvent,
  deleteEvent,
} from '../controllers/events';

const router: Router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', validate(createEventSchema), createEvent);
router.delete('/:id', deleteEvent);
router.post('/:id/attendees', validate(attendeeSchema), createAttendeeForEvent)

export default router;