import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { defineStore } from 'pinia';
// Interface pour les options spécifiques de la classe
interface ApiRequestParams extends AxiosRequestConfig {
  skipPartition?: boolean;
  skipVersion?: boolean;
}

class ApiClient {
  /**
   * Effectue une requête GET.
   * @param url - L'URL de la requête
   * @param params - Options et configuration de la requête
   * @returns Une promesse résolue avec la réponse Axios
   */
  async get(
    url: string,
    params: ApiRequestParams = { skipPartition: false, skipVersion: false }
  ): Promise<AxiosResponse> {
    return await axios({ method: 'GET', url, ...params });
  }

  /**
   * Effectue une requête POST.
   * @param url - L'URL de la requête
   * @param params - Options et configuration de la requête
   * @returns Une promesse résolue avec la réponse Axios
   */
  async post(
    url: string,
    params: ApiRequestParams = { skipPartition: false, skipVersion: false }
  ): Promise<AxiosResponse> {
    return await axios({ method: 'POST', url, ...params });
  }

  /**
   * Effectue une requête DELETE.
   * @param url - L'URL de la requête
   * @param params - Options et configuration de la requête
   * @returns Une promesse résolue avec la réponse Axios
   */
  async delete(
    url: string,
    params: ApiRequestParams = { skipPartition: false, skipVersion: false }
  ): Promise<AxiosResponse> {
    return await axios({ method: 'DELETE', url, ...params });
  }

  /**
   * Effectue une requête PUT.
   * @param url - L'URL de la requête
   * @param params - Options et configuration de la requête
   * @returns Une promesse résolue avec la réponse Axios
   */
  async put(
    url: string,
    params: ApiRequestParams = { skipPartition: false, skipVersion: false }
  ): Promise<AxiosResponse> {
    return await axios({ method: 'PUT', url, ...params });
  }

  /**
   * Effectue une requête PATCH.
   * @param url - L'URL de la requête
   * @param params - Options et configuration de la requête
   * @returns Une promesse résolue avec la réponse Axios
   */
  async patch(
    url: string,
    params: ApiRequestParams = { skipPartition: false, skipVersion: false }
  ): Promise<AxiosResponse> {
    return await axios({ method: 'PATCH', url, ...params });
  }
}

export const useApiStore = defineStore('api', {
  state: () => ({
    api: new ApiClient(),
  }),
});
