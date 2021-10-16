import { Member } from '../entities/Member';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { Message } from '../entities/Message';
import { Room } from '../entities/Room';

export const sendResponse = async (conn:Connection, req:Request) => {

    const members = conn.getRepository(Member);
    const mem = await members.findOne( { where: {id: req.session.userId} } );

    const rooms = conn.getRepository(Room);
    const room = await rooms.findOne({ where: { id: req.query.roomId }})

    let message = new Message()
    message.content = req.body.response.content;
    message.creator = mem as Member;
    message.room = room as Room;
    message.response = parseInt(req.query.messageId as string);

    const resp = await conn.manager.save(message);

    return resp;
}