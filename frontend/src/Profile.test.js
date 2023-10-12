import React from 'react';
import { render } from '@testing-library/react';
import Profile from './Profile';
import UserContext from './auth/UserContext';
import { MemoryRouter } from 'react-router-dom'; 

const contextValue = {
  currUser: {
    firstName: 'test',
    lastName: 'test',
    username: 'test',
    email: 'test@test.com'
  }
};

//smoke test
test('renders Profile component without errors', () => {
  render(
  <MemoryRouter>
    <UserContext.Provider value={contextValue}>
      <Profile />
    </UserContext.Provider>
  </MemoryRouter>
  );
});

//snapshot
test('matches snapshot', () => {
  const { asFragment } = render(
  <MemoryRouter>
    <UserContext.Provider value={contextValue}>
      <Profile />
    </UserContext.Provider>
  </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

//test that input fields are pre-populated with currUser info
test('populates input fields with currUser values', () => {
  const { getByLabelText } = render(
    <MemoryRouter>
      <UserContext.Provider value={contextValue}>
        <Profile />
      </UserContext.Provider>
    </MemoryRouter>
  );

  // Get input fields by their associated label text
  const firstNameInput = getByLabelText('- First Name -');
  const lastNameInput = getByLabelText('- Last Name -');
  const usernameInput = getByLabelText('- Username -');
  const emailInput = getByLabelText('- E-mail -');

  // Assert that input values match the corresponding contextValue properties
  expect(firstNameInput).toHaveValue(contextValue.currUser.firstName);
  expect(lastNameInput).toHaveValue(contextValue.currUser.lastName);
  expect(usernameInput).toHaveValue(contextValue.currUser.username);
  expect(emailInput).toHaveValue(contextValue.currUser.email);
});