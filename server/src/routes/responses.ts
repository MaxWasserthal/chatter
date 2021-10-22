import express from 'express'
import { responses } from '../utils/responses';
import { sendResponse } from '../utils/sendResponse';

var router = express.Router();

router.get("/responses", async (req,res) => {
    const resp = await responses(req)
    res.send(resp)
})

router.post("/responses", async (req,res) => {
    const resp = await sendResponse(req)
    res.send(resp);
})

export {router as ResponseRouter};