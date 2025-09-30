import { BelongsTo, Column,  DataType,  ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { City } from "src/cities/entities/city.entity";
import { Flight } from "src/flights/entities/flight.entity";

@Table({
    tableName:'airports',
    timestamps:true,
    underscored:true,
    indexes:[{ unique:true, fields:['code'] }]
})
export class Airport extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number
    @ForeignKey(()=>City)
    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    declare cityId:number

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
    declare code:string

    @BelongsTo(()=>City)
    declare city:City;


    @HasMany(() => Flight, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare flights: Flight[];
}
