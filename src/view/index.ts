import { Hotspot } from "./hotspot/hotspot";
import { EditModeActions } from "./edit-mode-actions/edit-mode-actions";
import { MainMenu } from "./menu/menu-main";
import { Store } from "./store/store";
import { ViewerAdapter } from "./viewer/viewer-adapter";
import { Crosshair } from "./crosshair/crosshair";
import { OrientationMessager } from "./orientation-messager/orientation-messager";
import { UILayer } from "./ui-layer/ui-layer";

window.addEventListener("load", async () => {
  const store = Store.create();
  const uiLayer = UILayer.create();
  const viewer = await ViewerAdapter.create(store, uiLayer);
  const mainMenu = MainMenu.create(store, viewer, uiLayer);
  const hotspot = Hotspot.create(store, viewer, uiLayer);
  const editModeActions = EditModeActions.create(store, hotspot, uiLayer);

  Crosshair.create(store, uiLayer);
  OrientationMessager.create(store);

  (window as any).html360 = {
    store,
    viewer,
    hotspot,
    mainMenu,
    editModeActions,
  };
});
