import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders App component without crashing and contains <span> elements', () => {
  const { container } = render(<App />);

  // find all <span> elements within the container (These are the animated circles in background)
  const spans = container.querySelectorAll('span');

  // Assert that at least one <span> element is found
  expect(spans.length).toBeGreaterThan(0);
});