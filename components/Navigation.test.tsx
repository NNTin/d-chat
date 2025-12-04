import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigation } from '../components/Navigation';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('Navigation Component', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByText('OllamaChat')).toBeDefined();
    expect(screen.getByText('Chat')).toBeDefined();
    expect(screen.getByText('Admin')).toBeDefined();
    expect(screen.getByText('Widget Preview')).toBeDefined();
  });

  it('renders sign out link', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByText('Sign Out')).toBeDefined();
  });
});