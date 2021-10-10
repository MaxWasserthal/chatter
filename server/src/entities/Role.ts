import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member';

@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    title: string;

    @OneToMany(() => Member, member => member.id)
    member: Member[];
}