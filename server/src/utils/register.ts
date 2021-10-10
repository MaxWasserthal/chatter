import { Connection } from 'typeorm';
import { Member } from '../entities/Member';
import argon2 from 'argon2';

export const register = async (conn:Connection, values:any) => {

    const {email, username, password} = values;

    let member = new Member()
    member.username = username
    member.password = await argon2.hash(password)
    member.email = email
    member.blocked = false

    const mem = await conn.manager.save(member);

    return mem?.id;
}