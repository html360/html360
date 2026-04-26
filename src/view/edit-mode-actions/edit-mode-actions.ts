import { PannellumHotSpotType } from "../../core/pannellum/pannellum";
import { Hotspot } from "../hotspot/hotspot";
import { Store } from "../store/store";
import { svgAddInfo, svgAddPanorama, svgCopyOrientation } from "../svg/svg";
import { showToast } from "../toast/toast";
import { copyTextToClipboard } from "../utils/document";

export type EditModeActions = ReturnType<typeof create>;

export const EditModeActions = {
  create,
};

function create(store: Store, hotspot: Hotspot, uiLayer: HTMLDivElement) {
  const addPanoramaBtm = createButton("Add Panorama", svgAddPanorama);
  const addInfoBtm = createButton("Add Info", svgAddInfo);
  const copyOrientationBtm = createButton("Copy Orientation URL Params", svgCopyOrientation);

  const menu = document.createElement("div");
  menu.classList.add("edit-mode-actinos", "hidden");
  menu.append(addPanoramaBtm);
  menu.append(addInfoBtm);
  menu.append(copyOrientationBtm);
  uiLayer.append(menu);
  
  const addHotspot = (type: PannellumHotSpotType) => {
    setTimeout(() => {
      hotspot.show({ type });
    }, 0);
  };

  const onAddPanorama = () => addHotspot("scene");

  const onAddInfo = () => addHotspot("info");

  const onCopyOrientation = () => {
    const urlParams = store.getOrientationUrlParams();
    const isCopied = copyTextToClipboard(urlParams);
    const toastText = `${isCopied ? "Copied" : "Failed"} to clipboard`;
    showToast(toastText);
  };

  const show = () => {
    addPanoramaBtm.addEventListener("click", onAddPanorama);
    addInfoBtm.addEventListener("click", onAddInfo);
    copyOrientationBtm.addEventListener("click", onCopyOrientation);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    addPanoramaBtm.removeEventListener("click", onAddPanorama);
    addInfoBtm.removeEventListener("click", onAddInfo);
    copyOrientationBtm.removeEventListener("click", onCopyOrientation);
    menu.classList.add("hidden");
  };

  const toggle = (isVisible: boolean) => (isVisible ? show() : hide());

  store.on("setIsEditMode", toggle);

  return { show, hide };
}

function createButton(tooltip: string, svg: string) {
  const button = document.createElement("button");
  button.classList.add("button");
  button.dataset.tooltip = tooltip;
  button.insertAdjacentHTML("beforeend", svg);
  return button;
}