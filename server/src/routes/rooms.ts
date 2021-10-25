import express from 'express'
import { createRoom } from '../utils/createRoom';
import { deleteRoom } from '../utils/deleteRoom';
import { rooms } from '../utils/rooms';

var router = express.Router();

// gets all rooms for current user
router.get("/rooms", async (req,res) => {
    const myrooms = await rooms(req)
    res.send(myrooms)
})

// deletes current room
router.delete("/rooms", async (req,res) => {
    await deleteRoom(req)
    res.sendStatus(200)
})

// creates new room from current user
router.post("/rooms", async (req,res) => {
    const room = await createRoom(req)
    // if error is thrown -> send error status and error message, else return the created room
    room.errorRes !== "" ? res.status(500).send({message:"Room already exists"}) : res.send(room)
})

export {router as RoomRouter};