import { Request } from "express";
import { getConnection } from "typeorm";
import { Logtimes } from "../entities/Logtimes";
import { Member } from "../entities/Member";
import { MemberRoom } from "../entities/MemberRoom";
import { Room } from "../entities/Room";

export const deleteMe = async (req:Request) => {

    // delete all member_rooms from current user
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(MemberRoom)
    .where("room = :roomId", { roomId: req.query.roomId })
    .execute()

    // delete dm rooms from current user
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Room)
    .where("dm = true")
    .andWhere("creatorId = :cid", { cid: req.session.userId})
    .execute()

    // delete logtimes from current user
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Logtimes)
    .where("memberId = :mid", { mid: req.session.userId })
    .execute()

    // delete the current user
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Member)
    .where("id = :id", { id: req.session.userId })
    .execute()

    return true;
}