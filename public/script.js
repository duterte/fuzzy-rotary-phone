const continueBtn = document.querySelector('#continue');
// const winPrompt = document.querySelector('.prompt');

const formData = new FormData();
let winPrompt = undefined;

formData.counter = 0;
formData.addData = function (value, cb) {
  this.append(`data${this.counter}`, value);
  this.counter++;
  const element = document.querySelector('#prompt');
  setTimeout(() => {
    document.body.removeChild(element);
    getRequest(this.counter);
  }, 900);
};

class MessagePrompt {
  constructor({ headingText = 'prompt', width = 258 }) {
    this.headingText = headingText;
    this.width = `${width}px`;
  }

  border() {
    const element = document.createElement('div');
    element.id = 'prompt';
    element.className = 'hide';
    const style = {
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      width: this.width,
      backgroundColor: 'white',
      boxSizing: 'border-box',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
      color: 'black',
    };

    this.printStyle(element, style);
    return element;
  }

  heading() {
    const element = document.createElement('h4');
    element.innerText = this.headingText;
    const style = {
      alignSelf: 'start',
      gridRow: '1/2',
      width: '100%',
      backgroundColor: 'green',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '8px 0',
    };

    this.printStyle(element, style);

    return element;
  }

  printStyle(htmlElement, cssObject) {
    for (const cssProperty in cssObject) {
      htmlElement.style[cssProperty] = cssObject[cssProperty];
    }
  }
}

class TextType extends MessagePrompt {
  constructor({ headingText, questionText, width }) {
    super({ headingText, width });
    this.questionText = questionText;
    this.value = '';
  }

  prompt() {
    const element = document.createElement('div');
    const style = {
      display: 'grid',
      gridRow: '2/3',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: '0 1.5em',
      marginTop: '3em',
    };

    this.printStyle(element, style);

    element.append(this.question());
    element.append(this.userInput());
    return element;
  }

  question() {
    const element = document.createElement('p');
    element.innerText = this.questionText;
    const style = {
      fontWeight: 'bold',
      textAligin: 'justify',
    };
    this.printStyle(element, style);

    return element;
  }

  userInput() {
    const element = document.createElement('input');
    // element.id = 'userinput'
    element.type = 'text';
    const style = {
      width: '100%',
      height: '32px',
    };

    this.printStyle(element, style);

    element.oninput = e => {
      this.value = e.target.value;
      console.log(this.value);
    };
    return element;
  }

  continueBtn() {
    const element = document.createElement('span');
    const border = this.border();

    element.className = 'page-button';
    element.innerText = 'CONTINUE';
    const style = {
      justifySelf: 'end',
      alignSelf: 'end',
      gridRow: '3/4',
      marginTop: '6em',
      marginRight: '.5em',
      marginBottom: '.5em',
      backgroundColor: 'green',
      padding: '8px 16px',
      color: 'white',
    };
    this.printStyle(element, style);

    element.onclick = () => {
      const prompt = document.querySelector('#prompt');
      if (this.value) {
        prompt.classList.add('hide');
        formData.addData(this.value);
      }
    };

    return element;
  }

  render() {
    const border = this.border();
    const heading = this.heading();
    const prompt = this.prompt();
    const continueBtn = this.continueBtn();
    border.append(heading);
    border.append(prompt);
    border.append(continueBtn);
    return border;
  }
}

class BooleanType extends MessagePrompt {
  constructor({ headingText, questionText, width }) {
    super({ headingText, width });
    this.questionText = questionText;
  }

  prompt() {
    const element = document.createElement('div');
    const style = {
      display: 'grid',
      gridRow: '2/3',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: '3.8em 1.5em 0',
    };

    this.printStyle(element, style);

    element.append(this.question());
    element.append(this.wrapper());
    return element;
  }

  question() {
    const element = document.createElement('p');
    element.innerText = this.questionText;
    const style = {
      fontWeight: 'bold',
      textAligin: 'justify',
    };
    this.printStyle(element, style);

    return element;
  }

  yesBtn() {
    const element = document.createElement('span');
    element.classList = 'page-button';
    element.innerText = 'YES';

    const style = {
      padding: '9px 19px',
      backgroundColor: 'green',
      color: 'white',
    };

    this.printStyle(element, style);
    return element;
  }

  noBtn() {
    const element = document.createElement('span');
    element.classList = 'page-button';
    element.innerText = 'NO';

    const style = {
      padding: '9px 19px',
      backgroundColor: 'green',
      color: 'white',
    };

    this.printStyle(element, style);
    return element;
  }

  wrapper() {
    const element = document.createElement('div');
    const style = {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '1.7em',
      paddingTop: '5em',
    };

    const noBtn = this.noBtn();
    const yesBtn = this.yesBtn();
    this.printStyle(element, style);

    element.append(noBtn);
    element.append(yesBtn);
    return element;
  }

  render() {
    const border = this.border();
    const heading = this.heading();
    const prompt = this.prompt();
    border.append(heading);
    border.append(prompt);
    return border;
  }
}

class Editor {
  constructor() {
    //
  }
  border() {
    const element = document.createElement('div');
    const id = 'editor';
    const style = {
      padding: '0 5em',
    };

    return element;
  }

  printStyle(htmlElement, cssObject) {
    for (const cssProperty in cssObject) {
      htmlElement.style[cssProperty] = cssObject[cssProperty];
    }
  }
}

window.addEventListener('load', () => getRequest(0));

function getRequest(param) {
  const index = param;
  fetch(`http://localhost:3000/questions/${index}`)
    .then(res => {
      if (res.status > 399) {
        throw new Error(`Network Request failed status code ${res.status}`);
      }
      return res.json();
    })
    .then(({ type, text }) => {
      if (text) {
        if (type.toLowerCase() === 'texttype') {
          winPrompt = new TextType({ questionText: text });
        } else if (type.toLowerCase() === 'booleantype') {
          winPrompt = new BooleanType({ questionText: text });
        }
        console.log(winPrompt);
        document.body.append(winPrompt.render());
        setTimeout(() => {
          document.querySelector('#prompt').classList.remove('hide');
        }, 500);
      }
    })
    .catch(err => console.log(err));
}
