import { message } from './types.js';

class Chat {
    chat: HTMLDivElement;

    messageTextfield: HTMLInputElement;

    messageList: HTMLUListElement;

    messageButton: HTMLButtonElement;

    constructor(private callback: (messageOut: string) => void) {
        const app = document.getElementById('app');
        this.chat = document.createElement('div');
        this.chat.id = 'chat';
        app?.appendChild(this.chat);
        const row = document.createElement('div');
        row.classList.add('row');
        row.textContent = 'Chat:';
        this.chat.appendChild(row);
        const scrollableArea = document.createElement('div');
        scrollableArea.classList.add('scrollableArea');
        this.chat.appendChild(scrollableArea);
        this.messageList = document.createElement('ul');
        this.messageList.classList.add('messageList');
        this.messageList.id = 'messageList';
        scrollableArea.appendChild(this.messageList);
        const row2 = document.createElement('div');
        row2.classList.add('row');
        row2.textContent = 'Chat:';
        this.chat.appendChild(row2);
        this.messageTextfield = document.createElement('input');
        this.messageTextfield.classList.add('textinput');
        this.messageTextfield.id = 'message';
        this.messageTextfield.type = 'text';
        row2.appendChild(this.messageTextfield);
        this.messageButton = document.createElement('button');
        this.messageButton.classList.add('button', 'sm');
        this.messageButton.id = 'submitMessage';
        this.messageButton.textContent = '+';
        row2.appendChild(this.messageButton);

        this.messageButton.addEventListener('click', () => {
            this.callback(this.messageTextfield.value);
            this.messageTextfield.value = '';
        });
        this.messageTextfield.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.callback(this.messageTextfield.value);
                this.messageTextfield.value = '';
            }
        });
    }

    // const template = `<div class="row">
    //     Chat:
    // </div>
    // <div class="scrollableArea">
    //     <ul id="messageList" class="messageList">
    //     </ul>
    // </div>
    // <div class="row">
    //     <input type="text" id="message" class="textinput">
    //     <button class="button sm" id="submitMessage">+</button>
    // </div>`;

    // this.chat.innerHTML = template;

    // this.messageTextfield = document.getElementById(
    //     'message'
    // ) as HTMLInputElement;
    // this.messageList = document.getElementById(
    //     'messageList'
    // ) as HTMLUListElement;
    // this.messageButton = document.getElementById(
    //     'submitMessage'
    // ) as HTMLButtonElement;

    update(messages: message[]): void {
        console.log(messages);

        const messageElements = messages.map((msg) => {
            const messageElem = document.createElement('li');
            messageElem.className =
                msg.playerColour === 'w' ? 'bubble white' : 'bubble black';
            messageElem.textContent = msg.message;
            return messageElem;
        });
        this.messageList.append(...messageElements);
    }
}
export default Chat;
