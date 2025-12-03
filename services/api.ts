import { Message, EmbeddingStats } from '../types';

class ApiServiceClass {
  private baseUrl: string = 'http://localhost:5000'; // Default

  setBaseUrl(url: string) {
    // Ensure no trailing slash
    this.baseUrl = url.replace(/\/$/, '');
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);
      return response?.ok ?? false;
    } catch (e) {
      return false;
    }
  }

  async sendMessage(history: Message[], prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, prompt }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resetDatabase(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/reset`, { method: 'POST' });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  async uploadDocument(file: File): Promise<boolean> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  async getStats(): Promise<EmbeddingStats> {
    // Mocking stats for the demo if backend fails
    try {
      const response = await fetch(`${this.baseUrl}/admin/stats`);
      if (response.ok) return await response.json();
      throw new Error("Failed to fetch");
    } catch (e) {
      return {
        totalDocuments: 12,
        totalChunks: 350,
        lastUpdated: new Date().toISOString(),
        diskUsageMB: 45.2
      };
    }
  }
}

export const ApiService = new ApiServiceClass();