import { getRepository } from 'typeorm';
import { Member } from '../entities/Member';
import argon2 from 'argon2'
import { Logtimes } from '../entities/Logtimes';

// define response structure
interface ResponseWithError {
    userId: number,
    errorRes: string,
}

export const login = async (values:any) => {

    const members = getRepository(Member)
    // destructure request values
    const {usernameOrEmail, password} = values

    var res:ResponseWithError = {
        userId: 0,
        errorRes: "",
    }

    var valid = false

    // find user by email or username
    const mem = await members.findOne( usernameOrEmail.includes("@") ? { where: {email: usernameOrEmail}} : { where: {username: usernameOrEmail} })

    // verify password via argon2
    mem ? 
        valid = await argon2.verify(mem!.password, password)
    : res.errorRes = "Username or password invalid"

    // define response based on verification
    valid ? res.userId = mem!.id : res.errorRes = "Username or password invalid"

    const logtimes = getRepository(Logtimes)
    // check if there already is an open logtime for the user
    const logtime = await logtimes.findOne({where: {timeEnd: null, member: mem}})

    // if no logtime exists, create a new one
    if(!logtime) {
        let newTime = new Logtimes()
        newTime.timeStart = new Date
        newTime.member = mem as Member
        await newTime.save()
    }

    return res
}