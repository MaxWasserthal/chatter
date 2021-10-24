import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./Member";

@Entity()
export class Logtimes extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timeStart: Date;

    @Column({nullable: true})
    timeEnd: Date;

    @ManyToOne(() => Member, member => member.id)
    member: Member;
}