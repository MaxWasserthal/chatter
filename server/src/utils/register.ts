import { Member } from '../entities/Member';
import argon2 from 'argon2';
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Room } from '../entities/Room';
import { MemberRoom } from '../entities/MemberRoom';

// define response structure
interface ResponseWithError {
    userId: number,
    errorRes: string,
}

export const register = async (req:Request) => {

    // destructure request body
    const {email, username, password, telephone, description} = req.body.values;

    var res:ResponseWithError = {
        userId: 0,
        errorRes: "",
    }

    const members = getRepository(Member);

    const memberList = await members.find( { where: {blocked: false} } );

    // check if email is already taken
    const duplicateEmail = await members.findOne({ where: {email: email}})
    // check if username is already taken
    const duplicateUsername = await members.findOne({ where: {username: username}})
    // fill and return error response based on duplicate entries
    if(duplicateEmail) {
        res.errorRes = "Email is already taken"
        return res
    } else if(duplicateUsername) {
        res.errorRes = "Username is already taken"
        return res
    }

    // create a new member
    let member = new Member()
    member.username = username
    // hash the password
    member.password = await argon2.hash(password)
    member.email = email
    member.telephone = telephone
    member.description = description
    member.blocked = false
    member.verified = false

    await member.save()

    // set userId in response object
    res.userId = member.id

    // create direct message rooms for every user that already exists
    memberList.forEach(async(m) => {
        let room = new Room()
        room.title = m.username + " - " + member.username
        room.public = false
        room.dm = true
        room.creator = member as Member
        await room.save()

        // add the member_rooms for the two participants
        let member_room = new MemberRoom()
        member_room.member = member as Member
        member_room.room = room as Room
        await member_room.save()

        let member_room2 = new MemberRoom()
        member_room2.member = m as Member
        member_room2.room = room as Room
        await member_room2.save()
    })

    return res;
}