class Modal {
    modal: HTMLElement;

    text: HTMLElement;

    okFn?: () => void;

    cancelFn?: () => void;

    constructor() {
        this.modal = document.getElementById('confirmModal') as HTMLDivElement;
        this.text = document.getElementById('modalText') as HTMLElement;
        const ok = document.getElementById('modalOk') as HTMLButtonElement;
        const cancel = document.getElementById('modalCancel') as HTMLButtonElement;
        const close = this.modal.getElementsByClassName('close').item(0) as HTMLSpanElement;
        close.onclick = () => {
            this.modal.style.display = 'none';
        };
        window.onclick = (event: Event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
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
