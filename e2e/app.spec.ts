import { test, expect } from "@playwright/test";

test("home shows the dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /California Class C knowledge test/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/practice questions across every topic/i),
  ).toBeVisible();
});

test("exam mode loads a full 46-question test", async ({ page }) => {
  await page.goto("/test?profile=original&mode=exam");
  await expect(page.getByText("Question 1 of 46")).toBeVisible();
  await expect(page.getByText(/pass 38\/46/)).toBeVisible();
});

test("complete a quick practice test, see results and progress", async ({
  page,
}) => {
  await page.goto("/test?profile=original&mode=practice");

  for (let i = 1; i <= 10; i++) {
    await expect(page.getByText(`Question ${i} of 10`)).toBeVisible();
    // Choose the first answer option.
    await page.getByTestId("option").first().click();
    if (i < 10) {
      await page.getByTestId("nav-next").click();
    } else {
      await page.getByTestId("submit-test").click();
    }
  }

  // Results screen.
  await expect(page.getByTestId("results")).toBeVisible();
  await expect(page.getByTestId("pass-banner")).toHaveText(
    /You passed|Not passed/,
  );
  await expect(page.getByTestId("score")).toContainText("/10");

  // Review list shows every question.
  await expect(page.getByRole("listitem").filter({ hasText: /Why:/ })).toHaveCount(
    10,
  );

  // Progress is recorded on the home dashboard.
  await page.getByRole("link", { name: "Home" }).click();
  await expect(page.getByText("Tests", { exact: true })).toBeVisible();
});
