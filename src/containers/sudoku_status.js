import React, { Component } from "react";

export default class SudokuStatus extends Component {
  render() {
    return (
      <div>
        <div>{this.props.cells_left} cell(s) left.</div>

        {this.props.duplicates_box ? (
          <div>There are duplicate elements within a single box!</div>
        ) : null}

        {this.props.duplicates_column ? (
          <div>There are duplicate elements within a single column!</div>
        ) : null}

        {this.props.duplicates_row ? (
          <div>There are duplicate elements within a single row!</div>
        ) : null}

        {this.props.cells_left === 0 &&
        !this.props.duplicates_box &&
        !this.props.duplicates_column &&
        !this.props.duplicates_row ? (
          <div>You've won! Refresh the page.</div>
        ) : null}
      </div>
    );
  }
}
