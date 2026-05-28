import {
  PannellumHotSpot,
  PannellumHotSpotType,
} from "../../core/pannellum/pannellum";
import { CanBeNull, CanBeUndefined } from "../../core/types";
import { isOrientationMessage } from "../orientation-messager/orientation-messager";
import { Store } from "../store/store";
import { getElementById } from "../utils/document";
import { SimpleUrl } from "../url/url";
import { generateId } from "../utils/utils";
import { type ViewerAdapter } from "../viewer/viewer-adapter";
import { svgCopyOrientation } from "../svg/svg";
import { Modal } from "../modal/modal";

export type HotspotModal = ReturnType<typeof create>;

export const HotspotModal = {
  create,
};

function create(store: Store, uiLayer: HTMLDivElement, viewer: ViewerAdapter) {
  let type: CanBeUndefined<PannellumHotSpotType>;
  let hotspot: CanBeUndefined<PannellumHotSpot>;
  let popupWindow: CanBeNull<Window> = null;

  const modal = Modal.create({
    id: "hotspot-modal",
    header: `
      <div id="hotspot-header">
        Points of Interest
      </div>
    `,
    content: `
      <div class="field-box">
        <label for="hotspot-text" class="label">Text</label>
        <input id="hotspot-text" type="text" class="input" placeholder="Enter name...">
      </div>            
      <div class="field-box">
        <label class="label" for="hotspot-url">URL</label>
        <div class="hotspot-url">
          <input 
            type="text" 
            class="input" 
            id="hotspot-url" 
            list="hotspot-urls" 
            placeholder="Type or select a url..."
            autocomplete="off"
          >
          <datalist id="hotspot-urls"></datalist>
          <button id="hotspot-open-url" class="button hotspot-open-url-btn"></button>
        </div>
        <label class="checkbox">
          <input type="checkbox" id="hotspot-open-new-tab">
          <span class="checkmark"></span>
          Open in new tab
        </label>
      </div>
    `,
    footer: `
      <div class="modal-footer-buttons-space-between">
        <div class="modal-footer-buttons">
          <button id="hotspot-save" class="button">Save</button>
          <button id="hotspot-close" class="button secondary">Close</button>
        </div>
        <button id="hotspot-delete" class="button danger">Delete</button>
      </div>
    `,
    uiLayer,
  });

  const hotspotHeader = getElementById<HTMLDivElement>("hotspot-header");

  const textElm = getElementById<HTMLInputElement>("hotspot-text");
  const urlElm = getElementById<HTMLInputElement>("hotspot-url");
  const urlsElm = getElementById<HTMLDataListElement>("hotspot-urls");
  const openInNewTabElm = getElementById<HTMLInputElement>(
    "hotspot-open-new-tab",
  );
  const openUrlBtn = getElementById("hotspot-open-url");
  const saveBtn = getElementById("hotspot-save");
  const closeBtn = getElementById("hotspot-close");
  const deleteBtn = getElementById("hotspot-delete");

  openUrlBtn.insertAdjacentHTML("beforeend", svgCopyOrientation);

  const onSaveClick = () => {
    if (hotspot?.id) {
      viewer.removeHotspot(hotspot.id);
    }

    const id = hotspot?.id ?? generateId();

    viewer.addHotspot(
      {
        id,
        text: textElm.value.trim(),
        yaw: hotspot?.yaw ?? store.state.yaw,
        pitch: hotspot?.pitch ?? store.state.pitch,
        type: type as PannellumHotSpotType,
        URL: urlElm.value,
      },
      openInNewTabElm.checked,
    );

    hide();
  };

  const onCloseClick = () => {
    hide();
  };

  const onContextMenu = () => {
    hide();
  };

  const onDelete = () => {
    if (hotspot?.id) {
      viewer.removeHotspot(hotspot.id);
    }

    hide();
  };

  const onOpenUrl = () => {
    const url = urlElm.value.trim();

    if (!url) {
      return;
    }

    const width = window.screen.width / 2;
    const height = window.screen.height / 2;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    popupWindow = window.open(
      url,
      "Viewer",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
    );

    if (!popupWindow) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
    }
  };

  const onMessage = (event: MessageEvent) => {
    if (isOrientationMessage(event)) {
      const url = new SimpleUrl(urlElm.value);

      url.query.set("yaw", event.data.yaw.toFixed(2));
      url.query.set("pitch", event.data.pitch.toFixed(2));
      url.query.set("hfov", event.data.hfov.toFixed(2));

      urlElm.value = url.toString();
    }
  };

  const show = async (props: { id?: string; type?: PannellumHotSpotType }) => {
    hotspot = store.state.hotspots.find((x) => x.id === props.id);
    type = hotspot?.type ?? props.type;

    if (!type) {
      throw new Error("Argument 'type' is required.");
    }

    if (modal.isVisible()) {
      modal.hide();
    }

    if (hotspot) {
      await viewer.lookAt(hotspot.pitch, hotspot.yaw, undefined, 300);
      textElm.value = hotspot.text;
      urlElm.value = hotspot.URL ?? "";
      deleteBtn.classList.remove("hidden");
    } else {
      textElm.value = "";
      urlElm.value = "";
      deleteBtn.classList.add("hidden");
    }

    urlsElm.innerHTML =
      type === "scene"
        ? store.state.tourCandidatesUrls
            .map((url) => `<option value="${url}">`)
            .join("")
        : "";

    hotspotHeader.innerHTML = type === "scene" ? "Panorama" : "Information";

    openInNewTabElm.checked = type === "scene" ? false : true;

    openInNewTabElm.classList.toggle("hidden", type === "scene");

    viewer.panoramaElm.addEventListener("contextmenu", onContextMenu);
    openUrlBtn.addEventListener("click", onOpenUrl);
    saveBtn.addEventListener("click", onSaveClick);
    closeBtn.addEventListener("click", onCloseClick);
    deleteBtn.addEventListener("click", onDelete);
    window.addEventListener("message", onMessage);

    modal.show();
  };

  const hide = () => {
    hotspot = undefined;
    popupWindow?.close();

    viewer.panoramaElm.removeEventListener("contextmenu", onContextMenu);
    openUrlBtn.removeEventListener("click", onOpenUrl);
    saveBtn.removeEventListener("click", onSaveClick);
    closeBtn.removeEventListener("click", onCloseClick);
    deleteBtn.removeEventListener("click", onDelete);
    window.removeEventListener("message", onMessage);

    modal.hide();
  };

  viewer.on("hotspotClick", (id) => show({ id }));

  return {
    show,
    hide,
  };
}
