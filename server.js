const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { renderSystemPage } = require("./src/views/pages");

const publicRoutes = require("./src/routes/publicRoutes");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const sessionSecret = process.env.SESSION_SECRET || "dev-session-secret";
const sessionCookieMaxAge = Number(process.env.SESSION_COOKIE_MAX_AGE_MS || 30 * 60 * 1000);

function wantsJson(req) {
  const accept = req.get("accept") || "";
  return accept.includes("application/json") || req.is("application/json");
}

function getThemeFromCookie(req) {
  return req.cookies && req.cookies.theme === "dark" ? "dark" : "light";
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/assets", express.static("public/assets"));

app.use(
  session({
    name: "sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionCookieMaxAge,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  }),
);

app.use(publicRoutes);
app.use(authRoutes);
app.use(profileRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload",
    });
  }

  console.error(err);

  if (!wantsJson(req)) {
    return res.status(500).send(
      renderSystemPage({
        title: "Nekopara Session House - Error",
        theme: getThemeFromCookie(req),
        heading: "Oops, something broke in the cafe.",
        description: "An unexpected error occurred. Please return home and try again.",
        ctaHref: "/",
        ctaText: "Go Home",
      }),
    );
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

app.use((req, res) => {
  if (!wantsJson(req)) {
    return res.status(404).send(
      renderSystemPage({
        title: "Nekopara Session House - 404",
        theme: getThemeFromCookie(req),
        heading: "That room does not exist.",
        description: "The path you entered cannot be found. Let us guide you back.",
        ctaHref: "/",
        ctaText: "Return Home",
      }),
    );
  }

  return res.status(404).json({
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
