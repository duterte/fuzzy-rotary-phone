const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve('public/index.html'));
});
app.use('/', express.static(path.resolve('public')));

app.listen(PORT, () => console.log('server is running'));
