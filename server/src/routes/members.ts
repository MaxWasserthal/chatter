import express from 'express'
import { members } from '../utils/members';

var router = express.Router();

// gets all members
router.get("/members", async (req,res) => {
    const mems = await members(req)
    res.send(mems);
})

export {router as MembersRouter};