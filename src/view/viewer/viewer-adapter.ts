import pannellum, {
  ClickHandlerArgs,
  PannellumConfig,
  PannellumHotSpot,
} from "../../core/pannellum/pannellum";
import { Store } from "../store/store";
import { getElementById, getPanoramaElement } from "../utils/document";
import { createEventEmitter } from "../utils/event-emitter";
import { navigateTo } from "../utils/window";

export type ViewerAdapter = Awaited<ReturnType<typeof create>>;

export const ViewerAdapter = {
  create,
};

type ViewerAdapterEvents = {
  hotspotClick: (id: string) => void;
};

async function create(store: Store) {
  const viewer = store.state.isMultires
    ? await createMultiresViewer()
    : await createHtmlViewer();

  async function createHtmlViewer() {
    const dataElement = getElementById("panorama-data");
    const base64Data = dataElement.textContent.trim();
    const blob = await (await fetch(base64Data)).blob();
    const objectURL = URL.createObjectURL(blob);

    getElementById("loader").style.display = "none";

    const config: PannellumConfig = {
      type: "equirectangular",
      panorama: objectURL,
      autoLoad: true,
      showControls: false,
      yaw: store.state.yaw,
      pitch: store.state.pitch,
      hfov: store.state.hfov,
      hotSpots: store.state.hotspots
        .filter((x) => x.id)
        .map((x) => ({
          ...x,
          clickHandlerFunc: (e, args) =>
            onHotspotClick(e, x.id as string, args),
        })),
    };
    if (store.state.author) config.author = store.state.author;
    if (store.state.authorURL) config.authorURL = store.state.authorURL;

    const viewer = pannellum.viewer(getPanoramaElement(), config);

    viewer.on("load", () => {
      URL.revokeObjectURL(objectURL);
    });

    return viewer;
  }

  async function createMultiresViewer() {
    const responce = await fetch("config.json");
    const config: PannellumConfig = await responce.json();
    config.basePath = "./";
    config.autoLoad = true;
    config.showControls = false;
    config.yaw = store.state.yaw;
    config.pitch = store.state.pitch;
    config.hfov = store.state.hfov;
    config.hotSpots = store.state.hotspots
      .filter((x) => x.id)
      .map((x) => ({
        ...x,
        clickHandlerFunc: (e, args) => onHotspotClick(e, x.id as string, args),
      }));
    if (store.state.author) config.author = store.state.author;
    if (store.state.authorURL) config.authorURL = store.state.authorURL;

    getElementById("loader").style.display = "none";

    return pannellum.viewer(getPanoramaElement(), config);
  }

  const event = createEventEmitter<ViewerAdapterEvents>();
  const on = event.on;
  const off = event.off;

  const onHotspotClick = (
    e: MouseEvent,
    id: string,
    args: ClickHandlerArgs,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (store.state.isEditMode) {
      event.emit("hotspotClick", id);
    } else {
      const hs = store.state.hotspots.find((x) => x.id === id);
      navigateTo(hs?.URL, args.openInNewTab);
    }
  };

  viewer.on("mouseup", (e: MouseEvent) => {
    store.setYaw(viewer.getYaw());
    store.setPitch(viewer.getPitch());
  });

  viewer.on("touchend", () => {
    store.setYaw(viewer.getYaw());
    store.setPitch(viewer.getPitch());
  });

  viewer.on("zoomchange", () => {
    store.setHfov(viewer.getHfov());
  });

  const addHotspot = (
    hotspotData: Pick<
      PannellumHotSpot,
      "id" | "text" | "yaw" | "pitch" | "type" | "URL"
    >,
    openInNewTab: boolean,
  ) => {
    const hotspot: PannellumHotSpot = {
      ...hotspotData,
      clickHandlerFunc: (e, args: ClickHandlerArgs) =>
        onHotspotClick(e, hotspotData.id as string, args),
      clickHandlerArgs: {
        openInNewTab,
      },
    };

    viewer.addHotSpot(hotspot);
    store.addHotspot(hotspot);
  };

  const removeHotspot = (id: string) => {
    viewer.removeHotSpot(id);
    store.removeHotspot(id);
  };

  const lookAt = (
    pitch?: number,
    yaw?: number,
    hfov?: number,
    animated: boolean | number = 1000,
  ): Promise<void> => {
    if (!animated) {
      viewer.lookAt(pitch, yaw, hfov, animated);
      store.setYaw(viewer.getYaw());
      store.setPitch(viewer.getPitch());
      store.setHfov(viewer.getHfov());
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      viewer.lookAt(pitch, yaw, hfov, animated, () => {
        store.setYaw(viewer.getYaw());
        store.setPitch(viewer.getPitch());
        store.setHfov(viewer.getHfov());
        resolve();
      });
    });
  };

  return { viewer, on, off, addHotspot, removeHotspot, lookAt };
}
