module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'categories',
      timestamps: true,
      paranoid: false,
      underscored: true,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Task, {
      foreignKey: 'categoryId',
      as: 'tasks',
      onDelete: 'SET NULL',
    });
  };

  return Category;
};