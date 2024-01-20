import { getCurrentUser } from "../helpers/authHelpers.js";
import { UserDb } from "../models/index.js";
import { Op } from "sequelize";
const controller = {
    getAll: async (req, res) => {
        try {
            const users = await UserDb.findAll({
                where: { id: { [Op.ne]: getCurrentUser(req).id } },
            });
            res.status(200).send(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getById: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await UserDb.findByPk(userId);
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

export default controller;
