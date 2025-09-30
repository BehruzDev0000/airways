import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Airport } from "src/airports/entities/airport.entity";
import { Car } from "src/cars/entities/car.entity";
import { Country } from "src/countries/entities/country.entity";
@Table({
    tableName:'cities',
    timestamps:true,
    underscored:true
})
export class City extends Model{

    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number

    @ForeignKey(()=>Country)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'country_id'
    })
    declare countryId:Country

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare name:string

    @BelongsTo(()=>Country)
    declare country:Country

    @HasMany(() => Airport, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare airports: Airport[];

    @HasMany(() => Car, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare cars: Car[];
}
