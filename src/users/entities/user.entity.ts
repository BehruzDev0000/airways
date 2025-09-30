import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { CarRental } from "src/car-rentals/entities/car-rental.entity";
import { Citizenship } from "src/enums/citizenship.enum";
import { HotelBooking } from "src/hotel-bookings/entities/hotel-booking.entity";
import { Hotel } from "src/hotels/entities/hotel.entity";
import { LoyaltyProgram } from "src/loyalty-programs/entities/loyalty-program.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";

@Table({
    tableName:'users',
    timestamps:true,
    underscored:true
})
export class User extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number;

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare name:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare surname:string
    
    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    declare age:number

    @Column({
        type:DataType.STRING,
        allowNull:false,
    })
    declare email:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare password:string
    
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        defaultValue:0
    })
    declare balance:number

    @Column({
        type:DataType.ENUM(...Object.values(Citizenship)),
        allowNull:false
    })
    declare citizenship:Citizenship

    @Column({
        type:DataType.STRING,
        allowNull:false,
        field:'passport_number'
    })
    declare passportNumber:string

    @HasMany(() => CarRental, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare rentals: CarRental[];

    @HasMany(() => HotelBooking, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare hotel_bookings: HotelBooking[];

    @HasMany(() => Hotel, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare hotels: Hotel[];

    @HasMany(() => LoyaltyProgram, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare loyalty_programs: LoyaltyProgram[];

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
