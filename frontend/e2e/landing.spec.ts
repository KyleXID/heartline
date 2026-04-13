import { test, expect } from "@playwright/test";

test.describe("랜딩 페이지", () => {
  test("하트라인 제목이 보여야 한다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /하트라인/ })).toBeVisible();
  });

  test("시작하기 버튼이 있어야 한다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /시작하기/ })).toBeVisible();
  });

  test("체험하기 버튼 클릭 시 데모 페이지로 이동", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /체험해보기/ }).click();
    await expect(page).toHaveURL("/demo");
  });
});

test.describe("데모 페이지", () => {
  test("샘플 분석 버튼 클릭 시 결과 표시", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: /샘플 분석하기/ }).click();
    await expect(page.getByText("관심도")).toBeVisible({ timeout: 5000 });
  });
});
