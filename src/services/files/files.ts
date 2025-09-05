import FILE from "@/api-endpoints";
import APIrequest from "@/services/axios";
import { BodyData } from "@/types/api-request";

const FileServices = {
  /**
   * Fetch all files
   */
  GetAllFiles: async () => {
    try {
      const payload = {
        ...FILE.GET_ALL_FILES(),
      };
      const res = await APIrequest(payload);      
      return res;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  },

  /**
   * Create a new file
   */
 CreateFile: async ({ bodyData }: { bodyData: BodyData }) => {
  try {
    const payload = {
      ...FILE.CREATE_FILE(), // e.g. { url: 'http://localhost:8080/api/docs/upload', method: 'POST' }
      bodyData,              // can be FormData or JSON
      headers: bodyData instanceof FormData ? {} : { "Content-Type": "application/json" },
    };

    const res = await APIrequest(payload);
    return res;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }},

 

  /**
   * Get version history for a file
   */
  GetSearchResult: async ({ fileId }: { fileId: string }) => {
    try {
      const payload = {
        ...FILE.GET_SEARCH_RESULT(fileId),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      console.error("Error fetching version history:", error);
      throw error;
    }
  },

  
};

export default FileServices;
