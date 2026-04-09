export function getElementById<T = HTMLElement>(id: string): T {
  const result = document.getElementById(id) as T;
  if (!result) {
    throw new Error(`Cann't find element by id: ${id}`);
  }

  return result;
}

export function getPanoramaElement(): HTMLDivElement {
  return getElementById("panorama") as HTMLDivElement;
}

export function copyTextToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    return true;
    alert();
  } catch (err) {
    return false;
    window.alert(`Failed to copy: ${text}`);
  } finally {
    document.body.removeChild(textArea);
  }
}
