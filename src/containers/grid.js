import React, { Component } from "react";
import { connect } from "react-redux";
import { selectCell } from "../actions/index";
import { bindActionCreators } from "redux";
import SudokuStatus from "./sudoku_status";

class Grid extends Component {
  constructor(props) {
    super(props);

    this.convertTo2D = this.convertTo2D.bind(this);
    this.onCellChange = this.onCellChange.bind(this);

    this.checkDuplicatesBox = this.checkDuplicatesBox.bind(this);
    this.checkDuplicatesVertical = this.checkDuplicatesVertical.bind(this);
    this.checkDuplicatesHorizontal = this.checkDuplicatesHorizontal.bind(this);
    this.checkEmptyFields = this.checkEmptyFields.bind(this);

    const cells = this.props.cells;
    const disabled_cells = cells
      .map((x, idx) => (x === 0 ? null : idx))
      .filter(x => x !== null);

    this.state = {
      cells: cells,
      disabled_cells: disabled_cells,
      duplicates_row: false,
      duplicates_column: false,
      duplicates_box: false
    };
  }

  checkDuplicatesHorizontal(cells) {
    // This function returns true if it encounters a duplicate within
    // a horizontal line
    let rows = this.convertTo2D(cells);
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        if (
          rows[i].filter(x => x !== 0).filter(x => x === rows[i][j]).length > 1
        ) {
          this.setState({ duplicates_row: true });
          return true;
        }
      }
    }
    this.setState({ duplicates_row: false });
    return false;
  }

  checkDuplicatesVertical(cells) {
    // This function returns true if it encounters a duplicate within
    // a vertical line
    let rows = this.convertTo2D(cells);
    var rotate = require("matrix-rotate");
    rows = rotate(rows);

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        if (
          rows[i].filter(x => x !== 0).filter(x => x === rows[i][j]).length > 1
        ) {
          this.setState({ duplicates_column: true });
          return true;
        }
      }
    }
    this.setState({ duplicates_column: false });
    return false;
  }

  checkDuplicatesBox(cells) {
    // This function returns true if it encounters a duplicate within
    // a 3x3 box
    let rows = this.convertTo2D(cells);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        let nums = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            nums.push(rows[i + x * 3][j + y * 3]);
          }
        }
        // check your nums here for duplicates
        nums = nums.filter(x => x !== 0);
        const unique_nums = nums.filter((v, i, a) => a.indexOf(v) === i);
        if (nums.length > unique_nums.length) {
          this.setState({ duplicates_box: true });
          return true;
        }
      }
    }
    this.setState({ duplicates_box: false });
    return false;
  }

  checkEmptyFields(cells) {
    // this function returns true if there are still empty inputs
    return cells.filter(x => x === 0).length > 0;
  }

  checkFullWin(cells) {
    var empty_fields = this.checkEmptyFields(cells);
    var duplicates_horizontal = this.checkDuplicatesHorizontal(cells);
    var duplicates_vertical = this.checkDuplicatesVertical(cells);
    var duplicates_box = this.checkDuplicatesBox(cells);

    return (
      empty_fields ||
      duplicates_horizontal ||
      duplicates_vertical ||
      duplicates_box
    );
  }

  convertTo2D(arr) {
    let rows = [];
    for (var i = 0; i < 9; i++) {
      rows.push(arr.slice(i * 9, i * 9 + 9));
    }
    return rows;
  }

  onCellChange(event, id) {
    let cells_state = this.state.cells;
    const orig_num = cells_state[id];
    cells_state[id] = parseInt(event.target.value, 10);

    // Prevent characters
    if (isNaN(cells_state[id])) {
      cells_state[id] = 0;
    }

    // Prevent double digits or less than 1; allow for empty field
    if (cells_state[id] > 9 || (cells_state[id] < 1 && cells_state[id] != "")) {
      cells_state[id] = orig_num;
    }

    this.setState({ cells: cells_state });

    this.props.selectCell({ value: this.state.cells[id], cell: id });
    this.checkFullWin(this.state.cells);
  }

  renderGrid() {
    let rows = this.convertTo2D(this.state.cells);

    return rows.map((row, index_i) => {
      return (
        <tr key={index_i}>
          {row.map((cell, index_j) => {
            const id = index_i * 9 + index_j;
            const border_top = index_i % 3 === 0;
            const border_right = index_j === 8;
            const border_left = index_j % 3 === 0;
            const border_bottom = index_i === 8;

            const classNames = `${border_top ? "cell-border-top" : ""} ${
              border_right ? "cell-border-right" : ""
            } ${border_left ? "cell-border-left" : ""} ${
              border_bottom ? "cell-border-bottom" : ""
            } `;
            return (
              <td className={classNames} key={id}>
                <input
                  onChange={event => {
                    this.onCellChange(event, id);
                  }}
                  disabled={this.state.disabled_cells.includes(id)}
                  className="sudoku-input"
                  value={cell === 0 ? "" : cell}
                />
              </td>
            );
          })}
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>Sudoku</h1>
        <table>
          <thead />
          <tbody>{this.renderGrid()}</tbody>
        </table>
        <SudokuStatus
          cells_left={this.state.cells.filter(x => x === 0).length}
          duplicates_row={this.state.duplicates_row}
          duplicates_box={this.state.duplicates_box}
          duplicates_column={this.state.duplicates_column}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { cells: state.cells };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectCell: selectCell }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
