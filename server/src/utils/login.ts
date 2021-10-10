import { Connection } from 'typeorm';
import { Member } from '../entities/Member';
import argon2 from 'argon2'

export const login = async (conn:Connection, values:any) => {

    const members = conn.getRepository(Member);
    const {usernameOrEmail, password} = values;

    const mem = await members.findOne( usernameOrEmail.includes("@") ? { where: {email: usernameOrEmail}} : { where: {username: usernameOrEmail} });

    const valid = await argon2.verify(mem!.password, password)

    return valid ? mem!.id : undefined;
}