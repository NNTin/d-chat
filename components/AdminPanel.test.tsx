import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AdminPanel } from '../components/AdminPanel';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../services/api';

// Mock Recharts to avoid ResizeObserver issues in test env
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: () => <div>BarChart Mock</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

vi.mock('../services/api', () => ({
  ApiService: {
    getStats: vi.fn(),
    uploadDocument: vi.fn(),
    resetDatabase: vi.fn(),
    getBaseUrl: vi.fn().mockReturnValue('http://test-api'),
  }
}));

describe('AdminPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ApiService.getStats as any).mockResolvedValue({
        totalDocuments: 10,
        totalChunks: 200,
        lastUpdated: new Date().toISOString(),
        diskUsageMB: 50
    });
  });

  it('loads and displays stats on mount', async () => {
    render(<AdminPanel />);
    await waitFor(() => {
        expect(screen.getByText('Vector Stats')).toBeDefined();
        expect(screen.getByText('BarChart Mock')).toBeDefined();
        expect(screen.getByText('Backend: http://test-api')).toBeDefined();
    });
  });

  it('handles file upload interaction', async () => {
    (ApiService.uploadDocument as any).mockResolvedValue(true);
    
    render(<AdminPanel />);
    const fileInput = screen.getByLabelText(/Knowledge Base/i).querySelector('input[type="file"]') as HTMLInputElement;
    // Alternatively find by sibling text since the input is hidden/wrapped
    
    // Using a more direct query if possible, or reliance on structure
    // The input is hidden but accessible via DOM
    const input = document.querySelector('input[type="file"]');
    
    if (input) {
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        fireEvent.change(input, { target: { files: [file] } });
        
        await waitFor(() => {
            expect(ApiService.uploadDocument).toHaveBeenCalled();
            expect(screen.getByText(/Successfully added/i)).toBeDefined();
        });
    }
  });

  it('calls reset database with confirmation', async () => {
    (ApiService.resetDatabase as any).mockResolvedValue(true);
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<AdminPanel />);
    
    const resetBtn = screen.getByText('Reset Memory');
    fireEvent.click(resetBtn);

    await waitFor(() => {
        expect(ApiService.resetDatabase).toHaveBeenCalled();
    });
  });
});