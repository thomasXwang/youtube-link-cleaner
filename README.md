# YouTube Link Cleaner

Removes known tracking and attribution parameters from YouTube URLs when a
YouTube page writes them to the clipboard.

Tiny, auditable, and private: it requests no extension permissions, makes no
network requests, and stores no data.

For example:

```text
https://youtu.be/dQw4w9WgXcQ?si=abc123&t=42
```

becomes:

```text
https://youtu.be/dQw4w9WgXcQ?t=42
```

Playback parameters such as `t`, `start`, `end`, `list`, and `index` are kept.

## Tampermonkey installation

1. Install Tampermonkey in Chrome.
2. Open the [raw userscript](https://raw.githubusercontent.com/thomasXwang/youtube-link-cleaner/main/youtube-link-cleaner.user.js).
3. Tampermonkey will show an installation screen; choose **Install**.
4. Reload any open YouTube tabs.

If the raw link does not open Tampermonkey, use **Tampermonkey Dashboard →
Utilities → Install from URL** and paste the raw userscript URL above.

If you previously installed a local copy, replace it with the GitHub version
once. The userscript includes `@updateURL` and `@downloadURL`, so Tampermonkey
can then fetch future releases automatically from this repository.

## Chrome extension installation

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `chrome-extension` folder.
5. Reload any open YouTube tabs.

Only enable one version at a time. The extension needs no network access and
stores no data.

## Privacy

All URL cleaning happens locally in the browser. This project contains no
analytics, telemetry, accounts, or remote services.

## License

[MIT](LICENSE)
