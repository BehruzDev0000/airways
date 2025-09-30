import { Column, DataType, Model, Table } from "sequelize-typescript";
import { WorkerRole } from "../enum/worker.enum";
import { Citizenship } from "src/enums/citizenship.enum";
@Table({
    tableName:'workers',
    timestamps:true,
    underscored:true
})
export class Worker extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id: number;

    @Column({
        type:DataType.STRING,
        allowNull:false,
    })
    declare full_name:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare email:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare password:string
    @Column({
        type:DataType.ENUM(...Object.values(WorkerRole)),
        allowNull:false
    })
    declare role: WorkerRole;
    @Column({
        type:DataType.ENUM(...Object.values(Citizenship)),
        allowNull:false
    })
    declare citizenship: Citizenship;


}
