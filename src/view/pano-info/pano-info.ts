import { Store } from "../store/store";
import { UILayer } from "../ui-layer/ui-layer";

export type PanoInfo = ReturnType<typeof create>;

export const PanoInfo = {
  create,
};

function create(store: Store, uiLayer: UILayer) {
  const infoElm = document.createElement("div");
  infoElm.classList.add("pano-info");

  const titleElm = document.createElement("div");
  titleElm.classList.add("pano-info-title");
  infoElm.appendChild(titleElm);

  const authorElm = document.createElement("div");
  authorElm.classList.add("pano-info-author");
  infoElm.appendChild(authorElm);

  uiLayer.append(infoElm);

  const update = () => {
    titleElm.innerHTML = store.state.title;

    let author = store.state.author;
    if (store.state.authorURL) {
      var authorLink = document.createElement("a");
      authorLink.href = store.state.authorURL;
      authorLink.target = "_blank";
      authorLink.innerHTML = store.state.author;
      author = authorLink.outerHTML;
    }
    authorElm.innerHTML = author;

    const isVisible = !!store.state.title || !!store.state.author;
    infoElm.classList.toggle("hidden", !isVisible);
  };

  store.on("setTitle", update);
  store.on("setAuthor", update);
  store.on("setAuthorUrl", update);

  update();
}
