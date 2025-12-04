import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WidgetChat } from '../components/WidgetChat';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../services/api';

vi.mock('../services/api', () => ({
  ApiService: {
    sendMessage: vi.fn(),
  }
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('WidgetChat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is initially closed', () => {
    render(<WidgetChat />);
    // Chat window should not be visible
    expect(screen.queryByPlaceholderText('Ask something...')).toBeNull();
  });

  it('opens when FAB is clicked', () => {
    render(<WidgetChat />);
    const fab = screen.getByRole('button');
    fireEvent.click(fab);
    expect(screen.getByPlaceholderText('Ask something...')).toBeDefined();
    expect(screen.getByText('Assistant')).toBeDefined();
  });

  it('sends message and receives response', async () => {
    (ApiService.sendMessage as any).mockResolvedValue('Widget response');

    render(<WidgetChat />);
    fireEvent.click(screen.getByRole('button')); // Open
    
    const input = screen.getByPlaceholderText('Ask something...');
    fireEvent.change(input, { target: { value: 'Hi widget' } });
    
    const submitBtn = input.nextSibling as HTMLElement; // Simple navigation to the button
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(screen.getByText('Widget response')).toBeDefined();
    });
  });
});