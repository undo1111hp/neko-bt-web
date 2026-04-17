const express = require("express");
const { findUser } = require("../data/mockUsers");

const router = express.Router();

function wantsJson(req) {
  const accept = req.get("accept") || "";
  return accept.includes("application/json") || req.is("application/json");
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const shouldReturnJson = wantsJson(req);

  if (!username || !password) {
    if (shouldReturnJson) {
      return res.status(400).json({
        message: "username and password are required",
      });
    }

    return res.redirect("/login?error=missing-credentials");
  }

  const user = findUser(username, password);

  if (!user) {
    if (shouldReturnJson) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.redirect(`/login?error=invalid-credentials&username=${encodeURIComponent(username)}`);
  }

  req.session.username = user.username;
  req.session.loginTime = new Date().toISOString();
  req.session.profileViewCount = 0;

  if (!shouldReturnJson) {
    return res.redirect("/profile?toast=login-success");
  }

  return res.json({
    message: "Login successful",
    username: req.session.username,
    loginTime: req.session.loginTime,
  });
});

router.get("/logout", (req, res) => {
  const shouldReturnJson = wantsJson(req);

  req.session.destroy((err) => {
    if (err) {
      if (shouldReturnJson) {
        return res.status(500).json({
          message: "Could not logout",
        });
      }

      return res.redirect("/profile?toast=logout-failed");
    }

    res.clearCookie("sid");

    if (!shouldReturnJson) {
      return res.redirect("/login?toast=logout-success");
    }

    return res.json({
      message: "Logout successful. Session cleared.",
    });
  });
});

module.exports = router;
