const continueBtn = document.querySelector('#continue');
const winPrompt = document.querySelector('.prompt');

const formData = new FormData();

formData.counter = 0;
formData.addData = function (value, cb) {
  console.log('counter:', this.counter);
  this.append(`data${this.counter}`, value);
  this.counter++;
  cb();
};

continueBtn.addEventListener('click', continueBtnClicked);
window.addEventListener('load', bodyLoad);

function renderNewData(answer) {
  const dataList = document.querySelector('#data-list');
  const hardCodedText = `Answer: <b>${answer}</b>`;
  const text = document.createElement('p');
  text.innerHTML = hardCodedText;
  dataList.appendChild(text);
}

function continueBtnClicked() {
  const answer = document.querySelector('.prompt .answer');
  if (answer.value) {
    printData(answer.value);
  }
}

function printData(value) {
  renderNewData(value);
  hidePrompt();
  formData.addData(value, () => {
    console.log('formData Counter:', formData.counter);
    getRequest(formData.counter);
  });
}

function showPrompt() {
  winPrompt.classList.remove('hide');
  winPrompt.classList.add('show');
}

function hidePrompt() {
  winPrompt.classList.remove('show');
  winPrompt.classList.add('hide');
}

function renderPrompt(object) {
  const { question, type, index } = object;
  const questionText = document.querySelector('#question-text');
  const questiontype = document.querySelector('#question-type');
  questionText.innerHTML = `${question}`;
  questiontype.innerHTML = '';
  if (type.toLowerCase() === 'inputtext') {
    continueBtn.classList.remove('hide');
    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.className = 'answer';
    inputText.id = `data${index}`;
    inputText.style = `width: 100%; height: 31px;`;
    questiontype.append(inputText);
  } else if (type.toLowerCase() === 'boolean') {
    continueBtn.classList.add('hide');
    const groupElement = document.createElement('div');
    const yesButton = document.createElement('span');
    groupElement.style = `display: flex; justify-content: space-between; width:197px;`;
    yesButton.className = 'page-button';
    yesButton.id = 'yes';
    yesButton.innerText = 'YES';
    const noButton = document.createElement('span');
    noButton.className = 'page-button';
    noButton.id = 'no';
    noButton.innerText = 'NO';
    yesButton.addEventListener('click', () => printData('yes'));
    noButton.addEventListener('click', () => printData('no'));
    groupElement.append(noButton);
    groupElement.append(yesButton);
    questiontype.append(groupElement);
  }
  showPrompt();
}

function getRequest(param) {
  const index = param;
  fetch(`http://localhost:3000/questions/${index}`)
    .then(res => {
      if (res.status > 399) {
        throw new Error(`Network Request failed status code ${res.status}`);
      }
      return res.json();
    })
    .then(question => {
      if (question.text) {
        const payload = {
          question: question.text,
          type: question.type,
          index: index,
        };
        renderPrompt(payload);
      }
    })
    .catch(err => console.log(err));
}

function bodyLoad() {
  getRequest(1);
}
