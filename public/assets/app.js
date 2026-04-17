(function () {
  const title = document.title;
  if (title.includes("Profile")) {
    document.title = "Profile - Nekopara Session House";
  }

  const toast = document.querySelector(".toast");
  if (!toast) {
    return;
  }

  const message = toast.dataset.toastMessage;
  const showToast = (text) => {
    if (!text) {
      return;
    }

    toast.textContent = text;
    toast.classList.add("show");

    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  };

  if (message) {
    showToast(message);
  }

  const url = new URL(window.location.href);
  const hasEphemeralParams = ["toast", "error"].some((key) => url.searchParams.has(key));
  if (hasEphemeralParams) {
    url.searchParams.delete("toast");
    url.searchParams.delete("error");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const statusNode = document.querySelector("[data-theme-status]");
  const themeButtons = document.querySelectorAll("[data-theme-target]");
  const themeLabel = {
    light: "Vanilla Day",
    dark: "Midnight Cat",
  };

  const updateThemeDom = (targetTheme) => {
    document.body.dataset.theme = targetTheme;
    if (statusNode) {
      statusNode.textContent = `Current theme: ${themeLabel[targetTheme] || targetTheme}`;
    }
  };

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();

      const targetTheme = btn.dataset.themeTarget;
      const endpoint = btn.getAttribute("href");
      const currentTheme = document.body.dataset.theme;

      if (!endpoint || !targetTheme) {
        return;
      }

      if (targetTheme === currentTheme) {
        showToast("Already using this theme.");
        return;
      }

      document.body.classList.add("theme-switching");

      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: "application/json",
          },
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error("Theme update failed");
        }

        if (document.startViewTransition) {
          document.startViewTransition(() => {
            updateThemeDom(targetTheme);
          });
        } else {
          updateThemeDom(targetTheme);
        }

        showToast(`Theme switched to ${themeLabel[targetTheme] || targetTheme}.`);
      } catch (error) {
        window.location.href = endpoint;
      } finally {
        window.setTimeout(() => {
          document.body.classList.remove("theme-switching");
        }, 420);
      }
    });
  });
})();
