const continueBtn = document.querySelector('#continue');
const answer = document.querySelector('#answer');
const dataList = document.querySelector('#data-list');
const winPrompt = document.querySelector('.prompt');
continueBtn.addEventListener('click', continueBtnClicked);

function continueBtnClicked() {
  if (answer.value) {
    const hardCodedText = `Hi my name is John Doe and I'm from <b>${answer.value}</b>`;
    const text = document.createElement('p');
    text.innerHTML = hardCodedText;
    dataList.appendChild(text);
    winPrompt.style.visibility = 'hidden';
  }
}
