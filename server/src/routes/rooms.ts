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
    room ? res.send(room) : res.sendStatus(500);
})

export {router as RoomRouter};