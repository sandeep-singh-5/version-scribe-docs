import { BodyData, QueryParams } from "@/types/api-request";
import { message } from "antd";
import axios, { AxiosRequestConfig, Method } from "axios";
import config from "../config";

interface APIRequestParams {
  method: Method;
  url: string;
  baseURL?: string;
  queryParams?: QueryParams;
  bodyData?: BodyData;
  token?: string;
  formHeaders?: QueryParams; // unused — remove or implement
}

const APIrequest = async ({
  method,
  url,
  baseURL,
  queryParams,
  bodyData,
  token,
}: APIRequestParams) => {
  try {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      baseURL: baseURL || config.API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Add token if provided
    if (token) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Attach query parameters
    if (queryParams) {
      axiosConfig.params = Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
    }

    // Handle body data
    if (bodyData) {
      if (bodyData instanceof FormData) {
        axiosConfig.headers = {
          ...axiosConfig.headers,
          "Content-Type": "multipart/form-data",
        };
        axiosConfig.data = bodyData;
      } else {
        const cleanedBody = Object.entries(bodyData).reduce((acc, [key, value]) => {
          if (
            typeof value === "string" ? value.trim() !== "" : value !== null && value !== undefined
          ) {
            acc[key] = typeof value === "string" ? value.trim() : value;
          }
          return acc;
        }, {} as Record<string, any>);

        axiosConfig.data = cleanedBody;
      }
    }

    // Perform request
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    if (status === 400 || status === 500) {
      message.error(errorMsg);
    } else {
      message.error("Something went wrong");
    }

    return null;
  }
};

export default APIrequest;
