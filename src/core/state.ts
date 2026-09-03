import { PannellumHotSpot } from "./pannellum/pannellum";

export type State = {
  imgName: string;
  htmlFileName: string;
  yaw: number;
  pitch: number;
  hfov: number;
  hotspots: PannellumHotSpot[];
  tourCandidatesUrls: string[];
  autoNav: AutoNavState | null;
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

export const defaultState: State = {
  imgName: "",
  htmlFileName: "",
  yaw: 0,
  pitch: 0,
  hfov: 100,
  hotspots: [],
  tourCandidatesUrls: [],
  autoNav: null,
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
