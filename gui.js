class GUI {
    constructor(asidePanel) {
        this.inputs = {};
        const inputDivs = asidePanel.getElementsByClassName("inputsHolder");
        for(let inputDiv of inputDivs) {
            this.addInput(inputDiv);
        }
    }

    addInput(inputDiv) {
        const range = inputDiv.children[0];
        const text = inputDiv.children[1];
        const value = {
            get: () => parseFloat(range.value)
        };
        Object.defineProperty(this.inputs, range.name, value);
        this.automateInput(range, text);
    }

    automateInput(range, text) {
        text.value = range.value;
        range.oninput = () => {
            text.value = range.value;
        };
        text.oninput = () => {
            if(isStringNumeric(text.value)) {
                range.value = text.value;
            }
        };
    }
}