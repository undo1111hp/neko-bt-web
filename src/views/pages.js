function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getToastMessage(toastKey) {
  const toastMap = {
    "login-success": "Welcome back, master. Session is now active.",
    "logout-success": "You logged out safely. See you again.",
    "theme-light": "Theme switched to Vanilla Day.",
    "theme-dark": "Theme switched to Midnight Cat.",
    "theme-invalid": "Only light or dark theme is allowed.",
    "auth-required": "Please login first to enter your profile.",
    "visit-count": "Profile counter increased in this session.",
    "logout-failed": "Logout failed. Please try again.",
  };

  return toastMap[toastKey] || "";
}

function layout({ title, theme, content, statusText = "", toastMessage = "" }) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  const safeToast = escapeHtml(toastMessage);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Baloo+2:wght@500;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/assets/app.css" />
  </head>
  <body data-theme="${safeTheme}">
    <div class="bg-pattern" aria-hidden="true"></div>
    <div class="float-paw paw-one" aria-hidden="true">^._.^</div>
    <div class="float-paw paw-two" aria-hidden="true">=^_^=</div>
    <div class="float-paw paw-three" aria-hidden="true">(=^x^=)</div>

    <div class="toast" role="status" aria-live="polite" data-toast-message="${safeToast}"></div>

    <header class="shell-header">
      <a class="brand" href="/">Nekopara Session House</a>
      <nav class="shell-nav">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/profile">Profile</a>
        <a href="/logout">Logout</a>
      </nav>
    </header>

    <main class="shell-main">
      <section class="panel reveal">
        ${content}
      </section>
      <aside class="panel reveal delay-1">
        <h3 class="panel-title">Neko Theme Switch</h3>
        <p class="panel-note">Theme is saved by cookie and reused on next visit.</p>
        <div class="theme-row">
          <a class="btn btn-light" href="/set-theme/light" data-theme-target="light">Vanilla Day</a>
          <a class="btn btn-dark" href="/set-theme/dark" data-theme-target="dark">Midnight Cat</a>
        </div>
        <p class="status" data-theme-status>${escapeHtml(statusText)}</p>

        <section class="character-stage reveal delay-2">
          <h4 class="character-title">Cafe Mascots</h4>
          <div class="character-grid">
            <figure class="character-card">
              <img src="/assets/characters/choco-mascot.png" alt="Choco mascot" loading="lazy" onerror="this.onerror=null;this.src='/assets/characters/choco-mascot.svg';" />
              <figcaption>Choco Mascot</figcaption>
            </figure>
            <figure class="character-card">
              <img src="/assets/characters/vanilla-mascot.png" alt="Vanilla mascot" loading="lazy" onerror="this.onerror=null;this.src='/assets/characters/vanilla-mascot.svg';" />
              <figcaption>Vanilla Mascot</figcaption>
            </figure>
          </div>
          <p class="panel-note small-note">You can replace these files with your attached characters later.</p>
        </section>
      </aside>
    </main>

    <script src="/assets/app.js" defer></script>
  </body>
</html>`;
}

function renderHomePage({ theme, isLoggedIn, username, toastKey = "" }) {
  const loginBlock = isLoggedIn
    ? `<p class="ok">Online as <strong>${escapeHtml(username)}</strong></p>
       <div class="action-row">
         <a class="btn btn-cta" href="/profile">Enter Cat Lounge</a>
         <a class="btn" href="/logout">Logout</a>
       </div>`
    : `<p class="warn">You are currently a guest.</p>
       <div class="action-row">
         <a class="btn btn-cta" href="/login">Go to Login</a>
       </div>`;

  return layout({
    title: "Nekopara Session House - Home",
    theme,
    toastMessage: getToastMessage(toastKey),
    statusText: `Current theme: ${theme === "dark" ? "Midnight Cat" : "Vanilla Day"}`,
    content: `
      <h1 class="hero-title">Nekopara Training Hub</h1>
      <p class="hero-subtitle">Practice routing, cookie, session and access control in a cute anime-style flow.</p>
      ${loginBlock}
    `,
  });
}

function renderLoginPage({ theme, errorMessage = "", username = "", toastKey = "" }) {
  const errorMap = {
    "missing-credentials": "Please provide both username and password.",
    "invalid-credentials": "Username or password is not correct.",
    "auth-required": "Please login to continue.",
  };

  const resolvedError = errorMap[errorMessage] || errorMessage;

  const error = errorMessage
    ? `<p class="error">${escapeHtml(resolvedError)}</p>`
    : "<p class=\"panel-note\">Use demo account: demo / demo123</p>";

  return layout({
    title: "Nekopara Session House - Login",
    theme,
    toastMessage: getToastMessage(toastKey),
    statusText: `Current theme: ${theme === "dark" ? "Midnight Cat" : "Vanilla Day"}`,
    content: `
      <h1 class="hero-title">Cafe Login Gate</h1>
      <p class="hero-subtitle">Successful login stores username, login time and profile counter in session.</p>
      ${error}
      <form class="auth-form" method="post" action="/login">
        <label>
          Username
          <input type="text" name="username" value="${escapeHtml(username)}" placeholder="demo" required />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="demo123" required />
        </label>
        <button class="btn btn-cta" type="submit">Login</button>
      </form>
      <div class="panel-note small-list">
        <div><strong>Demo accounts</strong></div>
        <div>alice / alice123</div>
        <div>bob / bob123</div>
        <div>demo / demo123</div>
      </div>
    `,
  });
}

function renderProfilePage({ theme, username, loginTime, profileViewCount, toastKey = "" }) {
  return layout({
    title: "Nekopara Session House - Profile",
    theme,
    toastMessage: getToastMessage(toastKey),
    statusText: `Current theme: ${theme === "dark" ? "Midnight Cat" : "Vanilla Day"}`,
    content: `
      <h1 class="hero-title">Owner Profile Board</h1>
      <p class="hero-subtitle">Every refresh in this session increases your profile visit count.</p>
      <dl class="profile-grid">
        <div>
          <dt>Username</dt>
          <dd>${escapeHtml(username)}</dd>
        </div>
        <div>
          <dt>Login Time</dt>
          <dd>${escapeHtml(loginTime)}</dd>
        </div>
        <div>
          <dt>Profile Visits</dt>
          <dd>${escapeHtml(profileViewCount)}</dd>
        </div>
      </dl>
      <div class="action-row">
        <a class="btn" href="/profile?toast=visit-count">Refresh Counter</a>
        <a class="btn" href="/">Home</a>
        <a class="btn btn-danger" href="/logout">Logout</a>
      </div>
    `,
  });
}

function renderSystemPage({ title, theme, heading, description, ctaHref, ctaText, toastKey = "" }) {
  return layout({
    title,
    theme,
    toastMessage: getToastMessage(toastKey),
    statusText: "System status page",
    content: `
      <h1 class="hero-title">${escapeHtml(heading)}</h1>
      <p class="hero-subtitle">${escapeHtml(description)}</p>
      <div class="action-row">
        <a class="btn btn-cta" href="${escapeHtml(ctaHref)}">${escapeHtml(ctaText)}</a>
        <a class="btn" href="/">Back Home</a>
      </div>
    `,
  });
}

module.exports = {
  renderHomePage,
  renderLoginPage,
  renderProfilePage,
  renderSystemPage,
};
