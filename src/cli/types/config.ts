export type Config = {
  tabTitle: string;
  title: string;
  author: string;
  authorUrl: string;
  useImageNameAsTitle: boolean;
  useAutoNav: boolean;
  addGps: boolean;
  mapUrlTemplate: string;
};

export const defaultConfig: Config = {
  tabTitle: "",
  title: "",
  author: "",
  authorUrl: "",
  useImageNameAsTitle: false,
  useAutoNav: false,
  addGps: false,
  mapUrlTemplate: "",
};
