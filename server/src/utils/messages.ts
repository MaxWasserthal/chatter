import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';

export const messages = async (roomId:string) => {

    const mes = await getRepository(Message)
        .createQueryBuilder("message")
        .select("message")
        .leftJoinAndSelect("message.creator", "member")
        .where("message.room.id = :id", { id: roomId })
        .andWhere("message.responseId isnull")
        .orderBy("message.createdAt")
        .getMany();

    return mes;
}