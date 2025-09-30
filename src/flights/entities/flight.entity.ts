import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Airport } from "src/airports/entities/airport.entity";
import { Plane } from "src/planes/entities/plane.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { FlightStatus } from "../enums/flight.enum";

@Table({
    tableName:'flights',
    timestamps:true,
    underscored:true
})
export class Flight extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number
    
    @ForeignKey(()=>Plane)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'plane_id'
    })
    declare planeId:number

    @ForeignKey(()=>Airport)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'departure_airport_id'
    })
    declare departureAirportId:number

    @ForeignKey(()=>Airport)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'arrival_airport_id'
    })
    declare arrivalAirportId:number

    @Column({
        type:DataType.DATE,
        allowNull:false,
        field:'departure_time'
    })
    declare departureTime:Date

    @Column({
        type:DataType.DATE,
        allowNull:false,
        field:'arrival_time'
    })
    declare arrivalTime:Date

    @Column({
        type:DataType.ENUM(...Object.values(FlightStatus)),
        allowNull:false
    })
    declare status: FlightStatus;
    
    @BelongsTo(() => Plane, { foreignKey: 'planeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    declare plane: Plane;

    @BelongsTo(() => Airport, { foreignKey: 'departureAirportId', as: 'departureAirport', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    declare departureAirport: Airport;

    @BelongsTo(() => Airport, { foreignKey: 'arrivalAirportId', as: 'arrivalAirport', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    declare arrivalAirport: Airport;

    @HasMany(() => Review, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
    })
    declare reviews: Review[];

    @HasMany(() => Ticket, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
    })
    declare tickets: Ticket[];
}
