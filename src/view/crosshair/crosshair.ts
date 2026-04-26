import { Store } from "../store/store";
import { UILayer } from "../ui-layer/ui-layer";

export type Crosshair = ReturnType<typeof create>;

export const Crosshair = {
  create,
};

function create(store: Store, uiLayer: UILayer) {
  const crosshair = document.createElement("div");
  crosshair.classList.add("crosshair", "hidden");
  uiLayer.append(crosshair);

  store.on("setIsEditMode", (isVisible) => {
    crosshair.classList.toggle("hidden", !isVisible);
  });
}
