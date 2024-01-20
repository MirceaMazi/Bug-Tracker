import { UserDb } from "./userModel.js";
import { ProjectDb } from "./projectModel.js";
import { AttendanceDb } from "./attendanceModel.js";
import { BugDb } from "./bugModel.js";

UserDb.belongsToMany(ProjectDb, { through: AttendanceDb });
ProjectDb.belongsToMany(UserDb, { through: AttendanceDb });

UserDb.hasMany(BugDb);
BugDb.belongsTo(UserDb);

ProjectDb.hasMany(BugDb);
BugDb.belongsTo(ProjectDb);

export { UserDb, ProjectDb, BugDb };
