import { HotspotModal } from "./hotspot-modal/hotspot-modal";
import { EditModeActions } from "./edit-mode-actions/edit-mode-actions";
import { MainMenu } from "./menu/menu-main";
import { Store } from "./store/store";
import { ViewerAdapter } from "./viewer/viewer-adapter";
import { Crosshair } from "./crosshair/crosshair";
import { OrientationMessager } from "./orientation-messager/orientation-messager";
import { UILayer } from "./ui-layer/ui-layer";
import { PanoInfoModal } from "./pano-info-modal/pano-info-modal";
import { PanoInfo } from "./pano-info/pano-info";

window.addEventListener("load", async () => {
  const store = Store.create();
  const uiLayer = UILayer.create();
  const viewer = await ViewerAdapter.create(store, uiLayer);
  const mainMenu = MainMenu.create(store, uiLayer, viewer);
  const panoInfoModal = PanoInfoModal.create(store, uiLayer);
  const hotspotModal = HotspotModal.create(store, uiLayer, viewer);
  const editModeActions = EditModeActions.create(store,  uiLayer, panoInfoModal, hotspotModal);

  PanoInfo.create(store, uiLayer);
  Crosshair.create(store, uiLayer);
  OrientationMessager.create(store);

  (window as any).html360 = {
    store,
    viewer,
    panoInfoModal,
    hotspotModal,
    mainMenu,
    editModeActions,
  };
});
