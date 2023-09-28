import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './SignUpForm.css';

function SignUpForm({register}) {

  const INITIAL_STATE = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  }

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showAlert, setShowAlert] = useState('');
  const history = useHistory();

  const handleSubmit = async e => {
    e.preventDefault();
    let result = await register(formData);
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
    <div className='signup-card'>
      <h2>Sign Up</h2>
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
          <input
          id='firstName'
          name='firstName'
          placeholder='First Name'
          value={formData.firstName}
          onChange={handleChange}
          />
          <input
          id='lastName'
          name='lastName'
          placeholder='Last Name'
          value={formData.lastName}
          onChange={handleChange}
          />
          <input
          id='email'
          name='email'
          placeholder='E-mail'
          value={formData.email}
          onChange={handleChange}
          />
          <button disabled={!isFormValid}>Submit</button>
      </form>

    </div>
  )
}

export default SignUpForm;