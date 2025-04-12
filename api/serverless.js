// Import the Express app
import app from './index.js';

// Define a handler function for Vercel serverless functions
export default async function handler(req, res) {
  // Proxy the request to our Express app
  await new Promise((resolve, reject) => {
    const mockRes = {
      statusCode: null,
      body: null,
      headers: {},
      status(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json(data) {
        res.status(this.statusCode || 200).json(data);
        resolve();
        return this;
      },
      send(data) {
        res.status(this.statusCode || 200).send(data);
        resolve();
        return this;
      },
      end() {
        res.status(this.statusCode || 200).end();
        resolve();
        return this;
      },
      setHeader(key, value) {
        this.headers[key] = value;
        res.setHeader(key, value);
        return this;
      }
    };

    // Call our Express app with the request
    try {
      app(req, mockRes);
    } catch (error) {
      reject(error);
    }
  });
}