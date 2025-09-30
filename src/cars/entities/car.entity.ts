import { BelongsTo, BeforeSync, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { CarRental } from "src/car-rentals/entities/car-rental.entity";
import { City } from "src/cities/entities/city.entity";
import { Company } from "src/companies/entities/company.entity";

@Table({
    tableName:'cars',
    timestamps:true,
    underscored:true
})
export class Car extends Model{

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
        type:DataType.STRING,
        allowNull:false
    })
    declare phone:string

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare model: string;

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull:false,
        validate: { min: 0 ,isDecimal:true},
        field:'daily_price'
    })
    declare dailyPrice: string;

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull:false,
        validate: { min: 0 ,isDecimal:true},
        field:'hourly_price'
    })
    declare hourlyPrice: string;
    
    @ForeignKey(()=>City)
    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        field:'city_id'
    })
    declare cityId:number

    @BelongsTo(()=>Company)
    declare company: Company;

    @BelongsTo(()=>City)
    declare city: City;

    @HasMany(() => CarRental, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    declare rentals: CarRental[];

    @BeforeSync
    static async ensureHourlyPriceColumn(): Promise<void> {
        const sequelize = this.sequelize;
        if (!sequelize) {
            return;
        }

        const queryInterface = sequelize.getQueryInterface();
        try {
            const columns = await queryInterface.describeTable('cars');
            if (!('hourly_price' in columns)) {
                await queryInterface.addColumn('cars', 'hourly_price', {
                    type: DataType.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                });
            }
        } catch (error) {}
    }
}
