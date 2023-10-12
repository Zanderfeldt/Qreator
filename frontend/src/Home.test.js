import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import UserContext from './auth/UserContext';
import { MemoryRouter, BrowserRouter } from 'react-router-dom'; 

//smoke test
test("renders without crashing", function() {

  const contextValue = {
    currUser: {
      firstName: 'test',
      lastName: 'test',
      username: 'test',
      email: 'test@test.com'
    }
  };
  const { container } = render(
    <MemoryRouter>
    <UserContext.Provider value={contextValue}>
      <Home />
    </UserContext.Provider>
    </MemoryRouter>
  );
  expect(container).toBeDefined(); //Verify Home component renders correctly
  expect(screen.getByText('Design your own QR Codes in one, convenient place.')).toBeInTheDocument(); //Verify Welcome message appears on Home page

    //Verify 'Start Qreating' button on Home Page
  const createButton = screen.getByText('Start Qreating'); 
  expect(createButton).toBeInTheDocument();

});


//snapshot test
test('Home component matches snapshot', () => {
  const mockUser = { currUser: 'Test User' }; // Define a mock user

  const { container } = render(
    <UserContext.Provider value={mockUser}>
      <BrowserRouter>
       <Home />
      </BrowserRouter>
    </UserContext.Provider>
  );

  expect(container).toMatchSnapshot();
});