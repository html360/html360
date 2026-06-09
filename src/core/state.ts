import { PannellumHotSpot } from "./pannellum/pannellum";

export type State = {
  htmlName: string;
  yaw: number;
  pitch: number;
  hfov: number;
  hotspots: PannellumHotSpot[];
  tourCandidatesUrls: string[];
  isReadOnly: boolean;
  isEditMode: boolean;
  isMultires: boolean;
  tabTitle: string;
  title: string;
  author: string;
  authorURL: string;
  version: string;
};

export const defaultState: State = {
  htmlName: "",
  yaw: 0,
  pitch: 0,
  hfov: 100,
  hotspots: [],
  tourCandidatesUrls: [],
  isReadOnly: false,
  isEditMode: false,
  isMultires: false,
  tabTitle: "",
  title: "",
  author: "",
  authorURL: "",
  version: "",
};
