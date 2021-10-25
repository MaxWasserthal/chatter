import { getRepository } from 'typeorm';
import { Member } from '../entities/Member';
import { Request } from 'express';

export const members = async (req:Request) => {

    // get all members that are not blocked
    const mem = await getRepository(Member)
        .createQueryBuilder("member")
        .select("member")
        .where("member.id != :id", { id: req.session.userId })
        .andWhere("member.blocked != :blocked", { blocked: true })
        .getMany();

    return mem;
}