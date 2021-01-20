const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const questions = [
  { text: 'Please state your address ?', type: 'InputText' },
  { text: 'How much is the monthy rate ?', type: 'InputText' },
  { text: 'Is this for sale ?', type: 'Boolean' },
];

app.use((req, res, next) => {
  console.log('request received', req.url);
  next();
});

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve('public/index.html'));
});

app.get('/questions/:index', (req, res) => {
  try {
    const { index } = req.params;
    let payload = {};
    if (questions.length >= parseInt(index)) {
      payload = { ...questions[index] };
    }
    return res.status(200).json(payload);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.post('/', (req, res) => {
  return res.status(200).json('Done.');
});

app.use('/', express.static(path.resolve('public')));
app.listen(PORT, () => console.log('server is running'));
