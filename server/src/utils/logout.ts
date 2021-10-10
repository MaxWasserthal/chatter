import { Request, Response } from "express";
import { COOKIE_NAME } from "../constants";

export const logout = async (req:Request, res:Response) => {

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