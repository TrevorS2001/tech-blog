const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "post",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: "user"
      },
    },
    comment_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
  },
);

module.exports = Comment;