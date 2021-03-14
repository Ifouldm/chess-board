const chat = document.getElementById('chat') as HTMLDivElement;

const template = `<div class="row">
            Chat:
        </div>
        <div class="scrollableArea">
            <ul id="messageList" class="messageList">
            </ul>
        </div>
        <div class="row">
            <input type="text" id="message" class="textinput">
            <button class="sm-button" id="submitMessage">+</button>
        </div>`;

chat.innerHTML = template;

const messageTextfield = document.getElementById('message') as HTMLInputElement;
const messageList = document.getElementById('messageList') as HTMLUListElement;
const messageButton = document.getElementById('submitMessage') as HTMLButtonElement;

function sendMessage(event: Event) {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
        const colour = messageList.childElementCount % 2 === 0 ? 'white' : 'black';
        const messageElem = document.createElement('li');
        messageElem.className = `bubble ${colour}`;
        messageElem.textContent = messageTextfield.value;
        messageTextfield.value = '';
        messageList.appendChild(messageElem);
    }
}

if (messageButton) {
    messageButton.addEventListener('click', sendMessage);
}

if (messageTextfield && messageList) {
    messageTextfield.addEventListener('keyup', sendMessage);
}

const messageElem1 = document.createElement('li');
messageElem1.className = 'bubble white';
messageElem1.textContent = 'first message';
const messageElem2 = document.createElement('li');
messageElem2.className = 'bubble black';
messageElem2.textContent = 'second message';
const messageElem3 = document.createElement('li');
messageElem3.className = 'bubble black';
messageElem3.textContent = 'third message';
const messageElem4 = document.createElement('li');
messageElem4.className = 'bubble white';
messageElem4.textContent = 'fourth message';
messageList.append(messageElem1, messageElem2, messageElem3, messageElem4);
