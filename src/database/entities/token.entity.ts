import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    hash: string;

    @Column({length: 100})
    username: string;
}