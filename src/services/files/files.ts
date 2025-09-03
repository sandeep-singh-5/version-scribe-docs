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
        ...FILE.CREATE_FILE(),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  },

  /**
   * Update a file by ID
   */
  UpdateFile: async ({ fileId, bodyData }: { fileId: string; bodyData: BodyData }) => {
    try {
      const payload = {
        ...FILE.UPDATE_FILE(fileId),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  },

  /**
   * Delete a file by ID
   */
  DeleteFile: async ({ fileId }: { fileId: string }) => {
    try {
      const payload = {
        ...FILE.DELETE_FILE(fileId),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  /**
   * Get version history for a file
   */
  GetVersionHistory: async ({ fileId }: { fileId: string }) => {
    try {
      const payload = {
        ...FILE.GET_VERSION_HISTORY(fileId),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      console.error("Error fetching version history:", error);
      throw error;
    }
  },

  /**
   * Download a specific version of a file
   */
  DownloadVersion: async ({ fileId, version }: { fileId: string; version: string }) => {
    try {
      const payload = {
        ...FILE.DOWNLOAD_VERSION(fileId, version),
        // If you want the file as blob, you might need to adjust APIrequest to support `responseType: 'blob'`
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      console.error("Error downloading version:", error);
      throw error;
    }
  },
};

export default FileServices;
