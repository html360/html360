import { PannellumHotSpot } from "./pannellum/pannellum";

export type State = {
  name: string;
  yaw: number;
  pitch: number;
  hfov: number;
  hotspots: PannellumHotSpot[];
  tourCandidatesUrls: string[];
  isEditMode: boolean;
  isMultires: boolean;
  author?: string;
  authorURL?: string;
  version: string;
};

export const defaultState: State = {
  name: "html360",
  yaw: 0,
  pitch: 0,
  hfov: 100,
  hotspots: [],
  tourCandidatesUrls: [],
  isEditMode: false,
  isMultires: false,
  version: "0.0.0",
};
