export interface CopyButtonOptions {
  className?: string;
  marginLeft?: string;
  label?: string;
}

export function createCopyButton(options: CopyButtonOptions = {}): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = options.className ?? 'btn btn-default btn-sm';
  button.style.marginLeft = options.marginLeft ?? '10px';
  button.innerText = options.label ?? 'Copy Title';
  return button;
}
