import { Column, DataType, Model, Table } from "sequelize-typescript";
import { AdminRole } from "../enums/admin.enum";

@Table({
    tableName:'admins',
    timestamps:true,
    underscored:true,
    indexes:[
        { unique:true, fields:['email'] },
        { unique:true, fields:['username'] }
    ]
})
export class Admin extends Model{
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
    @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    declare username:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare phone:string

     @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    declare email:string

     @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare password:string

    @Column({
        type:DataType.ENUM(...Object.values(AdminRole)),
        allowNull:false
    })
    declare role:AdminRole
}
