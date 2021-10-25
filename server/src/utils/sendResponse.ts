import { Member } from '../entities/Member';
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Message } from '../entities/Message';
import { Room } from '../entities/Room';

export const sendResponse = async (req:Request) => {

    const members = getRepository(Member);
    const mem = await members.findOne( { where: {id: req.session.userId} } );

    const rooms = getRepository(Room);
    const room = await rooms.findOne({ where: { id: req.query.roomId }})

    // create new message instance
    let message = new Message()
    message.content = req.body.response;
    message.creator = mem as Member;
    message.room = room as Room;
    // set connection to original message
    message.response = parseInt(req.query.messageId as string);

    await message.save()

    return message;
}