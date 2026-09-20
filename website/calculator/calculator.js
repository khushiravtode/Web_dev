let currentInput = "0";
let previousInput = "";
let operator = null;

// Get display elements
const display = document.querySelector(".display");
const history = document.querySelector(".history");

// Update display
function updateDisplay() {
    display.textContent = currentInput;
}

// Add number
function appendNumber(number) {
    if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

// Add operator
function appendOperator(op) {
    if (currentInput === "") return;

    // If an operator already exists, calculate first
    if (operator !== null) {
        calculate();
    }

    previousInput = currentInput;
    operator = op;
    currentInput = "";

    history.textContent = previousInput + " " + operator;
}

// Add decimal
function appendDecimal() {
    if (currentInput === "") {
        currentInput = "0.";
    } 
    else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

// Calculate result
function calculate() {
    if (operator === null || currentInput === "") return;

    let num1 = parseFloat(previousInput);
    let num2 = parseFloat(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = num1 + num2;
            break;

        case "-":
            result = num1 - num2;
            break;

        case "*":
            result = num1 * num2;
            break;

        case "/":
            if (num2 === 0) {
                display.textContent = "Error";
                currentInput = "0";
                previousInput = "";
                operator = null;
                return;
            }
            result = num1 / num2;
            break;

        case "%":
            result = num1 % num2;
            break;
    }

    history.textContent = previousInput + " " + operator + " " + currentInput + " =";

    currentInput = result.toString();
    previousInput = "";
    operator = null;

    updateDisplay();
}

// Clear calculator
function clearDisplay() {
    currentInput = "0";
    previousInput = "";
    operator = null;

    history.textContent = "";
    updateDisplay();
}

// Delete last digit
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }

    updateDisplay();
}