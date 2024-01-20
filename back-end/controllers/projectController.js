import { Op } from "sequelize";
import { BugDb, ProjectDb, UserDb } from "../models/index.js";
import { getCurrentUser } from "../helpers/authHelpers.js";

const controller = {
    getAll: async (req, res) => {
        try {
            const projects = await ProjectDb.findAll({
                include: [UserDb, BugDb],
            });
            res.status(200).send(projects);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getById: async (req, res) => {
        try {
            const { projectId } = req.params;
            const project = await ProjectDb.findByPk(projectId, {
                include: [UserDb, BugDb],
            });
            res.status(200).send(project);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    create: async (req, res) => {
        try {
            const payload = {
                name: req.body.name,
                repository: req.body.repository,
                description: req.body.description,
                members: req.body.members,
            };

            for (const key in payload) {
                if (payload[key] == null) {
                    return res
                        .status(400)
                        .send(
                            "Unul sau mai multe campuri nu au fost completate!"
                        );
                }
            }
            payload.members.push(getCurrentUser(req).id);

            const project = await ProjectDb.create({
                name: payload.name,
                repository: payload.repository,
                description: payload.description,
            });

            const members = await UserDb.findAll({
                where: {
                    id: {
                        [Op.in]: payload.members,
                    },
                },
            });

            await project.addUsers(members, {
                through: {
                    role: "member",
                },
            });

            res.status(201).send(project);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    update: async (req, res) => {
        try {
            const { projectId } = req.params;
            const payload = {
                name: req.body.name,
                repository: req.body.repository,
                description: req.body.description,
                members: req.body.members,
            };

            for (const key in payload) {
                if (payload[key] == null) {
                    return res
                        .status(400)
                        .send(
                            "Unul sau mai multe campuri nu au fost completate!"
                        );
                }
            }

            const project = await ProjectDb.findByPk(projectId, {
                include: [UserDb],
            });

            if (!project) {
                return res
                    .status(400)
                    .send(`Proiectul cu id ${projectId} nu exista!`);
            }

            const currentUserId = getCurrentUser(req).id;
            if (!payload.members.includes(currentUserId)) {
                payload.members.push(currentUserId);
            }

            const members = await UserDb.findAll({
                where: {
                    id: {
                        [Op.in]: payload.members,
                    },
                },
            });

            await project.setUsers(members, {
                through: {
                    role: "member",
                },
            });

            await project.update({
                name: payload.name,
                repository: payload.repository,
                description: payload.description,
            });

            const updatedProject = await ProjectDb.findByPk(projectId, {
                include: [UserDb],
            });

            res.status(201).send(updatedProject);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    adhereTester: async (req, res) => {
        try {
            const { projectId } = req.params;

            const project = await ProjectDb.findByPk(projectId, {
                include: [UserDb],
            });
            if (!project) {
                return res
                    .status(400)
                    .send(`Proiectul cu id ${projectId} nu exista!`);
            }

            const currentUserId = getCurrentUser(req).id;
            const projectMemberIds = project.users.map((member) => member.id);

            if (projectMemberIds.includes(currentUserId)) {
                return res
                    .status(400)
                    .send(
                        `Membrul cu id-ul ${currentUserId} face parte din proiect deja!`
                    );
            }

            const user = await UserDb.findByPk(currentUserId);

            await project.addUser(user, {
                through: {
                    role: "tester",
                },
            });

            const updatedProject = await ProjectDb.findByPk(projectId, {
                include: [UserDb],
            });

            res.status(201).send(updatedProject);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    delete: async (req, res) => {
        try {
            const { projectId } = req.params;

            const project = await ProjectDb.findByPk(projectId);
            if (!project) {
                return res
                    .status(400)
                    .send(`Proiectul cu id ${projectId} nu exista!`);
            }

            await project.destroy();

            res.status(201).send(
                `Proiectul cu id ${id} a fost sters cu succes!`
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

export default controller;
