import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { HotelBooking } from "src/hotel-bookings/entities/hotel-booking.entity";
import { User } from "src/users/entities/user.entity";

@Table({
    tableName:'hotels',
    timestamps:true,
    underscored:true
})
export class Hotel extends Model{

    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare name:string

    @ForeignKey(()=>User)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'user_id'
    })
    declare userId:number

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare address:string

    @Column({
        type:DataType.DECIMAL(2,1),
        allowNull:false,
        validate:{
            min:0.1,
            max:5
        }
    })
    stars:number

    @BelongsTo(()=>User)
    declare user:User


    @HasMany(() => HotelBooking, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare hotel_bookings: HotelBooking[];
}
