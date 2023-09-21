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
  const history = useHistory();

  const handleSubmit = e => {
    e.preventDefault();
    register(formData);
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
    <div className='signup-card'>
      <h2>Sign Up</h2>
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