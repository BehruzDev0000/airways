import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName:'news',
    timestamps:true,
    underscored:true
})
export class News extends Model{

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
    declare title:string

    @Column({
        type:DataType.TEXT,
        allowNull:false
    })
    declare content:string

   @Column({
        type:DataType.STRING,
        allowNull:false
   })
    declare image:string
}
