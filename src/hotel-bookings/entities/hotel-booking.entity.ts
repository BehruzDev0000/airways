import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Hotel } from "src/hotels/entities/hotel.entity";
import { User } from "src/users/entities/user.entity";
import { BookingStatus, RoomType } from "../enums/hotel.enum";

@Table({
    tableName:'hotel_bookings',
    timestamps:true,
    underscored:true
})
export class HotelBooking extends Model{

    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number
    
    @ForeignKey(()=>User)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'user_id'
    })
    declare userId:number

    @ForeignKey(()=>Hotel)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'hotel_id'
    })
    declare hotelId:number

    @Column({
        type:DataType.ENUM(...Object.values(RoomType)),
        allowNull:false
    })
    room_type: RoomType;

    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    declare price:number

    @Column({
        type:DataType.DATE,
        allowNull:false
    })
    declare check_in:Date

    @Column({
        type:DataType.DATE,
        allowNull:false
    })
    declare check_out:Date

    @Column({
        type:DataType.ENUM(...Object.values(BookingStatus)),
        allowNull:false
    })
    declare status: BookingStatus;

    @BelongsTo(()=>User)
    declare user:User;

    @BelongsTo(()=>Hotel)
    declare hotel:Hotel;
}
