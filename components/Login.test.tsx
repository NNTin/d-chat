import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from '../components/Login';
import { describe, it, expect, vi } from 'vitest';

describe('Login Component', () => {
  it('renders login options', () => {
    render(<Login />);
    expect(screen.getByText('Continue with Google')).toBeDefined();
    expect(screen.getByText('Continue with GitHub')).toBeDefined();
    expect(screen.getByText('Continue with Discord')).toBeDefined();
  });

  it('renders welcome message', () => {
    render(<Login />);
    expect(screen.getByText('Welcome Back')).toBeDefined();
  });

  it('handles button clicks', () => {
    // Mock window.alert since the component uses it
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Login />);
    
    fireEvent.click(screen.getByText('Continue with Google'));
    expect(alertMock).toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Continue with GitHub'));
    expect(alertMock).toHaveBeenCalled();

    alertMock.mockRestore();
  });
});