import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { City } from "src/cities/entities/city.entity";
import { Citizenship } from "src/enums/citizenship.enum";
@Table({
    tableName:'countries',
    timestamps:true,
    underscored:true,
})
export class Country extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number

    @Column({
        type:DataType.ENUM(...Object.values(Citizenship)),
        allowNull:false,
        unique:true
    })
    declare name: Citizenship;

    @HasMany(() => City, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare cities: City[];
}
