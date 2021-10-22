import { Member } from '../entities/Member';
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Message } from '../entities/Message';
import { Room } from '../entities/Room';

export const sendMessage = async (req:Request) => {

    const userId = req.session.userId;
    const roomId = req.query.roomId;

    const members = getRepository(Member);

    const mem = await members.findOne( { where: {id: userId} } );

    const rooms = getRepository(Room);

    const room = await rooms.findOne({ where: { id: roomId }})

    let message = new Message()
    message.content = req.body.message.content as string;
    message.creator = mem as Member;
    message.room = room as Room;

    await message.save()

    return message;
}