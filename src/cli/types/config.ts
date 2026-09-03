export type Config = {
  tabTitle: string;
  title: string;
  author: string;
  authorUrl: string;
  useImageNameAsTitle: boolean;
  useAutoNav: boolean;
};

export const defaultConfig: Config = {
  tabTitle: "",
  title: "",
  author: "",
  authorUrl: "",
  useImageNameAsTitle: false,
  useAutoNav: false,
};
