const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const distributions = [
  'youtube-link-cleaner.user.js',
  'chrome-extension/content.js'
];

function loadDistribution(relativePath) {
  const writes = [];
  const listeners = new Map();

  class Clipboard {
    writeText(text) {
      writes.push(text);
      return Promise.resolve();
    }
  }

  const context = vm.createContext({
    Clipboard,
    URL,
    document: {
      addEventListener(type, listener) {
        listeners.set(type, listener);
      }
    },
    getSelection: () => ({ toString: () => '' })
  });

  const filename = path.join(__dirname, '..', relativePath);
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });

  return {
    async cleanClipboardText(text) {
      await new context.Clipboard().writeText(text);
      return writes.at(-1);
    },
    cleanContextMenuLink(href) {
      const anchor = { href };
      listeners.get('contextmenu')({
        target: { closest: selector => selector === 'a[href]' ? anchor : null }
      });
      return anchor.href;
    }
  };
}

const cases = [
  {
    name: 'removes a share identifier but keeps a timestamp',
    input: 'https://youtu.be/dQw4w9WgXcQ?si=tracker&t=42',
    expected: 'https://youtu.be/dQw4w9WgXcQ?t=42'
  },
  {
    name: 'preserves video and playlist navigation parameters',
    input: 'https://www.youtube.com/watch?v=abc123&list=PL123&index=2&t=1m30s&si=x&feature=share',
    expected: 'https://www.youtube.com/watch?v=abc123&list=PL123&index=2&t=1m30s'
  },
  {
    name: 'preserves Shorts paths and fragments',
    input: 'https://www.youtube.com/shorts/abc123?utm_source=test&start=4&end=9#details',
    expected: 'https://www.youtube.com/shorts/abc123?start=4&end=9#details'
  },
  {
    name: 'removes all supported tracking parameters',
    input: 'https://music.youtube.com/watch?v=abc&pp=x&ab_channel=y&embeds_referring_euri=z&embeds_referring_origin=o&source_ve_path=p&gclid=g&fbclid=f&utm_campaign=c',
    expected: 'https://music.youtube.com/watch?v=abc'
  },
  {
    name: 'cleans multiple YouTube links inside copied text',
    input: 'First https://youtu.be/one?si=x then https://youtube.com/watch?v=two&utm_medium=social&t=7',
    expected: 'First https://youtu.be/one then https://youtube.com/watch?v=two&t=7'
  },
  {
    name: 'does not alter non-YouTube URLs',
    input: 'https://example.com/watch?si=keep&utm_source=keep',
    expected: 'https://example.com/watch?si=keep&utm_source=keep'
  },
  {
    name: 'does not alter plain clipboard text',
    input: 'A video title without a URL',
    expected: 'A video title without a URL'
  }
];

for (const distribution of distributions) {
  for (const testCase of cases) {
    test(`${distribution}: ${testCase.name}`, async () => {
      const cleaner = loadDistribution(distribution);
      assert.equal(await cleaner.cleanClipboardText(testCase.input), testCase.expected);
    });
  }

  test(`${distribution}: cleans a native context-menu link before Chrome copies it`, () => {
    const cleaner = loadDistribution(distribution);
    assert.equal(
      cleaner.cleanContextMenuLink('https://www.youtube.com/watch?v=4pc1owWsG4M&pp=ugUEEgJmcg%3D%3D'),
      'https://www.youtube.com/watch?v=4pc1owWsG4M'
    );
  });
}
