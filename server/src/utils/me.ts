import { Connection } from 'typeorm';
import { Member } from '../entities/Member';
import { Request } from 'express';

export const me = async (conn:Connection, req:Request) => {

    const members = conn.getRepository(Member);

    const mem = await members.findOne({ where: {id: req.session.userId} });

    return mem?.username;
}