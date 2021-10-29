import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';
import { Reaction } from '../entities/Reaction';

export const messages = async (req:Request) => {

    const roomId = req.query.roomId
    const limit = 5
    const offset = parseInt(req.query.page as string) * limit

    const mes = await getRepository(Message)
        .createQueryBuilder("message")
        .select("message")
        .addSelect(
            // subselect -> aggregation of responses to current message
            qb =>
                qb
                .select('COUNT(*)', 'responseCount')
                .from(Message, 'r')
                .where('r.responseId = message.id'),
            'responseCount',
        )
        .addSelect(
            // subselect -> get reactions to current message
            qb =>
                qb
                .select("array_agg(reac.emoji)")
                .from(Reaction, 'reac')
                .where('reac.reactionTo = message.id')
                .groupBy('reac.reactionTo'),
            'reactions',
        )
        // join to get the creator of the message
        .leftJoinAndSelect("message.creator", "member")
        .where("message.room.id = :id", { id: roomId })
        // check if message is not a response
        .andWhere("message.responseId isnull")
        .orderBy("message.createdAt", "DESC")
        .limit(limit)
        .offset(offset)
        // get raw, because subquery is only returned on raw response
        .getRawMany().catch((err) => {
            return err;
        })

    return mes;
}