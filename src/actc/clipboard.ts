export async function copyToClipboard(text: string, button: HTMLButtonElement): Promise<void> {
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

  window.setTimeout((): void => {
    button.innerText = originalLabel;
  }, 2000);
}
