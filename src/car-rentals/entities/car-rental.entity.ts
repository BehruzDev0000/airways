import {  BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Car } from "src/cars/entities/car.entity";
import { User } from "src/users/entities/user.entity";
import { CarBookingStatus } from "../enums/car.enum";

@Table({
    tableName:'car_rentals',
    timestamps:true,
    underscored:true
})
export class CarRental extends Model{
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

  @ForeignKey(()=>Car)
  @Column({
    type:DataType.INTEGER,
    allowNull:false,
    field:'car_id'
  })
  declare carId:number

  @Column({
    type:DataType.STRING,
    allowNull:false,
    field:'pickup_location'
  })
  declare pickUpLocation:string

  @Column({
    type:DataType.STRING,
    allowNull:false,
    field:'dropoff_location'
  })
  declare dropOffUpLocation:string

  @Column({
    type:DataType.INTEGER,
    allowNull:false
  })
  declare ride_time:number

  @Column({
    type:DataType.INTEGER,
    allowNull:false,
    field:'total_price'
  })
  declare totalPrice:number

  @Column({
    type:DataType.ENUM(...Object.values(CarBookingStatus)),
    allowNull:false,
  })
  declare status:CarBookingStatus

  @BelongsTo(()=>User)
  declare user:User

  @BelongsTo(()=>Car)
  declare car:Car
}
