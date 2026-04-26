export type UILayer = ReturnType<typeof create>;

export const UI_LAYER_ID = "ui-layer"

export const UILayer = {
  create,
};

function create() {
  const uiLayer = document.createElement("div");
  uiLayer.id = UI_LAYER_ID;
  document.body.append(uiLayer);
  return uiLayer;
}
