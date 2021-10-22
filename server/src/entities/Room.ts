import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany, UpdateDateColumn, BaseEntity } from 'typeorm';
import { Member } from './Member';
import { MemberRoom } from './MemberRoom';
import { Message } from './Message';

@Entity()
export class Room extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    title: string;

    @Column()
    public: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    dm?: boolean;

    //creator of room
    @ManyToOne(() => Member, user => user.id)
    creator: Member;

    //messages in room
    @OneToMany(() => Message, message => message.room, {
        onDelete: 'CASCADE',
    })
    messages: Message[];

    //users in room
    @OneToMany(() => MemberRoom, memberroom => memberroom.room)
    memberroom: MemberRoom[];

}