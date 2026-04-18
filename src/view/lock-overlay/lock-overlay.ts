import { Store } from "../store/store";
import { getUiLayerElement } from "../utils/document";

export type LockOverlay = ReturnType<typeof create>;

export const LockOverlay = {
  create,
};

function create() {
  const hint = document.createElement("div");
  hint.innerText = "Please complete your action in the popup window...";
  hint.classList.add("lock-overlay-hint");

  const self = document.createElement("div");
  self.classList.add("lock-overlay", "hidden");
  self.appendChild(hint);

  self.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });

  const show = async () => {
    self.classList.remove("hidden");
  };

  const hide = () => {
    self.classList.add("hidden");
  };

  getUiLayerElement().appendChild(self);

  return {
    show,
    hide,
  };
}
