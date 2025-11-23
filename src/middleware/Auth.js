module.exports = {
  private: async (req, res, next) => {
    let token = req.session.user;
    if (!req.session.user) {
      res.redirect("/auth/login");
      return;
    }
    if (token == "") {
      res.redirect("/auth/login");
      return;
    }
    next();
  },
};
