import React, { useState, useEffect } from 'react';
import QreatorApi from './API';
import NavBar from './nav/NavBar';
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm';
import UserContext from './auth/UserContext';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";

import jwt_decode from 'jwt-decode';
export const TOKEN_STORAGE_ID = "qreator-token";

function Routes () {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currUser, setCurrUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.debug(
    "App",
    "infoLoaded=", isLoading,
    "currentUser=", currUser,
    "token=", token,
);

useEffect(() => {
  async function getUserInfo() {
  if (token) {
    try {
      let { userId } = jwt_decode(token);
      // put the token on the Api class so it can use it to call the API.
      QreatorApi.token = token;
      let user = await QreatorApi.getUser(userId);
      setCurrUser(user);
    } catch (e) {
      console.error(e);
      setCurrUser(null);
    }
  }
 setIsLoading(false);     
}
  setIsLoading(true);
  getUserInfo();
}, [token]);

const register = async (data) => {
  let token = await QreatorApi.register(data);
  setToken(token);    
}

const login = async (data) => {
  let token = await QreatorApi.login(data);
  setToken(token); 
}

const logout = () => {
  setToken(null);
  setCurrUser(null);
}

if (isLoading) {
  return <p>Loading &hellip;</p>
}

return (
  <BrowserRouter>
    <UserContext.Provider value={{currUser, setCurrUser}}>
    <NavBar logout={logout} />
    <Switch>
      {/* <Route exact path="/">
        <Home />
      </Route> */}
      <Route exact path="/login">
        <LoginForm login={login}/>
      </Route>
      <Route exact path="/signup">
        <SignUpForm register={register}/>
      </Route>
    <Redirect to="/" />
    </Switch>
    </UserContext.Provider>
  </BrowserRouter>
)
}

export default Routes;