import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";
import { Room } from "./Room";

@Entity()
export class MemberRoom extends BaseEntity {

    // table to map users and rooms they are members in
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Member, member => member.memberroom)
    member: Member;

    @ManyToOne(() => Room, room => room.memberroom)
    room: Room;
}