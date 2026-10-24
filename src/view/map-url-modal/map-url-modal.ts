import { Store } from "../store/store";
import { getElementById } from "../utils/document";
import { Modal } from "../modal/modal";
import { buildMapUrl, mapUrlTemplate } from "../../core/map-url";

export type MapUrlModal = ReturnType<typeof create>;

export const MapUrlModal = {
  create,
};

function create(store: Store, uiLayer: HTMLDivElement) {
  const modal = Modal.create({
    id: "map-url-modal",
    header: "Map URL",
    content: `
      <div class="field-box">
        <label for="map-url-modal-lat" class="label">Lat</label>
        <input id="map-url-modal-lat"  class="input" type="number" placeholder="0.00">
      </div>
      <div class="field-box">
        <label for="map-url-modal-lng" class="label">Lng</label>
        <input id="map-url-modal-lng"  class="input" type="number" placeholder="0.00">
      </div>
      <div class="field-box">
        <label for="map-url-modal-template" class="label">Template</label>
          <input 
            type="text" 
            class="input" 
            id="map-url-modal-template" 
            list="map-url-modal-template-list" 
            placeholder="Type or select a template"
            autocomplete="off"
          >
          <datalist id="map-url-modal-template-list">
            <option value="${mapUrlTemplate.nakarte}">Nakarte</option>
            <option value="${mapUrlTemplate.yandex}">Yandex</option>
            <option value="${mapUrlTemplate.google}">Google</option>
          </datalist>
      </div>
      <div class="field-box">
        <label for="map-url-modal-url" class="label">URL</label>
        <input id="map-url-modal-url"  class="input" type="text" placeholder="Enter URL">
      </div>
    `,
    footer: `
      <button id="map-url-modal-save" class="button">Save</button>
      <button id="map-url-modal-close" class="button secondary">Close</button>
    `,
    uiLayer,
  });

  const latElm = getElementById<HTMLInputElement>("map-url-modal-lat");
  const lngElm = getElementById<HTMLInputElement>("map-url-modal-lng");
  const templateElm = getElementById<HTMLInputElement>("map-url-modal-template");
  const urlElm = getElementById<HTMLInputElement>("map-url-modal-url");
  const saveBtn = getElementById("map-url-modal-save");
  const closeBtn = getElementById("map-url-modal-close");

  const updateUrl = () => {
    const lat = latElm.value.trim() ? Number(latElm.value) : null;
    const lng = lngElm.value.trim() ? Number(lngElm.value) : null;
    const template = templateElm.value.trim();

    if (!lat || !lng || !template) {
      return;
    }

    const url = buildMapUrl(template, lat, lng)
    urlElm.value = url;
  }

  const onSaveClick = () => {
    const lat = latElm.value.trim() ? Number(latElm.value) : null;
    const lng = lngElm.value.trim() ? Number(lngElm.value) : null;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return;
    }

    store.setMapLat(lat);
    store.setMapLng(lng);
    store.setMapTemplate(templateElm.value)
    store.setMapUrl(urlElm.value);
    hide();
  };

  const onCloseClick = () => {
    hide();
  };

  const show = async () => {
    latElm.value = store.state.map.lat?.toString() ?? "";
    lngElm.value = store.state.map.lng?.toString() ?? "";
    templateElm.value = store.state.map.template;
    urlElm.value = store.state.map.url;
    modal.show();
    urlElm.focus();
  };

  const hide = () => {
    modal.hide();
  };

  latElm.addEventListener("change", updateUrl);
  lngElm.addEventListener("change", updateUrl);
  templateElm.addEventListener("change", updateUrl);
  saveBtn.addEventListener("click", onSaveClick);
  closeBtn.addEventListener("click", onCloseClick);

  return {
    show,
    hide,
  };
}
