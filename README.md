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
2. Open the Tampermonkey dashboard and choose **Create a new script**.
3. Replace the template with the contents of `youtube-link-cleaner.user.js`.
4. Save it and reload any open YouTube tabs.

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
