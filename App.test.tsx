import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AppContent } from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ApiService } from './services/api';

vi.mock('./services/api', () => ({
  ApiService: {
    checkHealth: vi.fn(),
    setBaseUrl: vi.fn(),
    sendMessage: vi.fn(),
    getStats: vi.fn(),
    getBaseUrl: vi.fn().mockReturnValue(''),
  }
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat route by default', async () => {
    (ApiService.checkHealth as any).mockResolvedValue(true);
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );

    expect(screen.getByText('OllamaChat')).toBeDefined(); // Navigation
    expect(screen.getByText(/Connected to Ollama/i)).toBeDefined(); // Chat Header
  });

  it('renders login route', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome Back')).toBeDefined();
    // Navigation should be hidden on login page
    expect(screen.queryByText('OllamaChat')).toBeNull();
  });

  it('renders backend offline banner when health check fails', async () => {
    (ApiService.checkHealth as any).mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Backend is offline/i)).toBeDefined();
    });
  });

  it('sets backend URL from query params', () => {
     render(
      <MemoryRouter initialEntries={['/?backend=http://custom-api.com']}>
        <AppContent />
      </MemoryRouter>
    );
    
    expect(ApiService.setBaseUrl).toHaveBeenCalledWith('http://custom-api.com');
  });
});