import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Company } from "src/companies/entities/company.entity";
import { PlanesModel } from "../enums/plane.enum";
import { Flight } from "src/flights/entities/flight.entity";
import { Seat } from "src/seats/entities/seat.entity";

@Table({
    tableName:'planes',
    timestamps:true,
    underscored:true
})

export class Plane extends Model{
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    declare id:number

    @ForeignKey(()=>Company)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'company_id'
    })
    declare companyId:number

    @Column({
        type:DataType.ENUM(...Object.values(PlanesModel)),
        allowNull:false
    })
    declare model:PlanesModel

    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    declare capacity:number

    @BelongsTo(()=>Company)
    declare company: Company;

    @HasMany(() => Flight, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare flights: Flight[];

    @HasMany(() => Seat, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        declare seats: Seat[];
}
