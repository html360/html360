import { Store } from "../store/store";
import { getElementById } from "../utils/document";
import { Modal } from "../modal/modal";

export type PanoInfoModal = ReturnType<typeof create>;

export const PanoInfoModal = {
  create,
};

function create(store: Store, uiLayer: HTMLDivElement) {
  const modal = Modal.create({
    id: "pano-meta-modal",
    header: "Panorama details",
    content: `
      <div class="field-box">
        <label class="label" for="pano-meta-author-url">Tab title</label>
        <input type="text" class="input" id="pano-meta-tab-title" placeholder="Enter tab title...">
      </div>
      <div class="field-box">
        <label for="pano-meta-title" class="label">Panorama Title</label>
        <input id="pano-meta-title" type="text" class="input" placeholder="Enter panorama title...">
      </div>
      <div class="field-box">
        <label for="pano-meta-author" class="label">Author</label>
        <input id="pano-meta-author" type="text" class="input" placeholder="Enter author...">
      </div>
      <div class="field-box">
        <label class="label" for="pano-meta-author-url">Author URL</label>
        <input type="text" class="input" id="pano-meta-author-url" placeholder="Enter author url...">
      </div>
    `,
    footer: `
      <button id="pano-meta-save" class="button">Save</button>
      <button id="pano-meta-close" class="button secondary">Close</button>
    `,
    uiLayer,
  });

  const titleElm = getElementById<HTMLInputElement>("pano-meta-title");
  const authorElm = getElementById<HTMLInputElement>("pano-meta-author");
  const authorUrlElm = getElementById<HTMLInputElement>("pano-meta-author-url");
  const tabTitleElm = getElementById<HTMLInputElement>("pano-meta-tab-title");
  const saveBtn = getElementById("pano-meta-save");
  const closeBtn = getElementById("pano-meta-close");

  const onSaveClick = () => {
    store.setTitle(titleElm.value);
    store.setAuthor(authorElm.value);
    store.setAuthorUrl(authorUrlElm.value);
    store.setTabTitle(tabTitleElm.value);
    hide();
  };

  const onCloseClick = () => {
    hide();
  };

  const show = async () => {
    titleElm.value = store.state.title;
    authorElm.value = store.state.author;
    authorUrlElm.value = store.state.authorURL;
    tabTitleElm.value = store.state.tabTitle;

    saveBtn.addEventListener("click", onSaveClick);
    closeBtn.addEventListener("click", onCloseClick);
    modal.show();
  };

  const hide = () => {
    saveBtn.removeEventListener("click", onSaveClick);
    closeBtn.removeEventListener("click", onCloseClick);
    modal.hide();
  };

  return {
    show,
    hide,
  };
}
