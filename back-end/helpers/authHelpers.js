export const getCurrentUser = (req) => {
    const { auth: authCookie } = req.signedCookies;
    return authCookie;
};

export const assertAccess = (req, res, next) => {
    const { auth: authCookie } = req.signedCookies;
    req.copyParams = req.params;
    if (!authCookie) {
        return res.status(403).send("Not logged in!");
    }

    next();
};
