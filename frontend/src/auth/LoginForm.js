import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginForm({login}) {

  const INITIAL_STATE = {
    username: '',
    password: '',
  }

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showAlert, setShowAlert] = useState('');
  const history = useHistory();

  const handleSubmit = async e => {
    e.preventDefault();
    let result = await login(formData);
    if (result.success) {
      setFormData(INITIAL_STATE);
      history.push('/');
    } else {
      setShowAlert(result.message);
    }
    
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
      <small style={{color: 'red'}}>{showAlert}</small>
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