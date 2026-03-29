import "@pannellum-proxy";

export type Pannellum = {
  viewer: (
    container: string | HTMLElement,
    config: PannellumConfig,
  ) => PannellumViewer;
};

export type PannellumConfig = {
  panorama: string;
  type: "equirectangular";
  yaw?: number;
  pitch?: number;
  hfov?: number;
  hotSpots?: PannellumHotSpot[];
  draggable?: boolean;
  autoLoad?: boolean;
  showControls?: boolean;
  basePath?: string;
  author?: string;
  authorURL?: string;  
};

export type PannellumViewer = {
  destroy(): void;
  getYaw(): number;
  setYaw(yaw: number): void;
  getPitch(): number;
  setPitch(pitch: number): void;
  getHfov(): number;
  setHfov(hfov: number): void;
  toggleFullscreen(): void;
  on(
    eventType:
      | "load"
      | "fullscreenchange"
      | "zoomchange"
      | "mousedown"
      | "mouseup"
      | "touchstart"
      | "touchend"
      | "scenechange"
      | "error"
      | "errorcleared"
      | "messageshown"
      | "messagecleared"
      | "animatefinished"
      | "scenechangefadedone",
    callBack: (e: any) => void,
  ): void;
  addHotSpot: (hs: PannellumHotSpot) => void;
  removeHotSpot: (id: string) => void;
  lookAt: (pitch?: number, yaw?: number, hfov?: number, animated?: boolean|number, callback?: Function, callbackArgs?: any) => void;
};

export type PannellumHotSpot = {
  id: string;
  cssClass?: string;
  pitch: number;
  yaw: number;
  type: PannellumHotSpotType;
  text: string;
  URL: string;
  attributes?: Record<string, string>;
  sceneId?: string;
  targetPitch?: number;
  targetYaw?: number;
  targetHfov?: number;
  createTooltipFunc?: () => any;
  createTooltipArgs?: any;
  clickHandlerFunc: (e: MouseEvent, clickHandlerArgs: ClickHandlerArgs) => any;
  clickHandlerArgs: ClickHandlerArgs;
  scale?: boolean;
};

export type PannellumHotSpotType = "scene" | "info";

export type ClickHandlerArgs = {
  openInNewTab: boolean;
}

const pannellum = (window as any).pannellum as Pannellum;

export default pannellum;
