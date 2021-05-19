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
        this.inputs[range.name] = {
            get value() {
                return parseFloat(range.value);
            }
        };
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