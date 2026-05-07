export interface TaskInfo {
  symbol: string;
  title: string;
}

export function getContestId(pathname: string = window.location.pathname): string {
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

export function getTaskInfo(root: ParentNode = document): TaskInfo | null {
  const heading = root.querySelector('.h2');
  if (!(heading instanceof Element)) {
    return null;
  }

  const textParts: string[] = [];
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

export function formatTitle(contestId: string, task: TaskInfo): string {
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
