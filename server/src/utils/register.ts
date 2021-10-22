import { Member } from '../entities/Member';
import argon2 from 'argon2';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Room } from '../entities/Room';
import { MemberRoom } from '../entities/MemberRoom';

export const register = async (req:Request) => {

    const {email, username, password} = req.body.values;

    const members = getRepository(Member);

    const memberList = await members.find( { where: {blocked: false} } );

    let member = new Member()
    member.username = username
    member.password = await argon2.hash(password)
    member.email = email
    member.blocked = false

    member.save()

    memberList.forEach(async(m) => {
        let room = new Room()
        room.title = m.username + " - " + member.username
        room.public = false
        room.dm = true
        room.creator = member as Member
        await room.save()

        let member_room = new MemberRoom()
        member_room.member = member as Member
        member_room.room = room as Room
        await member_room.save()

        let member_room2 = new MemberRoom()
        member_room2.member = m as Member
        member_room2.room = room as Room
        await member_room2.save()
    })

    return member.id;
}