import { defineAPIConfig } from "@/utils/common";

const FILE = defineAPIConfig({
  GET_ALL_FILES: () => ({
    url: "/akpms/userfiles/all", // Adjust this to your actual endpoint
    method: "GET",
  }),

  GET_FILE_BY_ID: (id: string) => ({
    url: `files/api/${id}`,
    method: "GET",
  }),
  CREATE_FILE: () => ({
    url: "api/docs/upload",
    method: "POST",
  }),

  UPDATE_FILE: (id: string) => ({
    url: `files/api/${id}`,
    method: "PUT",
  }),

  DELETE_FILE: (id: string) => ({
    url: `files/api/${id}`,
    method: "DELETE",
  }),

  GET_VERSION_HISTORY: (fileId: string) => ({
    url: `files/api/${fileId}/versions`,
    method: "GET",
  }),

  DOWNLOAD_VERSION: (fileId: string, version: string) => ({
    url: `files/api/${fileId}/versions/${version}/download`,
    method: "GET",
  }),
});

export default FILE;
