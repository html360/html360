import { PannellumHotSpotType } from "../../core/pannellum";
import { HotspotModal } from "../hotspot-modal/hotspot-modal";
import { MapUrlModal } from "../map-url-modal/map-url-modal";
import { PanoInfoModal } from "../pano-info-modal/pano-info-modal";
import { Store } from "../store/store";
import {
  svgAddInfo,
  svgAddPanorama,
  svgPanoInfo,
  svgMap
} from "../svg/svg";

export type EditModeActions = ReturnType<typeof create>;

export const EditModeActions = {
  create,
};

function create(
  store: Store,
  uiLayer: HTMLDivElement,
  panoInfo: PanoInfoModal,
  hotspot: HotspotModal,
  mapUrlModal: MapUrlModal,
) {
  const editPanoInfoBtm = createButton("Edit Details", svgPanoInfo);
  const addPanoramaBtm = createButton("Add Panorama", svgAddPanorama);
  const addInfoBtm = createButton("Add Info", svgAddInfo);
  const setMapUrlBtm = createButton(
    "Set Map URL",
    svgMap,
  );

  const menu = document.createElement("div");
  menu.classList.add("edit-mode-actinos", "hidden");
  menu.append(editPanoInfoBtm);
  menu.append(addPanoramaBtm);
  menu.append(addInfoBtm);
  menu.append(setMapUrlBtm);
  uiLayer.append(menu);

  const addHotspot = (type: PannellumHotSpotType) => {
    setTimeout(() => {
      hotspot.show({ type });
    }, 0);
  };

  const onAddPanorama = () => addHotspot("scene");

  const onAddInfo = () => addHotspot("info");

  const onEditPanoInfo = () => {
    setTimeout(() => {
      panoInfo.show();
    }, 0);
  };

  const onSetMapUrl = () => {
    setTimeout(() => {
      mapUrlModal.show();
    }, 0);
  };

  const show = () => {
    editPanoInfoBtm.addEventListener("click", onEditPanoInfo);
    addPanoramaBtm.addEventListener("click", onAddPanorama);
    addInfoBtm.addEventListener("click", onAddInfo);
    setMapUrlBtm.addEventListener("click", onSetMapUrl);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    editPanoInfoBtm.removeEventListener("click", onEditPanoInfo);
    addPanoramaBtm.removeEventListener("click", onAddPanorama);
    addInfoBtm.removeEventListener("click", onAddInfo);
    setMapUrlBtm.removeEventListener("click", onSetMapUrl);
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
