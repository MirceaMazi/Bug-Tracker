import { Database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const AttendanceDb = Database.define("attendance", {
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
