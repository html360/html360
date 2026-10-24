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
import { AutoNav } from "./auto-nav/auto-nav";
import { MapUrlModal } from "./map-url-modal/map-url-modal";

window.addEventListener("load", async () => {
  const store = Store.create();
  const uiLayer = UILayer.create();
  const viewer = await ViewerAdapter.create(store, uiLayer);
  const mainMenu = MainMenu.create(store, uiLayer, viewer);
  const panoInfoModal = PanoInfoModal.create(store, uiLayer);
  const hotspotModal = HotspotModal.create(store, uiLayer, viewer);
  const mapUrlModal = MapUrlModal.create(store, uiLayer);
  const editModeActions = EditModeActions.create(store, uiLayer, panoInfoModal, hotspotModal, mapUrlModal);

  AutoNav.create(store, uiLayer);
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
