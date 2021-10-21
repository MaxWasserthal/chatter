import { getConnection, getRepository } from 'typeorm';
import { Request } from 'express';
import { MemberRoom } from '../entities/MemberRoom';
import { Room } from '../entities/Room';
import { Member } from '../entities/Member';

export const updateRoom = async (req:Request) => {

    const rooms = getRepository(Room);

    const room = await rooms.findOne( { where: {id: req.query.roomId} } );

    room!.title = req.body.values.title;
    room!.save()

    var memberIds = req.body.values.members;

    const members = getRepository(Member);
    const mem = await members.findOne( { where: {id: req.session.userId} } );

    var mems:Member[] = [(mem as Member)]

    memberIds.forEach(async (m:any) => {
        mems.push(await (members.findOne({where: {id: m.value}})) as Member)
    })

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(MemberRoom)
    .where("room = :roomId", { roomId: req.query.roomId })
    .execute()

    mems.forEach( async (memb:Member) => {
        let member_room = new MemberRoom();
        member_room.member = memb as Member;
        member_room.room = room as Room;

        await member_room.save();
    })

    return true;
}