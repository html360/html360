import { Store } from "../store/store";
import { svgArrowLeft, svgArrowRight } from "../svg/svg";
import { UILayer } from "../ui-layer/ui-layer";
import { navigateTo } from "../utils/window";

export type AutoNav = ReturnType<typeof create>;

export const AutoNav = {
  create,
};

function create(store: Store, uiLayer: UILayer) {
  const state = store.state.autoNav;

  if (!state) {
    return;
  }

  const navElm = document.createElement("div");
  navElm.classList.add("auto-nav", "hidden");

  const prevBtnElm = document.createElement("div");
  prevBtnElm.classList.add("auto-nav-btn");
  prevBtnElm.innerHTML = svgArrowLeft;
  prevBtnElm.addEventListener("click", () => {
    navigateTo(state.prevUrl);
  });
  navElm.appendChild(prevBtnElm);

  const counterElm = document.createElement("div");
  counterElm.classList.add("auto-nav-counter");
  counterElm.innerHTML = `${state.pageNumber}&nbsp;/&nbsp;${state.totalCount}`;
  navElm.appendChild(counterElm);

  const nextBtnElm = document.createElement("div");
  nextBtnElm.classList.add("auto-nav-btn");
  nextBtnElm.innerHTML = svgArrowRight;
  nextBtnElm.addEventListener("click", () => {
    navigateTo(state.nextUrl);
  })
  navElm.appendChild(nextBtnElm);

  uiLayer.append(navElm);

  store.on("setIsLoaded", (isLoaded) => {
    navElm.classList.toggle("hidden", !isLoaded);
  });

  store.on("setIsEditMode", (isVisible) => {
    navElm.classList.toggle("hidden", isVisible);
  });
}
