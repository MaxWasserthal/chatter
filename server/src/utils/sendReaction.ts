import { Member } from '../entities/Member';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { Message } from '../entities/Message';
import { Reaction } from '../entities/Reaction';

export const sendReaction = async (conn:Connection, req:Request) => {

    const members = conn.getRepository(Member);
    const mem = await members.findOne( { where: {id: req.session.userId} } );

    const messages = conn.getRepository(Message);
    const message = await messages.findOne({ where: { id: req.body.messageId }})

    let reaction = new Reaction()
    reaction.emoji = req.body.unified as string;
    reaction.reactor = mem as Member;
    reaction.reactionTo = message as Message;

    const reac = await conn.manager.save(reaction);

    return reac;
}