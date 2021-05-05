class Loading {
    element: HTMLDivElement;

    constructor() {
        const app = document.getElementById('app');
        this.element = document.createElement('div');
        this.element.id = 'loading';
        this.element.textContent = 'Loading';
        app?.appendChild(this.element);
    }

    getElement(): HTMLDivElement {
        return this.element;
    }
}

export default Loading;
