import { defineAPIConfig } from "@/utils/common";

const FILE = defineAPIConfig({
  GET_ALL_FILES: () => ({
    url: "/api/docs/all", 
    method: "GET",
  }),

  CREATE_FILE: () => ({
    url: "api/docs/upload",
    method: "POST",
  }),

  GET_SEARCH_RESULT: (fileId: string) => ({
    url: `api/docs/search?q=${fileId}`,
    method: "GET",
  }),

});

export default FILE;
