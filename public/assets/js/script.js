const store = [];
const promptPos = {
  x: undefined,
  y: undefined,
};

window.addEventListener('load', () => {
  getRequest(0);
});

class Layout {
  constructor({ headingText = 'prompt' }) {
    this.headingText = headingText;
  }

  border() {
    const element = document.createElement('div');
    element.id = 'prompt';
    if (promptPos.x && promptPos.y) {
      element.style.left = `${promptPos.x}px`;
      element.style.top = `${promptPos.y}px`;
    }

    return element;
  }

  heading() {
    const element = document.createElement('h4');
    element.innerText = this.headingText;

    return element;
  }

  continueBtn() {
    const element = document.createElement('span');
    element.className = 'page-button continue-button';
    element.innerText = 'CONTINUE';
    element.addEventListener('click', clickHandler);

    function clickHandler() {
      const answers = document.querySelectorAll('.answer');
      let countAnswers = 0;
      let countQuestions = 0;
      answers.forEach(answer => {
        countQuestions++;
        if (answer.value) {
          countAnswers++;
        }
      });

      if (countQuestions !== countAnswers) return;

      const prompt = document.querySelector('#prompt');
      prompt.classList.add('hide');
      answers.forEach(answer => {
        if (answer.value) {
          store[store.length - 1].answers.push({
            question: store[store.length - 1].input[0].question,
            answer: answer,
          });
          const str = answer.value.toString();
          store[store.length - 1].output = store[
            store.length - 1
          ].output.replace('@:input:', `<span>${str}</span>`);
        }
      });

      const editor = document.querySelector('#editor');
      const div = document.createElement('div');
      div.className = 'data';
      div.innerHTML = `${store[store.length - 1].output}`;
      editor.append(div);
      setTimeout(() => {
        document.body.removeChild(prompt);
        getRequest(store.length);
      }, 900);
    }

    return element;
  }
}

class TextType {
  constructor(question) {
    this.question = question;
  }

  renderQuestion() {
    const element = document.createElement('p');
    element.innerText = this.question;
    return element;
  }

  renderInput() {
    const element = document.createElement('input');
    element.type = 'text';
    element.className = 'answer';
    return element;
  }

  render() {
    const element = document.createElement('div');
    element.className = 'question';
    element.append(this.renderQuestion());
    element.append(this.renderInput());
    return element;
  }
}

class BooleanType {
  constructor(question) {
    this.question = question;
  }
  renderQuestion() {
    const element = document.createElement('p');
    element.innerText = this.question;
    return element;
  }
  renderBoolean() {
    const element = document.createElement('div');
    const yesBtn = document.createElement('span');
    const noBtn = document.createElement('span');
    const input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'checkbox';
    input.id = 'answer';
    yesBtn.className = 'page-button boolean-button';
    noBtn.className = 'page-button boolean-button';

    yesBtn.innerText = 'YES';
    noBtn.innerText = 'NO';

    element.append(noBtn);
    element.append(yesBtn);
    element.append(input);
    return element;
  }

  render() {
    const element = document.createElement('div');
    element.className = 'question';
    element.append(this.renderQuestion());
    element.append(this.renderBoolean());
    return element;
  }
}

// Inversion of Control

class WinPrompt extends Layout {
  constructor({ headingText, width, input }) {
    super({ headingText, width });
    this.input = input;
  }

  render() {
    const div = document.createElement('div');
    div.className = 'question-wrapper';

    for (const entry of this.input) {
      let prompt;
      if (entry.type.toLowerCase() === 'texttype') {
        prompt = new TextType(entry.question);
      } else if (entry.type.toLowerCase() === 'booleantype') {
        prompt = new BooleanType(entry.question);
      }
      div.append(prompt.render());
    }

    const border = this.border();
    const heading = this.heading();
    const continueBtn = this.continueBtn();

    border.append(heading);
    border.append(div);
    border.append(continueBtn);
    return border;
  }
}

function getRequest(param) {
  const index = param;
  fetch(`/questions/${index}`)
    .then(res => {
      if (res.status > 399) {
        throw new Error(`Network Request failed status code ${res.status}`);
      }
      return res.json();
    })
    .then(json => {
      const { input } = json;
      if (input && input.length > 0) {
        const winPrompt = new WinPrompt({ input: input });
        store.push(json);
        document.body.append(winPrompt.render());
        moveWindow();
      }
    })
    .catch(err => console.log(err));
}

// Feature and Functionality ::::

// This feature allow user to drag and move the prompt
function moveWindow() {
  const element = document.querySelector('#prompt');
  let offset = [0, 0];
  let isDown = false;
  element.addEventListener(
    'mousedown',
    function (e) {
      isDown = true;
      offset = [
        e.currentTarget.offsetLeft - e.clientX,
        e.currentTarget.offsetTop - e.clientY,
      ];
    },
    true
  );

  element.addEventListener('mouseup', function () {
    isDown = false;
  });

  element.addEventListener('mousemove', function (e) {
    e.preventDefault();
    if (isDown) {
      element.style.left = `${e.clientX + offset[0]}px`;
      element.style.top = `${e.clientY + offset[1]}px`;
      promptPos['x'] = e.clientX + offset[0];
      promptPos['y'] = e.clientY + offset[1];
    }
  });
}
