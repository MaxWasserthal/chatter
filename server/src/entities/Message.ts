import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, BaseEntity } from 'typeorm';
import { Reaction } from './Reaction';
import { Room } from './Room';
import { Member } from './Member';

@Entity()
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    // //creator of message
    @ManyToOne(() => Member, user => user.message)
    creator: Member;

    //room of message
    @ManyToOne(() => Room, room => room.messages)
    room: Room;

    //reaction to message
    @OneToMany(() => Reaction, reaction => reaction.reactionTo)
    reaction: Reaction[];

    //response to other message
    @ManyToOne(() => Message, message => message.id)
    response?: number;
}