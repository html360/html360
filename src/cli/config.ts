export type Config = {
  author: string;
  authorUrl: string;
  useImageNameAsTitle: boolean;
};

export const defaultConfig: Config = {
  author: "",
  authorUrl: "",
  useImageNameAsTitle: false,
};
