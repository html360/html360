export type HtmlOptions = {
  raw: boolean;
};

export type HtmlContext = {
  imgPaths: string[];
  options: HtmlOptions;
  threadCount: number;
  htmlChunks: HtmlChunks;
};

export type MultiresOptions = {
  cylindrical?: boolean;
  haov?: string;
  hfov?: string;
  vaov?: string;
  voffset?: string;
  horizon?: string;
  tilesize?: string;
  fallbacksize?: string;
  cubesize?: string;
  backgroundcolor?: string;
  avoidbackground?: string;
  quality?: string;
  png?: boolean;
  gpu?: boolean;
  debug?: boolean;
};

export type MultiresContext = {
  imgPaths: string[];
  options: MultiresOptions;
  templateHtml: string;
};

export type HtmlChunks = {
  source: string;
  first: string;
  beforeState: string;
  last: string;
};

export type FileError = {
  fileName: string;
  error: any;
};

