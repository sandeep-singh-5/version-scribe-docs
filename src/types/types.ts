// types.tsx

export type FileType = "docx" | "xlsx" | "pptx" | "ppt" | string;

export interface FileVersionRaw {
  fileName: string;
  keywords: string;
  downloadLink: string;
  uploadedOn: string;
  author: string;
  version: string;
}

export interface FileDataResponse  {
  fileName : string;
  versions: FileVersionRaw[];
};