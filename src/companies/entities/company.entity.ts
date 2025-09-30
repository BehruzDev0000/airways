import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Airlines } from "../enums/company.enum";
import { Car } from "src/cars/entities/car.entity";
import { Plane } from "src/planes/entities/plane.entity";

@Table({
    tableName:'companies',
    timestamps:true,
    underscored:true
})
export class Company extends Model{
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
        type:DataType.ENUM(...Object.values(Airlines)),
        allowNull:false
    })
    declare code:Airlines

    @HasMany(() => Car, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare cars: Car[];

    @HasMany(() => Plane, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        declare planes: Plane[];
}
