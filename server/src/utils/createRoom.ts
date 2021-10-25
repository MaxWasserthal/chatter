import { Request } from "express";
import { getRepository } from "typeorm";
import { Member } from "../entities/Member";
import { MemberRoom } from "../entities/MemberRoom";
import { Room } from "../entities/Room";

// define response structure
interface ResponseWithError {
    roomRes: Room,
    errorRes: string,
}

export const createRoom = async (req:Request) => {

    // destructure request body
    const {title, publ, dm} = req.body.values
    var memberIds = req.body.values.members
    const userId = req.session.userId

    var res:ResponseWithError = {
        roomRes: {} as Room,
        errorRes: "",
    }

    const members = getRepository(Member)

    // get current user as member instance
    const mem = await members.findOne( { where: {id: userId} })

    // collection for all members
    var mems:Member[] = []

    // fill member collection
    memberIds.forEach(async (m:any) => {
        mems.push(await (members.findOne({where: {id: m.value}})) as Member)
    })

    // create new room with values
    let room = new Room()
    room.title = title
    room.public = publ
    room.dm = dm
    room.creator = mem as Member

    // include room into response object
    res.roomRes = room as Room

    // save room, catch error when room title already exists
    await room.save().catch(() => {
        res.errorRes = "Room already exists"
    })

    // push current user into member object
    mems.push(mem as Member);

    // create member_rooms for every user and newly created room
    mems.forEach( async (memb:Member) => {
        let member_room = new MemberRoom()
        member_room.member = memb as Member
        member_room.room = room as Room
    
        // save each member_room, catch on error
        await member_room.save().catch(() => {
            res.errorRes = "Something went wrong"
        })
    })

    return res;
}