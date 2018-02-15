import { combineReducers } from "redux";
import GridReducer from "./reducer_grid";
import SelectCellReducer from "./reducer_grid";

const rootReducer = combineReducers({
  cells: GridReducer,
  selectCellReducer: SelectCellReducer
});

export default rootReducer;
