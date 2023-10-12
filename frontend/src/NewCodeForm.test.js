import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NewCodeForm from './NewCodeForm';
import UserContext from './auth/UserContext';
import QreatorApi from './API';


const mockUserContextValue = {
  currUser: {
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    email: 'testuser@example.com',
  },
};

test('renders the NewCodeForm component', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={mockUserContextValue}>
        <NewCodeForm />
      </UserContext.Provider>
    </MemoryRouter>
  );
  const heading = screen.getByText('Build your own QR Code');
  expect(heading).toBeInTheDocument();
});

test('handles form input changes', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={mockUserContextValue}>
        <NewCodeForm />
      </UserContext.Provider>
    </MemoryRouter>
    );
  const input = screen.getByLabelText('- QR Data (Text or URL) -');
  fireEvent.change(input, { target: { value: 'Test QR Data' } });
  expect(input).toHaveValue('Test QR Data');
});


// Create a mock for the QreatorApi.createCode function
jest.mock('./API', () => ({
  createCode: jest.fn(),
}));

// Mock the QreatorApi.createCode implementation to resolve with a sample code
QreatorApi.createCode.mockResolvedValue({
  url: 'https://example.com/sample-code',
  description: 'Sample QR Code',
});

test('displays a QR Code preview', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={mockUserContextValue}>
        <NewCodeForm />
      </UserContext.Provider>
    </MemoryRouter>
    );

  const input = screen.getByLabelText('- QR Data (Text or URL) -');
  fireEvent.change(input, { target: { value: 'Test QR Data' } });

 
  act(() => {
    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);
  })

  // Check if QreatorApi.createCode was called with the expected data
  expect(QreatorApi.createCode).toHaveBeenCalledWith({
    text: 'Test QR Data',
    margin: 4,
    size: 200,
    dark: '#000000',
    light: '#ffffff',
    centerImageUrl: '',
    centerImageSizeRatio: 0.3,
    description: 'Your Description Here',
  });
});

