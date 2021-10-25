import { getRepository } from 'typeorm';
import { Request } from 'express';
import { MemberRoom } from '../entities/MemberRoom';
import { Room } from '../entities/Room';

export const rooms = async (req:Request) => {

    // join room with member_room where userid == current users id
    const rooms = await getRepository(Room)
    .createQueryBuilder("room")
    .leftJoinAndSelect(MemberRoom, 'memberroom', 'room.id = memberroom.roomId')
    // check if user is member of room
    .where('memberroom.memberId = :memberId', { memberId: req.session.userId })
    // or if room is public
    .orWhere('room.public = :public', { public: true })
    .orderBy('room.createdAt')
    .getMany();

    return rooms;
}