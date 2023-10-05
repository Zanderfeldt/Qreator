# QReator
This website provides users with a streamlined and easy-to-use method for customizing, saving, downloading, and editing their own QR Codes. The content of the QR Codes can be any URL or string. Users also have the ability to overlay an image of their choice, making this a perfect tool for personal branding/marketing.

## The Tech Stack:
- JavaScript
- React.js
- Node.js
- HTML
- CSS
- PostgreSQL

## API Endpoints:

QR Code Generation: 
https://quickchart.io/qr?

Single endpoint relies on series of query string parameters to determine product.

### Parameters:

- Text: Content of the QR Code (can be a URL or any other string)
- Margin: Whitespace around the QR Code
- Size: Dimensions of QR Code
- Dark: Hex Color code for the (normally) black QR grid cells
- Light: Hex Color code for the (normally) white QR grid cells
- Center Image URL: URL of image to show in center (URL Encoded)
- Center Image Size Ratio: How much space the image takes up
