import { PannellumHotSpotType } from "../../core/pannellum/pannellum";
import { Hotspot } from "../hotspot/hotspot";
import { Store } from "../store/store";
import { showToast } from "../toast/toast";
import { copyTextToClipboard, getElementById } from "../utils/document";

export type EditModeActions = ReturnType<typeof create>;

export const EditModeActions = {
  create,
};

function create(store: Store, hotspot: Hotspot) {
  const menu = getElementById("edit-mode-actinos");
  const addPanoramaBtm = getElementById("edit-mode-actinos-add-panorama");
  const addInfoBtm = getElementById("edit-mode-actinos-add-info");
  const copyOrientationBtm = getElementById(
    "edit-mode-actinos-copy-orientation",
  );

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
