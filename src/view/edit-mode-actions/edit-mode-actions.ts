import { PannellumHotSpotType } from "../../core/pannellum/pannellum";
import { HotspotModal } from "../hotspot-modal/hotspot-modal";
import { PanoInfoModal } from "../pano-info-modal/pano-info-modal";
import { Store } from "../store/store";
import {
  svgAddInfo,
  svgAddPanorama,
  svgCopyOrientation,
  svgPanoInfo,
} from "../svg/svg";
import { showToast } from "../toast/toast";
import { copyTextToClipboard } from "../utils/document";

export type EditModeActions = ReturnType<typeof create>;

export const EditModeActions = {
  create,
};

function create(
  store: Store,
  uiLayer: HTMLDivElement,
  panoInfo: PanoInfoModal,
  hotspot: HotspotModal,
) {
  const editPanoInfoBtm = createButton("Edit Details", svgPanoInfo);
  const addPanoramaBtm = createButton("Add Panorama", svgAddPanorama);
  const addInfoBtm = createButton("Add Info", svgAddInfo);
  const copyOrientationBtm = createButton(
    "Copy Orientation URL Params",
    svgCopyOrientation,
  );

  const menu = document.createElement("div");
  menu.classList.add("edit-mode-actinos", "hidden");
  menu.append(editPanoInfoBtm);
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

  const onEditPanoInfo = () => {
    setTimeout(() => {
      panoInfo.show();
    }, 0);
  };

  const show = () => {
    editPanoInfoBtm.addEventListener("click", onEditPanoInfo);
    addPanoramaBtm.addEventListener("click", onAddPanorama);
    addInfoBtm.addEventListener("click", onAddInfo);
    copyOrientationBtm.addEventListener("click", onCopyOrientation);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    editPanoInfoBtm.removeEventListener("click", onEditPanoInfo);
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
