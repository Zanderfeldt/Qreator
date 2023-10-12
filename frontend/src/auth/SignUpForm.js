import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './SignUpForm.css';

function SignUpForm({ register }) {
  const INITIAL_STATE = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showAlert, setShowAlert] = useState('');
  const [errors, setErrors] = useState(INITIAL_STATE);
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
    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
    }
    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
    }
    if (formData.email.trim() === '') {
      newErrors.email = 'E-mail is required';
    }
    setErrors(newErrors);

    // If errors, don't proceed with registration
    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

    let result = await register(formData);
    if (result.success) {
      setFormData(INITIAL_STATE);
      history.push('/');
    } else {
      setShowAlert(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));

    // Clear the error message when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const isFormValid = Object.values(errors).every((error) => error === '');

  return (
    <div className="signup-card">
      <h2>Sign Up</h2>
      <small style={{ color: 'red' }}>{showAlert}</small>
      <form onSubmit={handleSubmit}>
        <input
          id="username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <div className="error-message">{errors.username}</div>}
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
        <input
          id="firstName"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        <input
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        <input
          id="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
        <button disabled={!isFormValid}>Submit</button>
      </form>
    </div>
  );
}

export default SignUpForm;
