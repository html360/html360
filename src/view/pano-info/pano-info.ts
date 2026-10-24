import { Store } from "../store/store";
import { svgMap } from "../svg/svg";
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

  const mapLink = document.createElement("a");
  mapLink.target = "_blank";
  mapLink.innerHTML = svgMap;
  infoElm.appendChild(mapLink);

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

    mapLink.href = store.state.map.url;
    mapLink.classList.toggle("display-none", !store.state.map.url);

    const isVisible = !!store.state.title || !!store.state.author || !!store.state.map.url;
    infoElm.classList.toggle("hidden", !isVisible);
  };

  store.on("setTitle", update);
  store.on("setAuthor", update);
  store.on("setAuthorUrl", update);
  store.on("setMapUrl", update);

  update();
}
