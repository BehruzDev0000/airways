import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";
import { LoyaltyLevel } from "../enums/loyalty.enum";

@Table({
    tableName:'loyalty_programs',
    timestamps:true,
    underscored:true
})
export class LoyaltyProgram extends Model{
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

    @Column({
        type:DataType.INTEGER,
        allowNull:false,
    })
    points:number

    @Column({
        type:DataType.ENUM(...Object.values(LoyaltyLevel)),
        allowNull:false
    })
    level:LoyaltyLevel

    @BelongsTo(()=>User)
    declare user:User;
}
