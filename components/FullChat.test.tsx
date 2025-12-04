import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FullChat } from '../components/FullChat';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../services/api';

// Mock the API Service
vi.mock('../services/api', () => ({
  ApiService: {
    sendMessage: vi.fn(),
  }
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('FullChat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial welcome message', () => {
    render(<FullChat />);
    expect(screen.getByText(/Hello! I am your Ollama-powered AI assistant/i)).toBeDefined();
  });

  it('updates input value on typing', () => {
    render(<FullChat />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input).toHaveProperty('value', 'Test message');
  });

  it('sends a message and displays response', async () => {
    (ApiService.sendMessage as any).mockResolvedValue('This is a mock response');

    render(<FullChat />);
    const input = screen.getByPlaceholderText('Type your message...');
    const submitBtn = screen.getByRole('button', { name: '' }); // Send icon button usually has no text content, checked via selector or role

    fireEvent.change(input, { target: { value: 'Hello' } });
    // Find button by looking for the submit type or icon
    // Using simple query selector logic or just clicking the form submit
    fireEvent.submit(input.closest('form')!);

    // Expect user message to appear
    expect(screen.getByText('Hello')).toBeDefined();
    
    // Expect loading state (implicit check if input is disabled or similar)
    expect(input).toHaveProperty('disabled', true);

    await waitFor(() => {
        expect(screen.getByText('This is a mock response')).toBeDefined();
    });
    
    expect(input).toHaveProperty('disabled', false);
  });

  it('handles API errors', async () => {
    (ApiService.sendMessage as any).mockRejectedValue(new Error('Network error'));

    render(<FullChat />);
    const input = screen.getByPlaceholderText('Type your message...');
    
    fireEvent.change(input, { target: { value: 'Trigger Error' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
        expect(screen.getByText(/Error: Could not connect to the backend/i)).toBeDefined();
    });
  });
});