"use strict";

// This test checks whether applied WebExtension themes are persisted and applied
// on newly opened windows.

add_task(async function test_multiple_windows() {
  let extension = ExtensionTestUtils.loadExtension({
    manifest: {
      "theme": {
        "images": {
          "theme_frame": "image1.png",
        },
        "colors": {
          "frame": ACCENT_COLOR,
          "tab_background_text": TEXT_COLOR,
        },
      },
    },
    files: {
      "image1.png": BACKGROUND,
    },
  });

  await extension.startup();

  let docEl = window.document.documentElement;

  Assert.ok(docEl.hasAttribute("lwtheme"), "LWT attribute should be set");
  Assert.equal(docEl.getAttribute("lwthemetextcolor"), "bright",
               "LWT text color attribute should be set");
  checkThemeHeaderImage(window, `moz-extension://${extension.uuid}/image1.png`);

  // Now we'll open a new window to see if the theme is also applied there.
  let window2 = await BrowserTestUtils.openNewBrowserWindow();
  docEl = window2.document.documentElement;

  Assert.ok(docEl.hasAttribute("lwtheme"), "LWT attribute should be set");
  Assert.equal(docEl.getAttribute("lwthemetextcolor"), "bright",
               "LWT text color attribute should be set");
  checkThemeHeaderImage(window, `moz-extension://${extension.uuid}/image1.png`);

  await BrowserTestUtils.closeWindow(window2);
  await extension.unload();
});
