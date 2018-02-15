export default function(state, action) {
  if (state === undefined) {
    var circularShift = require("circular-shift");
    let a = [];
    for (let i = 0; i < 9; i++) {
      if (i === 0) {
        a.push(
          [...Array(9).keys()].map(x => x + 1).sort(() => Math.random() > 0.5)
        );
        continue;
      }
      if (i % 3 === 0) {
        a.push(circularShift(a[i - 1], 1));
      } else {
        a.push(circularShift(a[i - 1], 3));
      }
    }
    var flatten = require("array-flatten");
    var rotate = require("matrix-rotate");

    // rotate the array to give it some randomness
    for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
      a = rotate(a);
    }

    a = flatten(a);
    a = a.map(x => (Math.random() > 0.6 ? x : 0));
    return flatten(a);
  }

  switch (action.type) {
    case "CELL_SELECTED":
      return [
        ...state.slice(0, action.payload.cell),
        action.payload.value,
        ...state.slice(action.payload.cell + 1)
      ];
    default:
      return state;
  }
}
