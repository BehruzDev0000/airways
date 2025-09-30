import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Class } from "src/classes/entities/class.entity";
import { Flight } from "src/flights/entities/flight.entity";
import { Seat } from "src/seats/entities/seat.entity";
import { User } from "src/users/entities/user.entity";
import { TicketStatus } from "../enums/ticket.enum";

@Table({
    tableName:'tickets',
    timestamps:true,
    underscored:true
})
export class Ticket extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number

    @ForeignKey(()=>Flight)
    @Column({
        type:DataType.INTEGER,
        allowNull:true,
        field:'flight_id'
    })
    declare flightId:number

    @ForeignKey(()=>User)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'user_id'
    })
    declare userId:number

    @ForeignKey(()=>Seat)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'seats_id',
    })
    declare seatsId:number

    @ForeignKey(()=>Class)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'class_id' 
    })
    declare classId:number

    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    declare price:number

    @Column({
        type:DataType.ENUM(...Object.values(TicketStatus)),
        allowNull:false
    })
    declare status:TicketStatus

    @BelongsTo(()=>Flight)
    declare flight:Flight

    @BelongsTo(()=>User)
    declare user:User;

    @BelongsTo(()=>Seat)
    declare seat:Seat;

    @BelongsTo(()=>Class)
    declare class:Class;
}
