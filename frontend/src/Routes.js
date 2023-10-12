import React, { useState, useEffect } from 'react';
import QreatorApi from './API';
import NavBar from './nav/NavBar';
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm';
import NewCodeForm from './NewCodeForm';
import Home from './Home';
import Profile from './Profile';
import QrCodeList from './QRCodeList';
import QrCodeEdit from './QRCodeEdit';
import UserContext from './auth/UserContext';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import PrivateRoute from './nav/PrivateRoute';
import PublicRoute from './nav/PublicRoute';
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
  let result = await QreatorApi.register(data);
  if(result.success) {
    setToken(result.token);
  }
  return result;
}

const login = async (data) => {
  let result = await QreatorApi.login(data);
  if (result.success) {
    setToken(result.token);
  }
  return result; 
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
      <Route exact path="/">
        <Home />
      </Route>
      <PrivateRoute exact path="/create">
        <NewCodeForm />
      </PrivateRoute>
      <PrivateRoute exact path="/codes">
        <QrCodeList />
      </PrivateRoute>
      <PrivateRoute exact path="/edit/:codeId">
        <QrCodeEdit />
      </PrivateRoute>
      <PublicRoute exact path="/login">
        <LoginForm login={login}/>
      </PublicRoute>
      <PublicRoute exact path="/signup">
        <SignUpForm register={register}/>
      </PublicRoute>
      <PrivateRoute exact path="/profile">
        <Profile />
      </PrivateRoute>
    <Redirect to="/" />
    </Switch> 
    </UserContext.Provider>
  </BrowserRouter>
)
}

export default Routes;