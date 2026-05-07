// ==UserScript==
// @name         AtCoder Title Copy
// @namespace    https://github.com/Fe2O3-Tpa
// @version      1.0.0
// @description  AtCoderの問題名をAtCoderの問題名を「ABC123A - Five Antennas」のようなフォーマットでコピーします。
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// ==/UserScript==

(function (exports) {
    'use strict';

    function createCopyButton(options = {}) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = options.className ?? 'btn btn-default btn-sm';
        button.style.marginLeft = options.marginLeft ?? '10px';
        button.innerText = options.label ?? 'Copy Title';
        return button;
    }

    async function copyToClipboard(text, button) {
        if (typeof text !== 'string' || text.length === 0) {
            throw new Error('text must be a non-empty string');
        }
        if (!(button instanceof HTMLButtonElement)) {
            throw new Error('button must be an HTMLButtonElement');
        }
        if (!('clipboard' in navigator) || navigator.clipboard === undefined) {
            throw new Error('Clipboard API is not available');
        }
        const originalLabel = button.innerText;
        await navigator.clipboard.writeText(text);
        button.innerText = 'Copied!';
        window.setTimeout(() => {
            button.innerText = originalLabel;
        }, 2000);
    }

    function getContestId(pathname = window.location.pathname) {
        const contestTaskPathPattern = /^\/contests\/([a-z0-9_]+)\/tasks\/([a-z0-9_]+)$/i;
        const match = contestTaskPathPattern.exec(pathname);
        if (match === null) {
            throw new Error(`Failed to parse contest id from pathname: ${pathname}`);
        }
        const contestId = match[1];
        if (typeof contestId !== 'string' || contestId.length === 0) {
            throw new Error(`Contest id is missing in pathname: ${pathname}`);
        }
        return contestId.toUpperCase();
    }
    function getTaskInfo(root = document) {
        const heading = root.querySelector('.h2');
        if (!(heading instanceof Element)) {
            return null;
        }
        const textParts = [];
        for (const node of Array.from(heading.childNodes)) {
            if (node.nodeType !== Node.TEXT_NODE) {
                continue;
            }
            const value = node.nodeValue;
            if (typeof value !== 'string') {
                continue;
            }
            const normalized = value.replace(/\s+/g, ' ').trim();
            if (normalized.length === 0) {
                continue;
            }
            textParts.push(normalized);
        }
        if (textParts.length === 0) {
            return null;
        }
        const headingText = textParts.join(' ');
        const taskTitlePattern = /^([A-Za-z0-9]+)\s*-\s*(.+)$/i;
        const match = taskTitlePattern.exec(headingText);
        if (match === null) {
            return null;
        }
        const symbol = match[1]?.trim();
        const title = match[2]
            ?.replace(/\s+/g, ' ')
            .trim();
        if (!symbol || !title) {
            return null;
        }
        return { symbol, title };
    }
    function formatTitle(contestId, task) {
        const normalizedContestId = contestId.trim();
        const normalizedSymbol = task.symbol.trim();
        const normalizedTitle = task.title.trim();
        if (normalizedContestId.length === 0) {
            throw new Error('contestId must not be empty');
        }
        if (normalizedSymbol.length === 0 || normalizedTitle.length === 0) {
            throw new Error('task info must not be empty');
        }
        return `${normalizedContestId}${normalizedSymbol} - ${normalizedTitle}`;
    }

    function initialize(root = document) {
        const target = root.querySelector('.h2');
        if (!(target instanceof Element)) {
            return;
        }
        if (target.querySelector('[data-actc-copy-button="true"]') !== null) {
            return;
        }
        const button = mountCopyButton(target);
        button.dataset.actcCopyButton = 'true';
        button.addEventListener('click', async () => {
            const text = buildCopyText(window.location.pathname, root);
            if (text === null) {
                return;
            }
            await copyToClipboard(text, button);
        });
    }
    function mountCopyButton(target) {
        const button = createCopyButton();
        target.appendChild(button);
        return button;
    }
    function buildCopyText(pathname = window.location.pathname, root = document) {
        const task = getTaskInfo(root);
        if (task === null) {
            return null;
        }
        const contestId = getContestId(pathname);
        return formatTitle(contestId, task);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initialize();
        });
    }
    else {
        initialize();
    }

    exports.buildCopyText = buildCopyText;
    exports.initialize = initialize;
    exports.mountCopyButton = mountCopyButton;

    return exports;

})({});
