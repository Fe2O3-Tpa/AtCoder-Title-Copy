import { createCopyButton } from './button';
import { copyToClipboard } from './clipboard';
import { formatTitle, getContestId, getTaskInfo } from './extractor';

export function initialize(root: ParentNode = document): void {
  const target = root.querySelector('.h2');
  if (!(target instanceof Element)) {
    return;
  }

  if (target.querySelector('[data-actc-copy-button="true"]') !== null) {
    return;
  }

  const button = mountCopyButton(target);
  button.dataset.actcCopyButton = 'true';
  button.addEventListener('click', async (): Promise<void> => {
    const text = buildCopyText(window.location.pathname, root);
    if (text === null) {
      return;
    }
    await copyToClipboard(text, button);
  });
}

export function mountCopyButton(target: Element): HTMLButtonElement {
  const button = createCopyButton();
  target.appendChild(button);
  return button;
}

export function buildCopyText(pathname: string = window.location.pathname, root: ParentNode = document): string | null {
  const task = getTaskInfo(root);
  if (task === null) {
    return null;
  }

  const contestId = getContestId(pathname);
  return formatTitle(contestId, task);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', (): void => {
    initialize();
  });
} else {
  initialize();
}
