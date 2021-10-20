import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';
import { Reaction } from '../entities/Reaction';

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
        .addSelect(
            qb =>
                qb
                .select("array_agg(reac.emoji)")
                .from(Reaction, 'reac')
                .where('reac.reactionTo = message.id')
                .groupBy('reac.reactionTo'),
            'reactions',
        )
        .leftJoinAndSelect("message.creator", "member")
        .where("message.room.id = :id", { id: roomId })
        .andWhere("message.responseId isnull")
        .orderBy("message.createdAt")
        .getRawMany();

    return mes;
}