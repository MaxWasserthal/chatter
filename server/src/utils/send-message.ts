import { Member } from '../entities/Member';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { Message } from '../entities/Message';
import { Room } from '../entities/Room';

export const sendMessage = async (conn:Connection, req:Request) => {

    console.log(req.body.message.content)

    const userId = req.session.userId;
    const roomId = req.query.roomId;

    const members = conn.getRepository(Member);

    const mem = await members.findOne( { where: {id: userId} } );

    const rooms = conn.getRepository(Room);

    const room = await rooms.findOne({ where: { id: roomId }})

    let message = new Message()
    message.content = req.body.message.content;
    message.creator = mem as Member;
    message.room = room as Room;

    const ms = await conn.manager.save(message);

    return ms;
}