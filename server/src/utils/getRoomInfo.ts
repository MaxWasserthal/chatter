import { getRepository } from 'typeorm';
import { Request } from 'express';
import { MemberRoom } from '../entities/MemberRoom';
import { Room } from '../entities/Room';
import { Member } from '../entities/Member';

export const getRoomInfo = async (req:Request) => {

    const room = await getRepository(Room)
    .createQueryBuilder("room")
    .select("room")
    .addSelect(
        qb =>
            qb
            .select("array_agg(m.username || ',' || m.id)")
            .from(Member, 'm')
            .leftJoin(MemberRoom, "mr", "mr.member = m.id")
            .where('mr.room = room.id')
            .groupBy('mr.room'),
        'members',
    )
    .leftJoinAndSelect("room.creator", "member")
    .where("room.id = :roomId", { roomId: parseInt(req.query.roomId as string) })
    .getRawOne();

    return room;
}