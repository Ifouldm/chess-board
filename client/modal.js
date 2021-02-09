class Modal {
    constructor() {
        this.modal = document.getElementById('confirmModal');
        this.text = document.getElementById('modalText');
        this.ok = document.getElementById('modalOk');
        this.cancel = document.getElementById('modalCancel');
        [this.close] = this.modal.getElementsByClassName('close');
        this.close.onclick = () => {
            this.modal.style.display = 'none';
        };
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
            }
        };
        this.ok.onclick = () => {
            this.modal.style.display = 'none';
            if (this.okFn) this.okFn();
        };
        this.cancel.onclick = () => {
            this.modal.style.display = 'none';
            if (this.cancelFn) this.cancelFn();
        };
    }

    show(dialogText, okFn, cancelFn) {
        this.text.textContent = dialogText;
        this.modal.style.display = 'block';
        this.okFn = okFn;
        this.cancelFn = cancelFn;
    }
}

export default Modal;
