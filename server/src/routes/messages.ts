import express from 'express'
import { messages } from '../utils/messages';
import { sendMessage } from '../utils/sendMessage';

var router = express.Router();

// gets all messages in room
router.get("/messages", async (req,res) => {
    const mess = await messages(req)
    res.send(mess)
})

// creates new message in current room
router.post("/messages", async (req,res) => {
    const mes = await sendMessage(req)
    res.send(mes)
})

export {router as MessageRouter};