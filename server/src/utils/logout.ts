import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { COOKIE_NAME } from "../constants";
import { Logtimes } from "../entities/Logtimes";
import { Member } from "../entities/Member";

export const logout = async (req:Request, res:Response) => {

    const members = getRepository(Member)
    // get current user as member object
    const user = await members.findOne({ where: { id: req.session.userId }})

    const logtimes = getRepository(Logtimes)
    // close logtime
    let logtime = await logtimes.findOne({ where: { member: user }})

    logtime!.timeEnd = new Date
    await logtime?.save()

    // destroy session and cookie
    return new Promise((resolve) => 
            req.session.destroy(err => {
            res.clearCookie(COOKIE_NAME);
            if(err) {
                resolve(false);
                return;
            }

            resolve(true);
        }))
}