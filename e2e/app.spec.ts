import { test, expect } from "@playwright/test";

test("home shows the dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /The Ultimate Driving Knowledge Test/i }),
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

test("reopening a saved test from history shows the same verdicts it was scored with", async ({
  page,
}) => {
  // Regression: options are shuffled per attempt, so the recorded answer index
  // is meaningless against the bank question. Re-resolving it without replaying
  // the shuffle reported correct answers as wrong on the review screen.
  await page.goto("/test?profile=original&mode=practice");

  for (let i = 1; i <= 10; i++) {
    await expect(page.getByText(`Question ${i} of 10`)).toBeVisible();
    const options = page.getByTestId("option");
    // Rotate the pick so the attempt has a mix of right and wrong answers.
    await options.nth((i - 1) % (await options.count())).click();
    if (i < 10) {
      await page.getByTestId("nav-next").click();
    } else {
      await page.getByTestId("submit-test").click();
    }
  }

  await expect(page.getByTestId("results")).toBeVisible();
  const scored = Number((await page.getByTestId("score").textContent())?.match(/\d+/)?.[0]);
  const liveVerdicts = await page.getByTestId("review-status").allTextContents();
  expect(liveVerdicts).toHaveLength(10);
  expect(liveVerdicts.filter((v) => v === "Correct")).toHaveLength(scored);

  // Same attempt, reopened from history — the saved review must agree exactly.
  await page.getByRole("link", { name: "Home" }).click();
  await page.getByRole("link", { name: "Review" }).first().click();

  await expect(page.getByRole("heading", { name: "Test Review" })).toBeVisible();
  await expect(page.getByTestId("review-status")).toHaveCount(10);
  expect(await page.getByTestId("review-status").allTextContents()).toEqual(liveVerdicts);
});

test("road-test guide: rating a maneuver updates readiness", async ({ page }) => {
  await page.goto("/road-test");
  await expect(
    page.getByRole("heading", { name: "Road test (DL-80) guide" }),
  ).toBeVisible();
  await expect(page.getByText(/0\/\d+ confident/)).toBeVisible();

  await page.getByRole("button", { name: "Confident" }).first().click();
  await expect(page.getByText(/1\/\d+ confident/)).toBeVisible();
});

test("footer feedback modal opens and submits (mailto fallback)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Built with curiosity and care")).toBeVisible();

  await page.getByRole("button", { name: "Ozlorien Labs" }).click();
  const dialog = page.getByRole("dialog", { name: /Ozlorien Labs/i });
  await expect(dialog.getByText("Get in touch")).toBeVisible();

  await dialog.getByLabel("Your message").fill("Great app, thanks!");
  await dialog.getByRole("button", { name: "Send" }).click();

  // With no email backend configured in the test build, it offers the mailto
  // fallback (a true send + thank-you happens once RESEND_API_KEY is set).
  await expect(
    dialog.getByText(/Open email to ozlorienlabs@gmail.com/i),
  ).toBeVisible();
});
