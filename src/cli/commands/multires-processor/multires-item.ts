import { ProcessItem } from "../../types/process-item";
import { MultiresContext } from "./multires-context";

export type MultiresItem = ProcessItem & {
  ctx: MultiresContext;
};

