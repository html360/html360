import { PannellumHotSpot } from "./pannellum";

export type State = {
  imgName: string;
  htmlFileName: string;
  yaw: number;
  pitch: number;
  hfov: number;
  hotspots: PannellumHotSpot[];
  tourCandidatesUrls: string[];
  autoNav: AutoNavState | null;
  map: MapState;
  isLoaded: boolean;
  isReadOnly: boolean;
  isEditMode: boolean;
  isMultires: boolean;
  tabTitle: string;
  title: string;
  author: string;
  authorURL: string;
  version: string;
};

export type AutoNavState = {
  totalCount: number;
  pageNumber: number;
  prevUrl: string;
  nextUrl: string;
}

export type MapState = {
  lat: number | null; 
  lng: number | null;
  template: string;
  url: string;
}

export const defaultMapState: MapState = {
    lat: null,
    lng: null,
    template: "",
    url: "",
  };

export const defaultState: State = {
  imgName: "",
  htmlFileName: "",
  yaw: 0,
  pitch: 0,
  hfov: 100,
  hotspots: [],
  tourCandidatesUrls: [],
  autoNav: null,
  map: defaultMapState,
  isLoaded: false,
  isReadOnly: false,
  isEditMode: false,
  isMultires: false,
  tabTitle: "",
  title: "",
  author: "",
  authorURL: "",
  version: "",
};
