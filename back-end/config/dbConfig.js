import { Sequelize } from "sequelize";

export const Database = new Sequelize("bug-tracker", "root", "", {
  dialect: "mysql",
  host: "localhost",
  define: {
    freezeTableName: true,
    timestamps: true,
  },
});
