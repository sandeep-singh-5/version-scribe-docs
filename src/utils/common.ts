type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface APIEndpointConfig {
  url: string;
  method: HTTPMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

type EndpointFactory = (...args: any[]) => APIEndpointConfig;

export function defineAPIConfig<T extends Record<string, EndpointFactory>>(endpoints: T): T {
  return endpoints;
}

