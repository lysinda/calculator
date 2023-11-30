const history = document.getElementById("history");
const calculation = document.getElementById("calculation");

const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const dotButton = document.getElementById("dot-button");
const equalsButton = document.getElementById("equals-button");

const numButtons = document.querySelectorAll(".num-button");
const operatorButtons = document.querySelectorAll(".operator-button");

let calcLength = 1;
const maxLength = 24;

let newNum = "";
let nums = [];
let ops = [];
let result = 0;

numButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Only add to the calculation if the length does not exceed the max capacity of the display
        if (calcLength < maxLength) {
            newNum += button.textContent;
            appendNumber(button.textContent);
        }
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Only add to the calculation if the length does not exceed the max capacity of the display
        if (calcLength + 2 < maxLength) {
            appendOperator(button.textContent);
        }
    })
});

deleteButton.addEventListener("click", () => {
    // Delete an operator
    if (calculation.textContent.charAt(calculation.textContent.length - 1) == " ") {
        calculation.textContent = calculation.textContent.slice(0, calculation.textContent.length - 3);
        calcLength -= 3;
        ops.pop();
        newNum = nums.pop();
        console.log(newNum);
        console.log(nums);
    }
    // Delete the last number if more than one character exists
    else if (calcLength > 1) {
        calculation.textContent = calculation.textContent.slice(0, -1);
        calcLength--;
    }
    // If only one character exists and it's not 0, set it to 0
    else if (calculation.textContent != 0) {
        calculation.textContent = "0";
    }
});

clearButton.addEventListener("click", () => {
    clear();
});

dotButton.addEventListener("click", () => {
    // Add a dot only if the new number doesn't already contain one
    if (!newNum.includes(".")) {
        newNum += ".";
        calculation.textContent += ".";
        calcLength++;
    }
});

equalsButton.addEventListener("click", () => {
    operate();
});

function appendNumber(number) {
    // Replace the initial 0
    if (calculation.textContent == 0) {
        calculation.textContent = number;
    }
    else {
        calculation.textContent += number;
        calcLength++;
    }
}

function appendOperator(operator) {
    // Only append an operator if the last entered character was not an operator
    if (calculation.textContent.charAt(calculation.textContent.length - 1) != " ") {
        // If a dot was entered before the operator without a number behind it, remove the dot
        if (newNum.charAt(newNum.length - 1) == ".") {
            newNum = newNum.slice(0, -1);
            calculation.textContent = calculation.textContent.slice(0, -1);
            calcLength--;
        }
        nums.push(Number(newNum));
        newNum = "";
        ops.push(operator);
        calculation.textContent += " " + operator + " ";
        calcLength += 3;
    }
}

function operate() {
    // If the last entered character is an operator and not a number, remove this operator
    if (calculation.textContent.charAt(calculation.textContent.length - 1) === " ") {
        ops.splice(-1);
        // Also remove from calculation so that it's not added to the history later
        calculation.textContent = calculation.textContent.slice(0, -3);
    }

    // If the last entered character is a number, append the full newNum to the nums array
    else {
        nums.push(Number(newNum));
        newNum = "";
    }

    // Check for division and multiplication first because of mathematical order of operations
    for (let i = 0; i < ops.length; i++) {
        if (ops[i] === "÷" || ops[i] === "×") {
            let num1 = nums.splice(i, 1);
            let num2 = nums.splice(i, 1);
            if (ops[i] === "÷") {
                if (num2 == 0) {
                    alert("Can't devide by 0");
                    clear();
                    return;
                }
                else {
                    result = num1 / num2;
                }
            }
            else {
                console.log(typeof (num1) + " " + typeof (num2));
                result = num1 * num2;
            }

            // Insert the result where the numbers were
            nums.splice(i, 0, result);
            // Remove the operator from the list so that the indices of the nums and ops arrays stay aligned
            ops.splice(i, 1);
            // Lower the index due to shortened array length
            i--;
        }
    }

    // Go through additions and substractions after all divisions and multiplications are completed
    for (let i = 0; i < ops.length; i++) {
        console.log(nums);
        let num1 = nums.splice(i, 1);
        console.log(nums);
        let num2 = nums.splice(i, 1);
        console.log(num1 + " " + num2);
        if (ops[i] === "–") {
            result = num1 - num2;
        }
        else {
            result = Number(num1) + Number(num2);
        }

        nums.splice(i, 0, result);
        ops.splice(i, 1);
        i--;
    }

    // Round the result to 4 decimal points
    result = Math.round(result * 10000) / 10000;

    // Use the result (last in nums) as the newNum and remove from nums
    // This allows to continue the calculation with the result
    newNum = nums.pop();

    // Move the calculation to the history and display the result
    history.textContent = calculation.textContent;
    history.textContent += " = " + result;
    calculation.textContent = result;
    calcLength = calculation.textContent.length;
}

// Clear the display and reset the variables
function clear() {
    calcLength = 1;
    newNum = "";
    nums = [];
    ops = [];
    result = 0;
    history.textContent = "";
    calculation.textContent = 0;
}

