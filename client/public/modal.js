class Modal {
    constructor() {
        this.modal = document.getElementById('confirmModal');
        this.text = document.getElementById('modalText');
        const ok = document.getElementById('modalOk');
        const cancel = document.getElementById('modalCancel');
        const close = this.modal.getElementsByClassName('close').item(0);
        close.onclick = () => {
            this.modal.style.display = 'none';
        };
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
            }
        };
        ok.onclick = () => {
            this.modal.style.display = 'none';
            if (this.okFn)
                this.okFn();
        };
        cancel.onclick = () => {
            this.modal.style.display = 'none';
            if (this.cancelFn)
                this.cancelFn();
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
