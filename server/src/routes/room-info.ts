import express from 'express'
import { getRoomInfo } from '../utils/getRoomInfo';
import { updateRoom } from '../utils/updateRoom';

var router = express.Router();

router.put("/room-info", async (req,res) => {
    const response = await updateRoom(req)
    response.errorRes !== '' ? res.status(500).send({message:response.errorRes}) : res.sendStatus(200)
})

router.get("/room-info", async (req,res) => {
    const room = await getRoomInfo(req)
    res.send(room)
})

export {router as RoomInfoRouter};