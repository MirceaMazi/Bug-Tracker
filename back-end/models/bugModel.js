import { Database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const BugDb = Database.define("bug", {
  commit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resolveCommit:{
    type: DataTypes.STRING,
    allowNull: true,
  }
});
