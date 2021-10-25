import express from 'express'
import { sendReaction } from '../utils/sendReaction';

var router = express.Router();

// creates new reaction to current message
router.post("/reactions", async (req,res) => {
    const reaction = await sendReaction(req)
    res.send(reaction)
})

export {router as ReactionRouter};