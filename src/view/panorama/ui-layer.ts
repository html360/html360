export type UILayer = ReturnType<typeof create>;

export const UILayer = {
  create,
};

function create() {
  const uiLayer = document.createElement("div");
  uiLayer.classList.add("ui-layer");
  return uiLayer;
}
