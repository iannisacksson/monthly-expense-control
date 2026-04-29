import httpClient from "./http-client";
import type { HealthResponse } from "../types";

export const healthService = {
  async check(): Promise<HealthResponse> {
    const { data } = await httpClient.get<HealthResponse>("/health");
    return data;
  },
};
