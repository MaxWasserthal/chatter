import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, UpdateDateColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Message } from './Message';
import { Reaction } from './Reaction';
import { Role } from './Role';
import { Room } from './Room';
import { MemberRoom } from './MemberRoom';

@Entity()
export class Member extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;

    @Column()
    blocked: boolean;

    @Column({
        nullable: true,
    })
    verified: boolean;

    @Column({
        nullable: true,
    })
    telephone: string;

    @Column({
        nullable: true,
    })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //joined Rooms
    @OneToMany(() => MemberRoom, memberroom => memberroom.member)
    memberroom: MemberRoom[];

    //created Rooms
    @OneToMany(() => Room, room => room.creator)
    createdRoom: Room[];

    //written messages
    @OneToMany(() => Message, message => message.creator)
    message: Message[];

    @OneToMany(() => Reaction, reaction => reaction.reactor)
    reaction: Reaction[];

    @ManyToOne(() => Role, role => role.id)
    role: Role;
}