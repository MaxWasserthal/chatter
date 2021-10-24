import { getRepository } from 'typeorm';
import { Member } from '../entities/Member';
import argon2 from 'argon2'
import { Logtimes } from '../entities/Logtimes';

interface ResponseWithError {
    userId: number,
    errorRes: string,
}

export const login = async (values:any) => {

    const members = getRepository(Member)
    const {usernameOrEmail, password} = values

    var res:ResponseWithError = {
        userId: 0,
        errorRes: "",
    }

    var valid = false

    const mem = await members.findOne( usernameOrEmail.includes("@") ? { where: {email: usernameOrEmail}} : { where: {username: usernameOrEmail} })

    mem ? 
        valid = await argon2.verify(mem!.password, password)
    : res.errorRes = "Username or password invalid"

    valid ? res.userId = mem!.id : res.errorRes = "Username or password invalid"

    const logtimes = getRepository(Logtimes)
    const logtime = await logtimes.findOne({where: {timeEnd: null, member: mem}})

    if(!logtime) {
        let newTime = new Logtimes()
        newTime.timeStart = new Date
        newTime.member = mem as Member
        await newTime.save()
    }

    return res
}