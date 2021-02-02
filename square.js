class Square {
    constructor(ref, isBlack) {
        this.element = document.createElement('div');
        this.ref = ref;
        this.isBlack = isBlack;
        this.element.classList.add('square', isBlack ? 'black' : 'white');
        this.element.textContent = ref;
    }
}

export default Square;