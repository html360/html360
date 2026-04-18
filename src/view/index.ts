import { Hotspot } from "./hotspot/hotspot";
import { EditModeActions } from "./edit-mode-actions/edit-mode-actions";
import { MainMenu } from "./menu/menu-main";
import { Store } from "./store/store";
import { ViewerAdapter } from "./viewer/viewer-adapter";
import { Crosshair } from "./crosshair/crosshair";
import { OrientationMessager } from "./orientation-messager/orientation-messager";

window.addEventListener("load", async () => {
  const store = Store.create();
  const viewer = await ViewerAdapter.create(store);
  const mainMenu = MainMenu.create(store);
  const hotspot = Hotspot.create(store, viewer);
  const editModeActions = EditModeActions.create(store, hotspot);

  Crosshair.create(store);
  OrientationMessager.create(store);

  (window as any).html360 = {
    store,
    viewer,
    hotspot,
    mainMenu,
    editModeActions,
  };
});
