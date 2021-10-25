import { getConnection, getRepository } from 'typeorm';
import { Request } from 'express';
import { MemberRoom } from '../entities/MemberRoom';
import { Room } from '../entities/Room';
import { Member } from '../entities/Member';

// define response structure
interface ResponseWithError {
    errorRes: string,
}

export const updateRoom = async (req:Request) => {

    const rooms = getRepository(Room);

    var res:ResponseWithError = {
        errorRes: "",
    }

    const room = await rooms.findOne( { where: {id: req.query.roomId} } );

    // update room title
    room!.title = req.body.values.title;
    // save room, catch error if room title already exists
    room!.save().catch(() => {
        // fill error response message
        res.errorRes = "Room already exists"
    })

    var memberIds = req.body.values.members;

    const members = getRepository(Member);
    const mem = await members.findOne( { where: {id: req.session.userId} } );

    // get defined members
    var mems:Member[] = [(mem as Member)]

    memberIds.forEach(async (m:any) => {
        mems.push(await (members.findOne({where: {id: m.value}})) as Member)
    })

    // remove current member_rooms
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(MemberRoom)
    .where("room = :roomId", { roomId: req.query.roomId })
    .execute()

    // for each member create a new member_room
    mems.forEach( async (memb:Member) => {
        let member_room = new MemberRoom();
        member_room.member = memb as Member;
        member_room.room = room as Room;

        // save new member_room, catch error
        await member_room.save().catch(() => {
            res.errorRes = "Something went wrong"
        });
    })

    return res;
}