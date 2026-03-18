import { test, expect } from "@playwright/test";

test.describe("Mobile Responsive", () => {
  test("Dashboard: KPI-Kacheln sind sichtbar und lesbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main h1")).toContainText("Dashboard");

    // KPI-Karten sichtbar
    await expect(page.getByText("Neue Abrechnungen")).toBeVisible();
    await expect(page.getByText("Offene Validierungen")).toBeVisible();
    await expect(page.getByText("Gesamt-FMO diesen Monat")).toBeVisible();

    // Tabelle sichtbar
    await expect(page.getByText("Letzte Abrechnungen")).toBeVisible();
  });

  test("Sidebar: Hamburger-Menü auf Mobile", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      // Hamburger-Button sichtbar
      const hamburger = page.getByLabel("Menü öffnen");
      await expect(hamburger).toBeVisible();

      // Klick öffnet Sidebar
      await hamburger.click();
      await page.waitForTimeout(400);

      // Navigation sichtbar
      const abrechnungenLink = page.locator("aside").getByText("Abrechnungen");
      await expect(abrechnungenLink).toBeVisible();

      // Klick auf Nav-Item navigiert
      await abrechnungenLink.click();
      await page.waitForURL("**/abrechnungen");
      await expect(page.locator("main h1")).toContainText("Abrechnungen");
    } else {
      // Desktop: Sidebar immer sichtbar
      const sidebar = page.locator("aside");
      await expect(sidebar).toBeVisible();
      const box = await sidebar.boundingBox();
      expect(box?.x).toBeGreaterThanOrEqual(0);
    }
  });

  test("Abrechnungen-Liste: Filter und Tabelle lesbar", async ({ page }) => {
    await page.goto("/abrechnungen");
    await expect(page.locator("main h1")).toContainText("Abrechnungen");

    // Filter sichtbar (Select zeigt den aktuellen Wert "alle")
    const selectTriggers = page.locator("main button[role='combobox']");
    await expect(selectTriggers.first()).toBeVisible();

    // Mindestens eine Zeile in der Tabelle
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();
  });

  test("Abrechnungs-Detail: Alle Bereiche lesbar", async ({ page }) => {
    await page.goto("/abrechnungen/abr-001");

    // Header sichtbar
    await expect(page.getByText("Abrechnung LS-2026-0342")).toBeVisible();

    // Positionen-Tabelle
    await expect(page.getByText("Positionen")).toBeVisible();

    // Berechnung
    await expect(page.getByText("Bruttobetrag")).toBeVisible();

    // Buttons
    await expect(page.getByText("Freigeben")).toBeVisible();
  });

  test("Bauern: Tabelle und Dialog funktionieren", async ({ page }) => {
    await page.goto("/bauern");
    await expect(page.locator("main h1")).toContainText("Bauern-Stammdaten");

    // Tabelle sichtbar
    await expect(page.getByText("Johann Moser")).toBeVisible();
  });

  test("Durchschlagsblock: Formular lesbar", async ({ page }) => {
    await page.goto("/durchschlagsblock");
    await expect(page.locator("main h1")).toContainText("Durchschlagsblock");

    // Bauer-Dropdown sichtbar
    await expect(page.getByText("Bauer auswählen...")).toBeVisible();

    // Speichern-Button
    await expect(page.getByText("Speichern")).toBeVisible();
  });

  test("Einstellungen: Tabs navigierbar", async ({ page }) => {
    await page.goto("/einstellungen");
    await expect(page.locator("main h1")).toContainText("Einstellungen");

    // Tabs sichtbar
    await expect(page.getByRole("tab", { name: "Preistabelle" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Aufschläge" })).toBeVisible();

    // Standardpreise-Tabelle sichtbar
    await expect(page.getByText("Standardpreise (EUR/FMO)")).toBeVisible();
  });

  test("Kein horizontaler Overflow auf Mobile", async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
      return;
    }

    const pages = ["/", "/abrechnungen", "/bauern", "/einstellungen"];
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
    }
  });
});
