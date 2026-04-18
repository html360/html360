import { State } from "../../core/state";
import { Store } from "../store/store";

export type OrientationMessage = Pick<State, "yaw" | "pitch" | "hfov"> & {
  isHtml360OrientationMessage: true;
};

export function isOrientationMessage(e: MessageEvent): e is MessageEvent<OrientationMessage> {
  return e?.data?.isHtml360OrientationMessage === true;
}

export type OrientationMessager = ReturnType<typeof create>;

export const OrientationMessager = {
  create,
};

function create(store: Store) {
  if (!window.opener) {
    return;
  }

  let throttleTimeout: any = null;

  const broadcast = () => {

    if (throttleTimeout) return;

    throttleTimeout = setTimeout(() => {
      const message: OrientationMessage = {
        isHtml360OrientationMessage: true,
        yaw: store.state.yaw,
        pitch: store.state.pitch,
        hfov: store.state.hfov,
      };

      window.opener.postMessage(message, "*");
      
      throttleTimeout = null;
    }, 20);   };

  store.on("setYaw", broadcast);
  store.on("setPitch", broadcast);
  store.on("setHfov", broadcast);
}

