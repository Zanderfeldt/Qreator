import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import QRCode from './QRCode';

const mockUrl = 'https://example.com/qr-code.png';
const mockDescription = 'QR Code Description';

test('renders QRCode component with default props', () => {
  render(<QRCode url={mockUrl} />);
  const qrCodeContainer = screen.getByTestId('qr-code-container');
  const qrCodeImage = screen.getByAltText('qrCode');
  const description = screen.queryByText(mockDescription); // description should not be visible by default
  expect(qrCodeContainer).toBeInTheDocument();
  expect(qrCodeImage).toBeInTheDocument();
  expect(description).not.toBeInTheDocument();
});

test('renders QRCode component with description', () => {
  render(<QRCode url={mockUrl} description={mockDescription} />);
  const description = screen.getByText(mockDescription);
  expect(description).toBeInTheDocument();
});

test('displays download button when hovered', () => {
  render(<QRCode url={mockUrl} />);
  const qrCodeContainer = screen.getByTestId('qr-code-container');
  fireEvent.mouseEnter(qrCodeContainer);
  const visibleDownloadButton = screen.getByText('Download');
  expect(visibleDownloadButton).toBeInTheDocument();
  fireEvent.mouseLeave(qrCodeContainer);
  expect(visibleDownloadButton).not.toBeInTheDocument();
});


