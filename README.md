# Calculator


## Features

- Standard operations: add, subtract, multiply, divide
- Percent, backspace, and clear-all
- Full keyboard support (numbers, `+ - * /`, `Enter` for `=`, `Backspace`, `Escape` to clear)
- Responsive layout that works down to small phone screens
- Rounds floating-point results so you don't see things like `0.1 + 0.2 = 0.30000000000000004`

## Project structure

```
.
├── index.html   # markup
├── style.css    # visual design
├── script.js    # calculator logic
└── README.md
```

The three files are fully separated: no inline styles, no inline scripts.

## How it works

`script.js` runs a small state machine:

- `currentValue` — what's currently on screen
- `previousValue` — the value before the last operator was pressed
- `pendingOperator` — the operator waiting to be applied

Pressing `=` (or an operator right after a number) applies `pendingOperator` to `previousValue` and `currentValue`, then updates the display.

## Customizing

- Colors and sizing live entirely in `style.css`, defined as CSS custom properties at the top of the file — change the palette by editing the `:root` block.
- The button layout is a CSS grid (`.keys`) driven by the markup order in `index.html`, so adding a new key mostly means adding a `<button>` and a case in `script.js`.
