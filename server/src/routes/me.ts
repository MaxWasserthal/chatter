import express from 'express'
import { deleteMe } from '../utils/deleteMe';
import { me } from '../utils/me';
import { updateMe } from '../utils/updateMe';

var router = express.Router();

router.get("/me", async (req,res) => {
    const username = await me(req)
    res.send(username);
})

router.delete("/me", async (req,res) => {
    await deleteMe(req)
    res.send(200)
})

router.put("/me", async (req,res) => {
    const response = await updateMe(req)
    response.errorRes !== '' ? res.status(500).send({message:response.errorRes}) : res.sendStatus(200)
})

export {router as MeRouter};