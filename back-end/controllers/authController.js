import { cookieParams } from "../config/cookieConfig.js";
import { getCurrentUser } from "../helpers/authHelpers.js";
import { UserDb } from "../models/index.js";
import { hash, compare } from "bcrypt";

const HASH_SALT_ROUDNS = 10;

const controller = {
    getCurrentUser: async (req, res) => {
        try {
            res.status(200).send(getCurrentUser(req));
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    register: async (req, res) => {
        try {
            const payload = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
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

            payload.password = await hash(payload.password, HASH_SALT_ROUDNS);

            const user = await UserDb.create(payload);
            res.status(201).send(user);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    login: async (req, res) => {
        try {
            const payload = {
                email: req.body.email,
                password: req.body.password,
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

            const user = await UserDb.findOne({
                where: {
                    email: payload.email,
                },
            });

            let error = false;

            if (!user) {
                error = true;
            } else {
                error = !(await compare(payload.password, user.password));
            }

            if (error) {
                return res.status(400).send("Emailul sau parola sunt gresite!");
            }

            res.cookie("auth", user, cookieParams);
            res.status(200).send(user);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie("auth");
            res.end();
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

export default controller;
