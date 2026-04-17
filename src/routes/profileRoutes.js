const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { renderProfilePage } = require("../views/pages");

const router = express.Router();

function getThemeFromCookie(req) {
  return req.cookies.theme === "dark" ? "dark" : "light";
}

function wantsJson(req) {
  const accept = req.get("accept") || "";
  return accept.includes("application/json") || req.is("application/json");
}

router.get("/profile", requireAuth, (req, res) => {
  req.session.profileViewCount = (req.session.profileViewCount || 0) + 1;

  if (!wantsJson(req)) {
    return res.send(
      renderProfilePage({
        theme: getThemeFromCookie(req),
        username: req.session.username,
        loginTime: req.session.loginTime,
        profileViewCount: req.session.profileViewCount,
        toastKey: req.query.toast || "",
      }),
    );
  }

  return res.json({
    message: "Profile route",
    username: req.session.username,
    loginTime: req.session.loginTime,
    profileViewCount: req.session.profileViewCount,
    note: "Counter resets when session expires or after logout.",
  });
});

module.exports = router;
