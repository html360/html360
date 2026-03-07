import 'pannellum'; 

export interface PannellumConfig {
    panorama: string;
    type: 'equirectangular';
    autoLoad?: boolean;
    // ... 
}

export interface PannellumViewer {
    getYaw(): number;
    getPitch(): number;
    destroy(): void;
    on(eventType: "load", callBack: () => void): void;
    // ... 
}

declare const pannellum: {
    viewer: (container: string | HTMLElement, config: PannellumConfig) => PannellumViewer;
};

export default pannellum;