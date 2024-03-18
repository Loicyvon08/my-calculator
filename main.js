// screen result
let result = document.getElementById("result");

// Ans result
let ansResult = document.getElementById("Ans-result");

// operating buttons
let operating = document.querySelectorAll(".signs");

// numeric buttons
let numeric = document.querySelectorAll(".button");

// equal button
let equal = document.getElementById("equal");

// delete button
let boutonDelete = document.getElementById("delete");

// ans button
let ans = document.getElementById("ans");

// clic kHistory
let clickHistory = "";

// last calcul
let CalCul = false;

//function to manage user entries
function handleKeyPress(key) {
  // Handle special characters '*' and '/'
  if (key === "*") {
    key = "×";
  } else if (key === "/") {
    key = "÷";
  }

  // allows the point to be entered only once
  if (key === ".") {
    // Checks if the last number already contains a dot
    const lastNumber = clickHistory.split(/[+\-×÷]/).pop();
    const isLastNumberDecimal = lastNumber.includes(".");

    // If the last number already contains a dot, ignore the addition of a new dot
    if (isLastNumberDecimal) {
      return;
    }
  }

  // Check for operators
  if (key.match(/[+\-×÷]/)) {
    // Find last character in history
    const lastChar = clickHistory.slice(-1);

    // operators cannot follow each other and a "-" can be inserted after an operator
    if (clickHistory === "" && key !== "-") {
      return; // Prevent adding an operator at the beginning, except for "-"
    }

    if ((lastChar.match(/[+\-×÷]/) && key !== "-") || lastChar === "-") {
      return;
    }
  }

  // update screen
  if (clickHistory === "0") {
    clickHistory = key;
  } else {
    clickHistory += key;
  }

  // new entry after "=" sign
  if (CalCul === true && /^[0-9.]$/.test(key)) {
    clickHistory = key;
    CalCul = false;
  } else if (CalCul === true && /[+\-×÷]/.test(key)) {
    CalCul = false;
  }

  // Update display
  result.textContent = clickHistory;
  // scroll text horizontally
  result.scrollLeft = result.scrollWidth;
}

// Function to evaluate and update result
const evaluateExpression = () => {
  try {
    const NewExpression = clickHistory.replace(/×/g, "*").replace(/÷/g, "/");
    const resultValue = eval(NewExpression);
    clickHistory = resultValue.toString();
    result.textContent = clickHistory;

    ansResult.textContent = "Ans = " + clickHistory;

    CalCul = true; //confirms if a calculation has been performed
  } catch (error) {
    // sends an error if expression is incorrect
    clickHistory = "0";
    result.textContent = clickHistory;
    ansResult.textContent = "Ans = 0";
  }
};

// event listener for equal button
equal.addEventListener("click", evaluateExpression);

// event listener for on-screen display
operating.forEach(function (element) {
  element.addEventListener("click", display);
});
numeric.forEach(function (element) {
  element.addEventListener("click", display);
});

// on-screen display function
function display(event) {
  let value = event.currentTarget.textContent;
  handleKeyPress(value);
}

// function to manage delete
const clearScreen = () => {
  if (clickHistory.length > 1) {
    clickHistory = clickHistory.slice(0, -1);
    result.textContent = clickHistory;
  } else {
    clickHistory = "0";
    result.textContent = clickHistory;
  }
};

// event listener for delete fuction
boutonDelete.addEventListener("click", clearScreen);

// event listener for keyboard buttons
document.addEventListener("keydown", function (event) {
  // Checks key pressed
  if (/^[0-9]$|\.$|[+\-*/÷]$|^Enter$|^Backspace$/.test(event.key)) {
    if (event.key === "Enter") {
      evaluateExpression();
    } else if (event.key === "Backspace") {
      clearScreen();
    } else {
      handleKeyPress(event.key);
    }
  }
});

// ans button
ans.addEventListener("click", function () {
  const ansNumber = ansResult.textContent.match(/[0-9.]+/);
  const lastChar = clickHistory.slice(-1);
  if (ansNumber) {
    if (lastChar.match(/[+\-×÷]/)) {
      clickHistory += ansNumber ? ansNumber[0] : "";
    } else {
      clickHistory = ansNumber ? ansNumber[0] : "";
    }
  }

  result.textContent = clickHistory;
  result.scrollLeft = result.scrollWidth;
});
