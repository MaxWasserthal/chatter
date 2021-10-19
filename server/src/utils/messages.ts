import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';

export const messages = async (roomId:string) => {

    const mes = await getRepository(Message)
        .createQueryBuilder("message")
        .select("message")
        .addSelect(
            qb =>
                qb
                .select('COUNT(*)', 'responseCount')
                .from(Message, 'r')
                .where('r.responseId = message.id'),
            'responseCount',
        )
        .leftJoinAndSelect("message.creator", "member")
        .where("message.room.id = :id", { id: roomId })
        .andWhere("message.responseId isnull")
        .orderBy("message.createdAt")
        .getRawMany();

    return mes;
}