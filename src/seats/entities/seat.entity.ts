import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany} from "sequelize-typescript";
import { Class } from "src/classes/entities/class.entity";
import { Plane } from "src/planes/entities/plane.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";

@Table({
    tableName:'seats',
    timestamps:true,
    underscored:true
})
export class Seat extends Model{
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
   
   @ForeignKey(()=>Class)
   @Column({
    type:DataType.INTEGER,
    allowNull:false,
    field:'class_id' 
   })
   declare classId:number

   @Column({
    type:DataType.INTEGER,
    allowNull:false,
    field:'seat_number'
   })
   declare seatNumber:number

   @BelongsTo(()=>Plane)
   declare plane:Plane;

   @BelongsTo(()=>Class)
   declare class:Class;

   @HasMany(() => Ticket, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare tickets: Ticket[];
}
