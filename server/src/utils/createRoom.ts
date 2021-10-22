import { Request } from "express";
import { getRepository } from "typeorm";
import { Member } from "../entities/Member";
import { MemberRoom } from "../entities/MemberRoom";
import { Room } from "../entities/Room";

export const createRoom = async (req:Request) => {

    const {title, publ} = req.body.values
    var memberIds = req.body.values.members
    const userId = req.session.userId

    const members = getRepository(Member);

    const mem = await members.findOne( { where: {id: userId} } );

    var mems:Member[] = []

    memberIds.forEach(async (m:any) => {
        mems.push(await (members.findOne({where: {id: m.value}})) as Member)
    })

    let room = new Room()
    room.title = title;
    room.public = publ;
    room.creator = mem as Member;

    await room.save()

    mems.push(mem as Member);

    mems.forEach( async (memb:Member) => {
        let member_room = new MemberRoom();
        member_room.member = memb as Member;
        member_room.room = room as Room;
    
        await member_room.save()
    })

    return room;
}