import { getRepository } from 'typeorm';
import { Member } from '../entities/Member';
import { Request } from 'express';

export const me = async (req:Request) => {

    const members = getRepository(Member);

    // get current user
    const mem = await members.findOne({ where: {id: req.session.userId} });

    return mem;
}