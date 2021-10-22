import { Member } from '../entities/Member';
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Message } from '../entities/Message';
import { Reaction } from '../entities/Reaction';

export const sendReaction = async (req:Request) => {

    const members = getRepository(Member);
    const mem = await members.findOne( { where: {id: req.session.userId} } );

    const messages = getRepository(Message);
    const message = await messages.findOne({ where: { id: req.body.messageId }})

    let reaction = new Reaction()
    reaction.emoji = req.body.unified as string;
    reaction.reactor = mem as Member;
    reaction.reactionTo = message as Message;

    await reaction.save()

    return reaction;
}