import express from 'express'
import { createRoom } from '../utils/createRoom';
import { deleteRoom } from '../utils/deleteRoom';
import { rooms } from '../utils/rooms';

var router = express.Router();

router.get("/rooms", async (req,res) => {
    const myrooms = await rooms(req)
    res.send(myrooms)
})

router.delete("/rooms", async (req,res) => {
    await deleteRoom(req)
    res.sendStatus(200)
})

router.post("/rooms", async (req,res) => {
    const room = await createRoom(req)
    room.errorRes !== "" ? res.status(500).send({message:"Room already exists"}) : res.send(room)
})

export {router as RoomRouter};