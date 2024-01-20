import { getCurrentUser } from "../helpers/authHelpers.js";
import { BugDb, ProjectDb, UserDb } from "../models/index.js";

const controller = {
    getAllOfProject: async (req, res) => {
        try {
            const { projectId } = req.params;

            const project = await ProjectDb.findByPk(projectId, {
                include: [BugDb],
            });

            if (!project) {
                return res
                    .status(400)
                    .send(`Proiectul cu id ${projectId} nu exista!`);
            }

            res.status(200).send(project.bugs);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getById: async (req, res) => {
        try {
            const { bugId } = req.params;
            const bug = await BugDb.findByPk(bugId);
            res.status(200).send(bug);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    create: async (req, res) => {
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

            const memberIds = project.users.map((member) => member.id);

            if (!memberIds.includes(getCurrentUser(req).id)) {
                return res
                    .status(400)
                    .send(
                        "Trebuie sa fii tester pe acest proiect pentru a crea un bug!"
                    );
            }

            const payload = {
                commit: req.body.commit,
                description: req.body.description,
                severity: req.body.severity,
                priority: req.body.priority,
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

            const bug = await BugDb.create(payload);
            await project.addBug(bug);

            const updatedBug = await BugDb.findByPk(bug.id);
            res.status(200).send(updatedBug);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    update: async (req, res) => {
        try {
            const { bugId } = req.params;

            const bug = await BugDb.findByPk(bugId, {
                include: [UserDb, ProjectDb],
            });

            if (!bug) {
                return res.status(400).send(`Bugul cu id ${bugId} nu exista!`);
            }
            const memberIds = bug.project.users.map((member) => member.id);

            if (memberIds.includes(getCurrentUser(req).id)) {
                return res
                    .status(400)
                    .send(
                        "Trebuie sa fii membru pe acest proiect pentru a modifica acest bug!"
                    );
            }

            const payload = {
                commit: req.body.commit,
                description: req.body.description,
                severity: req.body.severity,
                priority: req.body.priority,
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

            await bug.update(payload);
            res.status(200).send(bug);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    assign: async (req, res) => {
        try {
            const { bugId } = req.params;

            const bug = await BugDb.findByPk(bugId, {
                include: [UserDb],
            });

            const project = await bug.getProject();
            const users = await project.getUsers();

            const memberIds = users.map((member) => member.id);

            if (!memberIds.includes(getCurrentUser(req).id)) {
                return res
                    .status(400)
                    .send(
                        "Trebuie sa fii tester pe acest proiect pentru a-ti asigna acest bug!"
                    );
            }

            if (bug.user) {
                return res
                    .status(400)
                    .send(`Bugul cu id ${bugId} este deja asignat!`);
            }

            if (!bug) {
                return res.status(400).send(`Bugul cu id ${bugId} nu exista!`);
            }

            const currentUser = await UserDb.findByPk(getCurrentUser(req).id);

            await bug.setUser(currentUser);

            const updatedBug = await BugDb.findByPk(bugId);
            res.status(200).send(updatedBug);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    resolve: async (req, res) => {
        try {
            const { bugId } = req.params;

            const bug = await BugDb.findByPk(bugId, {
                include: [UserDb],
            });

            const project = await bug.getProject();
            const users = await project.getUsers();

            const memberIds = users.map((member) => member.id);

            if (!memberIds.includes(getCurrentUser(req).id)) {
                return res
                    .status(400)
                    .send(
                        "Trebuie sa fii tester pe acest proiect pentru a-ti asigna acest bug!"
                    );
            }

            if (bug.user && bug.user.id !== getCurrentUser(req).id) {
                return res
                    .status(400)
                    .send(`Bugul cu id ${bugId} nu este asignat tie!`);
            }

            if (!bug) {
                return res.status(400).send(`Bugul cu id ${bugId} nu exista!`);
            }

            const resolveCommit = req.body.resolveCommit;

            if (!resolveCommit) {
                return res
                    .status(400)
                    .send(`Campul commitLink nu a fost completat`);
            }

            await bug.setUser(null);
            await bug.update({
                priority: "resolved",
                resolveCommit: resolveCommit,
            });

            const updatedBug = await BugDb.findByPk(bugId);
            res.status(200).send(updatedBug);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    },

    delete: async (req, res) => {
        try {
            const { bugId } = req.params;

            const bug = await BugDb.findByPk(bugId);

            if (!bug) {
                return res.status(400).send(`Bugul cu id ${bugId} nu exista!`);
            }

            await bug.destroy();

            res.status(200).send(
                `Bugul cu id ${bugId} a fost sters cu succes!`
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

export default controller;
