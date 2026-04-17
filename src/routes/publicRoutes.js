const express = require("express");
const { renderHomePage, renderLoginPage } = require("../views/pages");

const router = express.Router();
const allowedThemes = new Set(["light", "dark"]);

function getThemeFromCookie(req) {
  return allowedThemes.has(req.cookies.theme) ? req.cookies.theme : "light";
}

function wantsJson(req) {
  const accept = req.get("accept") || "";
  return accept.includes("application/json") || req.is("application/json");
}

function appendQuery(path, key, value) {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set(key, value);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

router.get("/", (req, res) => {
  const theme = getThemeFromCookie(req);

  if (!wantsJson(req)) {
    return res.send(
      renderHomePage({
        theme,
        isLoggedIn: Boolean(req.session && req.session.username),
        username: req.session && req.session.username,
        toastKey: req.query.toast || req.query.error || "",
      }),
    );
  }

  return res.json({
    message: "Home route",
    theme,
    themeSource: allowedThemes.has(req.cookies.theme) ? "cookie" : "default",
    routes: {
      loginGuide: "GET /login",
      login: "POST /login",
      profile: "GET /profile",
      setTheme: "GET /set-theme/:theme",
      logout: "GET /logout",
    },
  });
});

router.get("/login", (req, res) => {
  if (req.session && req.session.username) {
    return res.redirect("/profile");
  }

  if (!wantsJson(req)) {
    return res.send(
      renderLoginPage({
        theme: getThemeFromCookie(req),
        errorMessage: req.query.error || "",
        username: req.query.username || "",
        toastKey: req.query.toast || "",
      }),
    );
  }

  return res.json({
    message: "Send username and password to POST /login",
    acceptedPayload: {
      username: "demo",
      password: "demo123",
    },
    note: "This app uses session-based login with mock users.",
  });
});

router.get("/set-theme/:theme", (req, res) => {
  const { theme } = req.params;
  const shouldReturnJson = wantsJson(req);

  if (!allowedThemes.has(theme)) {
    if (shouldReturnJson) {
      return res.status(400).json({
        message: "Invalid theme",
        allowedThemes: ["light", "dark"],
      });
    }

    return res.redirect("/?toast=theme-invalid");
  }

  const maxAge = Number(process.env.THEME_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000);

  res.cookie("theme", theme, {
    maxAge,
    httpOnly: false,
    sameSite: "lax",
  });

  if (!shouldReturnJson) {
    const referer = req.get("referer");
    const target = referer || "/";
    return res.redirect(appendQuery(target, "toast", `theme-${theme}`));
  }

  return res.json({
    message: "Theme saved to cookie",
    theme,
    maxAgeMs: maxAge,
  });
});

module.exports = router;
