class Modal {
    modal: HTMLElement;

    text: HTMLElement;

    okFn?: () => void;

    cancelFn?: () => void;

    template = `<div class="modal-content">
            <span class="close">&times;</span>
            <p id="modalText">Some text in the Modal..</p>
            <button id="modalOk" class="button">Ok</button><button id="modalCancel" class="button">Cancel</button>
        </div>`;

    constructor() {
        this.modal = document.getElementById('confirmModal') as HTMLDivElement;
        this.modal.innerHTML = this.template;
        this.text = document.getElementById('modalText') as HTMLElement;
        const ok = document.getElementById('modalOk') as HTMLButtonElement;
        const cancel = document.getElementById('modalCancel') as HTMLButtonElement;
        const close = this.modal.getElementsByClassName('close').item(0) as HTMLSpanElement;
        close.onclick = () => {
            this.modal.style.display = 'none';
            if (this.cancelFn) this.cancelFn();
        };
        window.onclick = (event: Event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
                if (this.cancelFn) this.cancelFn();
            }
        };
        ok.onclick = () => {
            this.modal.style.display = 'none';
            if (this.okFn) this.okFn();
        };
        cancel.onclick = () => {
            this.modal.style.display = 'none';
            if (this.cancelFn) this.cancelFn();
        };
    }

    show(dialogText: string, okFn?: () => boolean|void, cancelFn?: () => boolean|void): void {
        this.text.textContent = dialogText;
        this.modal.style.display = 'block';
        this.okFn = okFn;
        this.cancelFn = cancelFn;
    }
}
export default Modal;
