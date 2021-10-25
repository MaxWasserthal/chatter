import { getRepository } from "typeorm";
import { Member } from "../entities/Member";
import { Request } from 'express'

// define response structure
interface ResponseWithError {
    errorRes: string,
}

export const updateMe = async (req:Request) => {

    const members = getRepository(Member);

    // destructure request bodyy
    const {username, email, telephone, description} = req.body.values

    var res:ResponseWithError = {
        errorRes: "",
    }

    const member = await members.findOne({ where: { id: req.session.userId }})

    if(member) {
        // update member values
        member.username = username
        member.email = email
        member.description = description
        member.telephone = telephone
        // save member, catch on error
        await member?.save().catch(() => {
            res.errorRes = "Somethin went wrong"
        })
    }

    return res
}