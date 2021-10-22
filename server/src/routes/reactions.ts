import express from 'express'
import { sendReaction } from '../utils/sendReaction';

var router = express.Router();

router.post("/reactions", async (req,res) => {
    const reaction = await sendReaction(req)
    res.send(reaction)
})

export {router as ReactionRouter};