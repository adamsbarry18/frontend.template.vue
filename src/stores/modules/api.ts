import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { defineStore } from 'pinia';

// Axios instance with baseURL from environment
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interface for class-specific options
interface ApiRequestParams extends AxiosRequestConfig {
  skipAuthErrorInterceptor?: boolean;
  skipVersion?: boolean;
}

class ApiClient {
  /**
   * Performs a GET request.
   * @param url - The URL for the request
   * @param params - Options and configuration for the request
   * @returns A promise that resolves with the Axios response
   */
  async get(
    url: string,
    params: ApiRequestParams = { skipVersion: false }
  ): Promise<AxiosResponse> {
    return await apiClient({ method: 'GET', url, ...params });
  }

  /**
   * Performs a POST request.
   * @param url - The URL for the request
   * @param params - Options and configuration for the request
   * @returns A promise that resolves with the Axios response
   */
  async post(
    url: string,
    params: ApiRequestParams = { skipVersion: false }
  ): Promise<AxiosResponse> {
    return await apiClient({ method: 'POST', url, ...params });
  }

  /**
   * Performs a DELETE request.
   * @param url - The URL for the request
   * @param params - Options and configuration for the request
   * @returns A promise that resolves with the Axios response
   */
  async delete(
    url: string,
    params: ApiRequestParams = { skipVersion: false }
  ): Promise<AxiosResponse> {
    return await apiClient({ method: 'DELETE', url, ...params });
  }

  /**
   * Performs a PUT request.
   * @param url - The URL for the request
   * @param params - Options and configuration for the request
   * @returns A promise that resolves with the Axios response
   */
  async put(
    url: string,
    params: ApiRequestParams = { skipVersion: false }
  ): Promise<AxiosResponse> {
    return await apiClient({ method: 'PUT', url, ...params });
  }

  /**
   * Performs a PATCH request.
   * @param url - The URL for the request
   * @param params - Options and configuration for the request
   * @returns A promise that resolves with the Axios response
   */
  async patch(
    url: string,
    params: ApiRequestParams = { skipVersion: false }
  ): Promise<AxiosResponse> {
    return await apiClient({ method: 'PATCH', url, ...params });
  }
}

/**
 * Represents the API store.
 *
 * @remarks
 * This store is created using defineStore from Pinia and encapsulates the state
 * for handling the API client instance. The state contains:
 * - api: An instance of ApiClient used for managing API interactions.
 *
 * @example
 * const apiStore = useApiStore();
 * const apiClient = apiStore.api;
 * // Use apiClient to perform API operations, e.g., apiClient.get('/endpoint').
 */
export const useApiStore = defineStore('api', {
  state: () => ({
    api: new ApiClient(),
  }),
});
