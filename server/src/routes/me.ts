import express from 'express'
import { deleteMe } from '../utils/deleteMe';
import { me } from '../utils/me';
import { updateMe } from '../utils/updateMe';

var router = express.Router();

// gets current user 
router.get("/me", async (req,res) => {
    const member = await me(req)
    res.send(member);
})

// deletes current user
router.delete("/me", async (req,res) => {
    await deleteMe(req)
    res.send(200)
})

// updates current user
router.put("/me", async (req,res) => {
    const response = await updateMe(req)
    // if error is thrown -> send error status and message, else send ok
    response.errorRes !== '' ? res.status(500).send({message:response.errorRes}) : res.sendStatus(200)
})

export {router as MeRouter};