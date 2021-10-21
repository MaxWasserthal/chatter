import { getConnection } from 'typeorm';
import { Request } from 'express';
import { MemberRoom } from '../entities/MemberRoom';
import { Room } from '../entities/Room';

export const deleteRoom = async (req:Request) => {

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(MemberRoom)
    .where("room = :roomId", { roomId: req.query.roomId })
    .execute()

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Room)
    .where("id = :id", { id: req.query.roomId })
    .execute()

    return true;

}