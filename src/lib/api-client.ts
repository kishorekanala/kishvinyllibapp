import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, VinylRecord, VinylImage } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Vinyl Records
  async getVinylRecords(): Promise<VinylRecord[]> {
    try {
      const response = await this.client.get<ApiResponse<VinylRecord[]>>('/vinyl');
      return response.data.data || [];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getVinylRecord(id: string): Promise<VinylRecord | null> {
    try {
      const response = await this.client.get<ApiResponse<VinylRecord>>(`/vinyl/${id}`);
      return response.data.data || null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async createVinylRecord(data: {
    title: string;
    artist: string;
    year?: number;
    genre?: string;
    description?: string;
  }): Promise<VinylRecord | null> {
    try {
      const response = await this.client.post<ApiResponse<VinylRecord>>('/vinyl', data);
      return response.data.data || null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async updateVinylRecord(id: string, data: Partial<VinylRecord>): Promise<VinylRecord | null> {
    try {
      const response = await this.client.put<ApiResponse<VinylRecord>>(`/vinyl/${id}`, data);
      return response.data.data || null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async deleteVinylRecord(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/vinyl/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  // Vinyl Images
  async getVinylImages(vinylId: string): Promise<VinylImage[]> {
    try {
      const response = await this.client.get<ApiResponse<VinylImage[]>>(`/vinyl/${vinylId}/images`);
      return response.data.data || [];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async addVinylImage(
    vinylId: string,
    imageData: {
      imageUrl: string;
      imagePublicId: string;
      altText?: string;
    }
  ): Promise<VinylImage | null> {
    try {
      const response = await this.client.post<ApiResponse<VinylImage>>(
        `/vinyl/${vinylId}/images`,
        imageData
      );
      return response.data.data || null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async reorderVinylImages(
    vinylId: string,
    images: Array<{ id: string; displayOrder: number }>
  ): Promise<VinylImage[] | null> {
    try {
      const response = await this.client.patch<ApiResponse<VinylImage[]>>(
        `/vinyl/${vinylId}/images`,
        { images }
      );
      return response.data.data || null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async deleteImage(imageId: string): Promise<boolean> {
    try {
      await this.client.delete(`/images/${imageId}`);
      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<{ success: boolean; user?: unknown }> {
    try {
      const response = await this.client.post('/auth/login', { email, password });
      if (response.data.success && response.data.data) {
        const token = response.data.data.id;
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
        }
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { success: false };
    }
  }

  async register(email: string, password: string): Promise<{ success: boolean; user?: unknown }> {
    try {
      const response = await this.client.post('/auth/register', { email, password });
      if (response.data.success && response.data.data) {
        const token = response.data.data.id;
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
        }
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { success: false };
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string }>;
      console.error(
        'API Error:',
        axiosError.response?.data?.error || axiosError.message
      );
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export const apiClient = new ApiClient();
