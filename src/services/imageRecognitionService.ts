import axios, { AxiosRequestConfig } from 'axios';

if (!process.env.NEXT_PUBLIC_BASE_URL_IMAGE_RECOGNITION_API) {
    throw new Error('BASE_URL_IMAGE_RECOGNITION_API is undefined')
}

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_IMAGE_RECOGNITION_API, // Set your API base URL in environment variables
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service class
class ImageRecognitionApiService {
  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST request
  async post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT request
  async put<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Centralized error handling
  private handleError(error: unknown): never {
    console.error('API error:', error);
    throw error;
  }
}

// Export an instance of the service
export const apiService = new ImageRecognitionApiService();
