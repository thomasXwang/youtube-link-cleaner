// ==UserScript==
// @name         YouTube Link Cleaner
// @namespace    local.youtube-link-cleaner
// @version      1.0.2
// @description  Removes tracking parameters from YouTube URLs copied to the clipboard.
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://youtu.be/*
// @updateURL    https://raw.githubusercontent.com/thomasXwang/youtube-link-cleaner/main/youtube-link-cleaner.user.js
// @downloadURL  https://raw.githubusercontent.com/thomasXwang/youtube-link-cleaner/main/youtube-link-cleaner.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const TRACKING_PARAMS = new Set([
    'si',
    'feature',
    'pp',
    'ab_channel',
    'embeds_referring_euri',
    'embeds_referring_origin',
    'source_ve_path',
    'gclid',
    'fbclid'
  ]);

  function cleanYouTubeUrl(value) {
    if (typeof value !== 'string') return value;

    let url;
    try {
      url = new URL(value);
    } catch {
      return value;
    }

    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host !== 'youtube.com' && host !== 'm.youtube.com' &&
        host !== 'music.youtube.com' && host !== 'youtu.be') {
      return value;
    }

    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
        url.searchParams.delete(key);
      }
    }

    return url.toString();
  }

  function cleanText(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/https?:\/\/(?:www\.|m\.|music\.)?(?:youtube\.com|youtu\.be)\/[^\s<>"']+/gi,
      match => cleanYouTubeUrl(match));
  }

  const clipboardPrototype = globalThis.Clipboard?.prototype;
  if (clipboardPrototype?.writeText) {
    const originalWriteText = clipboardPrototype.writeText;
    clipboardPrototype.writeText = function (text) {
      return originalWriteText.call(this, cleanText(text));
    };
  }

  function cleanContextMenuLink(event) {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor) return;

    const cleaned = cleanYouTubeUrl(anchor.href);
    if (cleaned !== anchor.href) anchor.href = cleaned;
  }

  document.addEventListener('pointerdown', event => {
    if (event.button === 2) cleanContextMenuLink(event);
  }, true);
  document.addEventListener('contextmenu', cleanContextMenuLink, true);

  document.addEventListener('copy', event => {
    const selection = globalThis.getSelection()?.toString();
    if (!selection || !event.clipboardData) return;

    const cleaned = cleanText(selection);
    if (cleaned !== selection) {
      event.preventDefault();
      event.clipboardData.setData('text/plain', cleaned);
    }
  }, true);
})();
