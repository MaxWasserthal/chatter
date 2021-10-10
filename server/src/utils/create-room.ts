import { Connection } from "typeorm";
import { Member } from "../entities/Member";
import { MemberRoom } from "../entities/MemberRoom";
import { Room } from "../entities/Room";

export const createRoom = async (conn:Connection, values:any, userId:number) => {

    const {title, publ} = values;
    var memberIds = values.members;

    const members = conn.getRepository(Member);

    const mem = await members.findOne( { where: {id: userId} } );

    var mems:Member[] = []

    memberIds.forEach(async (m:any) => {
        mems.push(await (members.findOne({where: {id: m.value}})) as Member)
    })

    let room = new Room()
    room.title = title;
    room.public = publ;
    room.creator = mem as Member;

    const rm = await conn.manager.save(room);

    mems.push(mem as Member);

    mems.forEach( async (memb:Member) => {
        let member_room = new MemberRoom();
        member_room.member = memb as Member;
        member_room.room = rm as Room;
    
        await conn.manager.save(member_room);
    })

    return true;
}