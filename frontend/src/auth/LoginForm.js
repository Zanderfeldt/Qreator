import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginForm({login}) {

  const INITIAL_STATE = {
    username: '',
    password: '',
  }

  const [formData, setFormData] = useState(INITIAL_STATE);
  const history = useHistory();

  const handleSubmit = e => {
    e.preventDefault();
    login(formData);
    setFormData(INITIAL_STATE);
    history.push('/');
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }));
  };

  const isFormValid = Object.values(formData).every(Boolean);

  return (
    <div className='login-card'>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input
          id='username'
          name='username'
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
          />
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          />
          <button disabled={!isFormValid}>Submit</button>
      </form>

    </div>
  )
}

export default LoginForm;