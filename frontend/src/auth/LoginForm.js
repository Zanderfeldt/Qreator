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
  const [errors, setErrors] = useState(INITIAL_STATE)
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any of the fields are empty, and set the error messages
    const newErrors = { ...INITIAL_STATE };
    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);

    // If there are any errors, don't proceed with login
    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

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

    // Clear the error message when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  
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
          data-testid='Username'
          />
        {errors.username && <div className="error-message">{errors.username}</div>}
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          data-testid='Password'
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          <button>Submit</button>
      </form>

    </div>
  )
}

export default LoginForm;