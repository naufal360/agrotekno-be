const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const DimensionResult = sequelize.define(
        "DimensionResult",
        {
            id:  {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: DataTypes.ENUM("EKONOMI", "SOSIAL", "LINGKUNGAN"),
                allowNull: false,
            },
            grade: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.now('YYYY/MM/DD')
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.now('YYYY/MM/DD')
            }
        }, {
            tableName: "dimension_results"
        }
    )
    return DimensionResult
}