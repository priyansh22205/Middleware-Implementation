// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// ========== Middleware 1: Logger ==========
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ========== Middleware 2: Authentication ==========
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing or incorrect"
    });
  }

  const token = authHeader.split(' ')[1];

  if (token === 'mysecrettoken') {
    next(); // token is valid
  } else {
    return res.status(403).json({
      message: "Invalid or missing token"
    });
  }
};

// ========== Public Route ==========
app.get('/public', (req, res) => {
  res.status(200).send("This is a public route. No authentication required.");
});

// ========== Protected Route ==========
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).send("You have accessed a protected route with a valid Bearer token!");
});

// ========== Start Server ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
