import { Nullable } from "../../../core/types";

export const navigateTo = (url: Nullable<string>, isInNewTab: boolean = false) => {
  if (!url) return;

  if (isInNewTab) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = url;
  }
};
