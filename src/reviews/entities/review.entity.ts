import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Flight } from "src/flights/entities/flight.entity";
import { User } from "src/users/entities/user.entity";

@Table({
    tableName:'reviews',
    timestamps:true,
    underscored:true
})
export class Review extends Model{
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
    userId:number

    @ForeignKey(()=>Flight)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'flight_id'
    })
    declare flightId:number

    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    declare rating:number

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare comment:string

    @BelongsTo(()=>User)
    declare user:User;

    @BelongsTo(()=>Flight)
    declare flight:Flight;
}
