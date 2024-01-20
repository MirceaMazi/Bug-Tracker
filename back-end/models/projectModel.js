import { Database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const ProjectDb = Database.define("project", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repository: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
