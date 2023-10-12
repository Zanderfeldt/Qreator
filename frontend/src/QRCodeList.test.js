import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import QRCodeList from './QRCodeList';
import UserContext from './auth/UserContext';
import { MemoryRouter } from 'react-router-dom'; 
import QreatorApi from './API';

jest.mock('./API');

const contextValue = {
  currUser: {
    id: 1,
    firstName: 'test',
    lastName: 'test',
    username: 'test',
    email: 'test@test.com'
  }
};

test('renders QR code list header and sort buttons', async () => {

  QreatorApi.getUserCodes.mockResolvedValue([]);
  
  render(
  <MemoryRouter>
    <UserContext.Provider value={contextValue}>
      <QRCodeList />
    </UserContext.Provider>
  </MemoryRouter>
  );
  
  await waitFor(() => {
    // Check if the 'Your QR Codes' heading is present
    const heading = screen.getByText('Your QR Codes');
    expect(heading).toBeInTheDocument();
    
    // Check if the sort buttons are present
    const dateDescButton = screen.getByText('Date Desc');
    const dateAscButton = screen.getByText('Date Asc');
    const descriptionButton = screen.getByText('Description');
    
    expect(dateDescButton).toBeInTheDocument();
    expect(dateAscButton).toBeInTheDocument();
    expect(descriptionButton).toBeInTheDocument();
  });
});