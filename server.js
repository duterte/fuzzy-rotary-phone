const express = require('express');
const path = require('path');
const { stringify } = require('querystring');

const app = express();
const PORT = process.env.PORT || 3000;

// @:input: - represent users input needs to be filled;

// Data Structure

// {
//   input: [
//     {
//       question: String,
//       type: String,
//     },
//   ];
//   output: String;
//   answers: []
// }

const questions = [
  {
    input: [
      {
        question: 'Agreements Date:',
        type: 'TextType',
      },
    ],
    output: `THIS AMENDED AND RESTATED REAL ESTATE LEASE (this “Lease”) is dated <b>@:input:</b> and entered into between the following:`,
    answers: [],
  },
  //
  {
    input: [
      {
        question: 'Lessers Company Name:',
        type: 'TextType',
      },
      {
        question: 'Lesser Address:',
        type: 'TextType',
      },
      {
        question: 'Landlords Company Name: ',
        type: 'TextType',
      },
      {
        question: 'Landlords Address: ',
        type: 'TextType',
      },
    ],
    output: `
    <div style="display: grid;
    grid-template-columns: 1fr 1fr; 
    text-indent: 0;
    grid-column-gap: 4em;
    ">
      <div style="padding-right: 5em">
        <p><b>@:input:</b></p>
        <p>@:input:</p>
        <br/>
        <p>Country of Jurisdiction:</p>
        <p>United States of America</p>
        <br/>
        <p>- hereinafter referred to as “Tenant” -</p>
      </div>

      <div style="padding-right: 5em">
        <p><b>@:input:</b></p>
        <p>@:input:</p>
        <br/>
        <p>Country of Jurisdiction:</p>
        <p>United States of America</p>
        <br/>
        <p>- hereinafter referred to as “Landlord”</p>
      </div>
    </div>
    `,
    answers: [],
  },
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
