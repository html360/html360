import { Store } from "../store/store";
import { ViewerAdapter } from "../viewer/viewer-adapter";

export type MainMenu = ReturnType<typeof create>;

export const MainMenu = {
  create,
};

function create(store: Store, viwer: ViewerAdapter, uiLayer: HTMLDivElement) {
  const saveBtm = createButton("Save View");
  const fullScreenBtn = createButton("Fullscreen");
  const editModeBtn = createButton("Switch to Editor");

  const menu = document.createElement("div");
  menu.classList.add("menu", "hidden");
  menu.append(fullScreenBtn);
  menu.append(saveBtm);
  menu.append(editModeBtn);
  menu.insertAdjacentHTML(
    "beforeend",
    `
      <div class="menu-footer">
        <a href="https://www.npmjs.com/package/html360" target="_blank" class="menu-footer-link">html360</a>
        <a href="https://pannellum.org/" target="_blank" class="menu-footer-link">pannellum</a>
        <a href="https://hugin.sourceforge.io/" target="_blank" class="menu-footer-link">hugin</a>
        <a href="https://sharp.pixelplumbing.com/" target="_blank" class="menu-footer-link">sharp</a>
      </div>
    `,
  );
  uiLayer.append(menu);

  const onSaveClick = () => {
    hide();
    store.save();
  };

  const onFullScreenClick = () => {
    hide();

    if (!document.fullscreenElement) {
      uiLayer.requestFullscreen().catch((err) => {
        console.error(err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const onEditModeClick = () => {
    hide();
    store.setIsEditMode(!store.state.isEditMode);
  };

  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (!menu.classList.contains("hidden") && !menu.contains(target)) {
      hide();
    }
  };

  const show = () => {
    const isEditMode = store.state.isEditMode;
    editModeBtn.textContent = `Switch to ${isEditMode ? "Preview" : "Editor"}`;

    document.addEventListener("click", onClickOutside);
    saveBtm.addEventListener("click", onSaveClick);
    fullScreenBtn.addEventListener("click", onFullScreenClick);
    editModeBtn.addEventListener("click", onEditModeClick);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    document.removeEventListener("click", onClickOutside);
    saveBtm.removeEventListener("click", onSaveClick);
    fullScreenBtn.removeEventListener("click", onFullScreenClick);
    editModeBtn.removeEventListener("click", onEditModeClick);
    menu.classList.add("hidden");
  };

  const toggle = () => {
    if (menu.classList.contains("hidden")) {
      show();
    } else {
      hide();
    }
  };

  viwer.panoramaElm.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggle();
  });

  return { show, hide, toggle };
}

function createButton(text: string) {
  const button = document.createElement("button");
  button.classList.add("button");
  button.append(text);
  return button;
}
