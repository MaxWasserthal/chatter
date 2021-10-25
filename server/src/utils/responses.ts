import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';

export const responses = async (req:Request) => {

    // get all responses for current message
    const resp = await getRepository(Message)
        .createQueryBuilder("message")
        .select("message")
        .leftJoinAndSelect("message.creator", "member")
        // responses in room
        .where("message.room.id = :rid", { rid: parseInt(req.query.roomId as string) })
        // responses to current message
        .andWhere("message.response = :mid", { mid: parseInt(req.query.messageId as string) })
        .orderBy("message.createdAt")
        .getMany();

    return resp;
}