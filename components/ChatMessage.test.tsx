import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '../components/ChatMessage';
import { Message } from '../types';
import { describe, it, expect } from 'vitest';

describe('ChatMessage Component', () => {
  const userMsg: Message = {
    id: '1',
    role: 'user',
    content: 'Hello AI',
    timestamp: 1234567890
  };

  const botMsg: Message = {
    id: '2',
    role: 'assistant',
    content: 'Hello Human',
    timestamp: 1234567899
  };

  it('renders user message correctly', () => {
    render(<ChatMessage message={userMsg} />);
    const msgElement = screen.getByText('Hello AI');
    expect(msgElement).toBeDefined();
    // Check for user-specific styling (blue background)
    expect(msgElement.className).toContain('bg-blue-600');
  });

  it('renders assistant message correctly', () => {
    render(<ChatMessage message={botMsg} />);
    const msgElement = screen.getByText('Hello Human');
    expect(msgElement).toBeDefined();
    // Check for bot-specific styling (white background with border)
    expect(msgElement.className).toContain('bg-white');
  });

  it('aligns user message to the right', () => {
    const { container } = render(<ChatMessage message={userMsg} />);
    // Just a basic check on the wrapper structure
    const flexWrapper = container.firstChild as HTMLElement;
    expect(flexWrapper.className).toContain('justify-end');
  });

  it('aligns assistant message to the left', () => {
    const { container } = render(<ChatMessage message={botMsg} />);
    const flexWrapper = container.firstChild as HTMLElement;
    expect(flexWrapper.className).toContain('justify-start');
  });
});