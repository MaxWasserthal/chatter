import express from 'express'
import { getRoomInfo } from '../utils/getRoomInfo';
import { updateRoom } from '../utils/updateRoom';

var router = express.Router();

// updates info on current room
router.put("/room-info", async (req,res) => {
    const response = await updateRoom(req)
    // if error is thrown -> send error status and error message, else send ok
    response.errorRes !== '' ? res.status(500).send({message:response.errorRes}) : res.sendStatus(200)
})

// gets room info on current room
router.get("/room-info", async (req,res) => {
    const room = await getRoomInfo(req)
    res.send(room)
})

export {router as RoomInfoRouter};