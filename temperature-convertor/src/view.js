import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";

import {
  leftInputMsg,
  rightInputMsg,
  leftUnitChangeMsg,
  rightUnitChangeMsg,
} from "./update";

const { div, h1, pre, input, select, option, br } = hh(h);

const UNITS = ["Fahrenheit", "Celsius", "Kelvin"];
function unitOptions(selectedUnit) {
  return R.map(
    (unit) => option({ value: unit, selected: unit === selectedUnit }, unit),
    UNITS,
  );
}

function unitSection(dispatch, value, unit, inputMsg, unitMsg) {
  return div(
    {
      className: "w-50 ma1",
    },
    [
      input({
        type: "text",
        className: "db w-100 mv2 pa2 input-reset ba",
        value,
        oninput: (e) => dispatch(inputMsg(e.target.value)),
      }),
      br(),
      select(
        {
          className: "db w-100 pa2 ba input-reset br1 bg-white ba b--black",
          onchange: (e) => dispatch(unitMsg(e.target.value)),
        },
        unitOptions(unit),
      ),
    ],
  );
}

function view(dispatch, model) {
  return div({ className: "mw6 center" }, [
    h1({ className: "f2 pv2 bb" }, "Temperature Unit Converter"),
    div({ className: "flex" }, [
      unitSection(
        dispatch,
        model.leftValue,
        model.leftUnit,
        leftInputMsg,
        leftUnitChangeMsg,
      ),
      div({ className: "w-20 tc" }, "="),
      unitSection(
        dispatch,
        model.rightValue,
        model.rightUnit,
        rightInputMsg,
        rightUnitChangeMsg,
      ),
    ]),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
