import React from "react";
import NavBar from "./NavBar";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from '../auth/UserContext';

it("renders without crashing", () => {
  render(
  <MemoryRouter>
    <UserContext.Provider 
    value={{
      currUser: {
        id: 1,
        firstName: 'test',
        lastName: 'test',
        username: 'test',
        email: 'test@test.com'
      }
    }}>
      <NavBar />
    </UserContext.Provider>
  </MemoryRouter>)
})