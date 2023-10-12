import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { MemoryRouter, Route } from 'react-router-dom';

const mockLogin = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: { pathname: '/' },
  }),
}));

describe('LoginForm', () => {
  // Smoke Test
  it('should render without errors', () => {
    render(<LoginForm login={() => {}} />);
  });

  // Snapshot Test
  it('should match the snapshot', () => {
    const { asFragment } = render(<LoginForm login={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Route path="/login">
          <LoginForm login={mockLogin} />
        </Route>
      </MemoryRouter>
    );
  };

  it('displays validation errors for empty fields', () => {
    renderWithRouter();

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Ensure that error messages are displayed for both fields
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('redirects to home page after successful login', async () => {
    // Mock a successful login
    mockLogin.mockResolvedValue({ success: true });

    renderWithRouter();

    // Fill out the form
    const usernameInput = screen.getByTestId('Username');
    const passwordInput = screen.getByTestId('Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for the redirection to occur
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
