const { test, expect } = require("@playwright/test");

test.describe("Nekopara UX", () => {
  test("home renders Nekopara theme elements", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Nekopara Session House - Home/);
    await expect(page.getByRole("heading", { name: "Nekopara Training Hub" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cafe Mascots" })).toBeVisible();
    await expect(page.getByAltText("Choco mascot")).toBeVisible();
    await expect(page.getByAltText("Vanilla mascot")).toBeVisible();
  });

  test("theme switch updates UI smoothly", async ({ page }) => {
    await page.goto("/");

    const status = page.locator("[data-theme-status]");
    await expect(status).toContainText("Vanilla Day");

    await page.getByRole("link", { name: "Midnight Cat" }).click();

    await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
    await expect(status).toContainText("Midnight Cat");
    await expect(page.locator(".toast")).toContainText("Theme switched to Midnight Cat.");
  });

  test("login, profile counter, logout flow", async ({ page }) => {
    await page.goto("/profile");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Cafe Login Gate" })).toBeVisible();

    await page.getByLabel("Username").fill("demo");
    await page.getByLabel("Password").fill("demo123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/profile/);
    await expect(page.getByRole("heading", { name: "Owner Profile Board" })).toBeVisible();

    const countValue = page.locator(".profile-grid div").nth(2).locator("dd");
    await expect(countValue).toContainText("1");

    await page.reload();
    await expect(countValue).toContainText("2");

    await page.getByRole("link", { name: "Logout" }).first().click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });

  test("browser 404 page is user-friendly", async ({ page }) => {
    await page.goto("/route-not-exist");

    await expect(page).toHaveTitle(/Nekopara Session House - 404/);
    await expect(page.getByRole("heading", { name: "That room does not exist." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Return Home" })).toBeVisible();
  });
});

test.describe("API compatibility", () => {
  test("profile requires auth for JSON clients", async ({ request }) => {
    const res = await request.get("/profile", {
      headers: {
        Accept: "application/json",
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ message: "Authentication required" });
  });

  test("invalid theme still returns JSON error", async ({ request }) => {
    const res = await request.get("/set-theme/invalid", {
      headers: {
        Accept: "application/json",
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toEqual({
      message: "Invalid theme",
      allowedThemes: ["light", "dark"],
    });
  });
});
