import { PannellumHotSpot } from "../../core/pannellum/pannellum";
import { defaultState, State } from "../../core/state";
import { getElementById } from "../utils/document";
import { createEventEmitter } from "../utils/event-emitter";
import { parseYaw, parsePitch, parseHfov } from "../url/url";

export type Store = ReturnType<typeof create>;

export const Store = {
  create,
};

type StoreEvents = {
  setYaw: (yaw: number) => void;
  setPitch: (pitch: number) => void;
  setHfov: (hfov: number) => void;
  addHotspot: (hotspot: PannellumHotSpot) => void;
  removeHotspot: (id: string) => void;
  setIsEditMode: (isEditMode: boolean) => void;
};

function create() {
  const stateElement = getElementById("state");
  let state: State = getState(stateElement);

  const event = createEventEmitter<StoreEvents>();
  const on = event.on;
  const off = event.off;

  const setYaw = (value: number) => {
    state.yaw = value;
    event.emit("setYaw", value);
  };

  const setPitch = (value: number) => {
    state.pitch = value;
    event.emit("setPitch", value);
  };

  const setHfov = (value: number) => {
    state.hfov = value;
    event.emit("setHfov", value);
  };

  const addHotspot = (value: PannellumHotSpot) => {
    state.hotspots = [...state.hotspots, value];
    event.emit("addHotspot", value);
  };

  const removeHotspot = (hotspotId: string) => {
    state.hotspots = state.hotspots.filter((x) => x.id !== hotspotId);
    event.emit("removeHotspot", hotspotId);
  };

  const setIsEditMode = (value: boolean) => {
    state.isEditMode = value;
    event.emit("setIsEditMode", value);
  };

  const getOrientationUrlParams = () => {
    const result = new URLSearchParams({
      yaw: state.yaw.toFixed(2),
      pitch: state.pitch.toFixed(2),
      hfov: state.hfov.toFixed(2),
    });
    return `?${result.toString()}`;
  };

  const save = () => {
    setIsEditMode(false);
    stateElement.textContent = JSON.stringify(state);

    const docClone = document.documentElement.cloneNode(true) as HTMLElement;
    docClone.querySelector("#panorama")!.innerHTML = "";
    docClone.querySelector("#loader")!.removeAttribute("style");
    const fullHtml = "<!doctype html>\n" + docClone.outerHTML;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = state.name;
    link.click();
  };

  return {
    get state() {
      return state;
    },
    setYaw,
    setPitch,
    setHfov,
    addHotspot,
    removeHotspot,
    setIsEditMode,
    getOrientationUrlParams,
    on,
    off,
    save,
  };
}

const getState = (stateElement: HTMLElement): State => {
  try {
    const state = JSON.parse(stateElement.textContent) as State;
    const params = new URLSearchParams(window.location.search);
    state.yaw = parseYaw(params) ?? state.yaw;
    state.pitch = parsePitch(params) ?? state.pitch;
    state.hfov = parseHfov(params) ?? state.hfov;
    return state;
  } catch (error) {
    console.log(error);
    return defaultState;
  }
};

