const continueBtn = document.querySelector('#continue');

const store = [];

// let winPrompt = undefined;

function printStyle(htmlElement, cssObject) {
  for (const cssProperty in cssObject) {
    htmlElement.style[cssProperty] = cssObject[cssProperty];
  }
}

class MessagePrompt {
  constructor({ headingText = 'prompt' }) {
    this.headingText = headingText;
  }

  border() {
    const element = document.createElement('div');
    element.id = 'prompt';
    return element;
  }

  heading() {
    const element = document.createElement('h4');
    element.innerText = this.headingText;
    return element;
  }
}

window.addEventListener('load', () => {
  getRequest(0);
});

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
class WinPrompt extends MessagePrompt {
  constructor({ headingText, width, input }) {
    super({ headingText, width });
    this.input = input;
  }

  continueBtn() {
    const element = document.createElement('span');
    element.className = 'page-button continue-button';
    element.innerText = 'CONTINUE';
    element.addEventListener('click', clickHandler);

    function clickHandler(e) {
      const prompt = document.querySelector('#prompt');
      prompt.classList.add('hide');
      const answers = document.querySelectorAll('.answer');
      answers.forEach(answer => {
        store[store.length - 1].answers.push({
          question: store[store.length - 1].input[0].question,
          answer: answer,
        });
        const str = answer.value.toString();
        store[store.length - 1].output = store[store.length - 1].output.replace(
          '@:input:',
          `<span>${str}</span>`
        );
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

    border.append(heading);
    border.append(div);
    border.append(this.continueBtn());
    return border;
  }
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
    .then(json => {
      const { input, output } = json;
      if (input && input.length > 0) {
        const winPrompt = new WinPrompt({ input: input });
        store.push(json);
        console.log(store);
        document.body.append(winPrompt.render());
      }
    })
    .catch(err => console.log(err));
}
