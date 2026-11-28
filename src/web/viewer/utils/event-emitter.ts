export type Callback = (...args: any[]) => void;

export function createEventEmitter<Events extends Record<string, Callback>>() {
  const listeners: Partial<Record<keyof Events, Callback[]>> = {};

  const on = <K extends keyof Events>(event: K, callback: Events[K]) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event]!.push(callback);
  };

  const off = <K extends keyof Events>(event: K, callback: Events[K]) => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event]!.filter((cb) => cb !== callback);
  };

  const emit = <K extends keyof Events>(
    event: K,
    ...args: Parameters<Events[K]>
  ) => {
    listeners[event]?.forEach((cb) => cb(...args));
  };

  return { on, off, emit };
}
