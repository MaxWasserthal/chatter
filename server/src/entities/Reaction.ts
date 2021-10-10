import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Message } from './Message';
import { Member } from './Member';

@Entity()
export class Reaction extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    emoji: string;

    // //user that reacted
    @ManyToOne(() => Member, user => user.reaction, {
        onDelete: 'CASCADE',
    })
    reactor: Member;

    //message reacted to
    @ManyToOne(() => Message, message => message.reaction, {
        onDelete: 'CASCADE',
    })
    reactionTo: Message;
}