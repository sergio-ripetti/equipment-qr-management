const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();

  try {
    // Test 1: Desktop view
    console.log('📱 Testing DESKTOP view (1280x720)...');
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    // Try to login first
    await desktopPage.fill('input[type="email"]', 'admin@example.com');
    await desktopPage.fill('input[type="password"]', 'Admin123!');
    try {
      await desktopPage.click('button:has-text("Login")');
      await desktopPage.waitForNavigation({ timeout: 3000 });
    } catch (e) {
      // Login might fail but that's ok, we just want to see the page
    }

    // Screenshot desktop
    await desktopPage.screenshot({ path: '/tmp/desktop-view.png' });
    console.log('✅ Desktop screenshot saved: /tmp/desktop-view.png');
    await desktopContext.close();

    // Test 2: Mobile view
    console.log('📱 Testing MOBILE view (375x667)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Try to login
    await mobilePage.fill('input[type="email"]', 'admin@example.com');
    await mobilePage.fill('input[type="password"]', 'Admin123!');
    try {
      await mobilePage.click('button:has-text("Login")');
      await mobilePage.waitForNavigation({ timeout: 3000 });
    } catch (e) {
      // Login might fail
    }

    // Screenshot mobile (closed sidebar)
    await mobilePage.screenshot({ path: '/tmp/mobile-closed.png' });
    console.log('✅ Mobile closed screenshot saved: /tmp/mobile-closed.png');

    // Click hamburger to open sidebar
    const hamburger = await mobilePage.$('button[aria-label="Open sidebar menu"]');
    if (hamburger) {
      await hamburger.click();
      await mobilePage.waitForTimeout(500); // Wait for animation
      await mobilePage.screenshot({ path: '/tmp/mobile-open.png' });
      console.log('✅ Mobile open screenshot saved: /tmp/mobile-open.png');
    } else {
      console.log('⚠️ Hamburger button not found (might be on login page)');
    }

    await mobileContext.close();

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
