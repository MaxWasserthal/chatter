import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Logtimes } from '../entities/Logtimes';
import { Member } from '../entities/Member';

export const logtimes = async (req:Request) => {

    const members = getRepository(Member)
    const mem = await members.findOne({ where: { id: req.session.userId }})

    // join room with member_room where userid == current users id
    const logtimes = await getRepository(Logtimes)
    .createQueryBuilder("logtimes")
    .select("logtimes")
    .where("logtimes.member = :mem", { mem: mem?.id})
    .orderBy('logtimes.timeStart', "DESC")
    .getMany();

    return logtimes;
}