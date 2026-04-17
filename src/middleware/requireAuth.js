function requireAuth(req, res, next) {
  if (!req.session || !req.session.username) {
    const accept = req.get("accept") || "";
    const wantsJson = accept.includes("application/json") || req.is("application/json");

    if (wantsJson) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    return res.redirect("/login?error=auth-required&toast=auth-required");
  }

  return next();
}

module.exports = requireAuth;
