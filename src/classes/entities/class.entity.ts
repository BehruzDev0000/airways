import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { FlightClass } from "../enums/class.enum";
import { Seat } from "src/seats/entities/seat.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";

@Table({
    tableName:'classes',
    timestamps:true,
    underscored:true
})
export class Class extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number

    @Column({
        type:DataType.ENUM(...Object.values(FlightClass)),
        allowNull:false
    })
    declare name: FlightClass;
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
    })
    declare price:number

    @HasMany(() => Seat, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare seats: Seat[];

    @HasMany(() => Ticket, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare tickets: Ticket[];
}