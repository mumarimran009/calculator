const output = document.getElementById("output");
const historyEl = document.getElementById("history");
const keys = document.getElementById("keys");

let currentValue = "0";
let previousValue = null;
let pendingOperator = null;
let justEvaluated = false;

const OPERATOR_SYMBOLS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

function updateDisplay() {
  output.textContent = currentValue;

  if (pendingOperator && previousValue !== null) {
    historyEl.textContent = `${previousValue} ${OPERATOR_SYMBOLS[pendingOperator]}`;
  } else {
    historyEl.textContent = "";
  }
}

function inputDigit(digit) {
  if (justEvaluated) {
    currentValue = digit === "." ? "0." : digit;
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (digit === "." && currentValue.includes(".")) return;

  if (currentValue === "0" && digit !== ".") {
    currentValue = digit;
  } else {
    currentValue += digit;
  }

  updateDisplay();
}

function setOperator(action) {
  if (pendingOperator && previousValue !== null && !justEvaluated) {
    evaluate();
  }

  previousValue = currentValue;
  pendingOperator = action;
  justEvaluated = false;
  currentValue = "0";
  updateDisplay();
}

function evaluate() {
  if (pendingOperator === null || previousValue === null) return;

  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  let result;

  switch (pendingOperator) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? NaN : a / b;
      break;
    default:
      return;
  }

  currentValue = formatResult(result);
  previousValue = null;
  pendingOperator = null;
  justEvaluated = true;
  updateDisplay();
}

function formatResult(value) {
  if (Number.isNaN(value)) return "Error";
  if (!Number.isFinite(value)) return "Error";

  const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

function clearAll() {
  currentValue = "0";
  previousValue = null;
  pendingOperator = null;
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) return;
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  currentValue = formatResult(parseFloat(currentValue) / 100);
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest(".key");
  if (!button) return;

  const { digit, action } = button.dataset;

  if (digit !== undefined) {
    inputDigit(digit);
    return;
  }

  switch (action) {
    case "clear":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
    case "percent":
      percent();
      break;
    case "equals":
      evaluate();
      break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      setOperator(action);
      break;
  }
});

const KEY_MAP = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  Enter: "equals",
  "=": "equals",
  Backspace: "backspace",
  Escape: "clear",
  "%": "percent",
};

window.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    inputDigit(event.key);
    return;
  }

  if (event.key === ".") {
    inputDigit(".");
    return;
  }

  const mapped = KEY_MAP[event.key];
  if (!mapped) return;

  event.preventDefault();

  if (mapped === "equals") {
    evaluate();
  } else if (mapped === "backspace") {
    backspace();
  } else if (mapped === "clear") {
    clearAll();
  } else if (mapped === "percent") {
    percent();
  } else {
    setOperator(mapped);
  }
});

updateDisplay();
