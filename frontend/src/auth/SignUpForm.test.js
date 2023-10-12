import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpForm from './SignUpForm';

describe('SignUpForm', () => {
  // Smoke Test
  it('should render without errors', () => {
    render(<SignUpForm register={() => {}} />);
  });

  // Snapshot Test
  it('should match the snapshot', () => {
    const { asFragment } = render(<SignUpForm register={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
