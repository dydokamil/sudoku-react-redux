export function selectCell({ value, cell }) {
  return {
    type: "CELL_SELECTED",
    payload: { value: value, cell: cell }
  };
}
