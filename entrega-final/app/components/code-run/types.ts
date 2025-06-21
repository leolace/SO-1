export interface CodeRunData {
  input?: string | string[];
  file: string;
  directory: "1" | "2" | "3";
  mode: "default" | "time";
}
