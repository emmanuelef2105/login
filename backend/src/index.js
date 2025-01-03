const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');

app.use(express.json()); 
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
