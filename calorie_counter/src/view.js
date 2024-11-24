import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";

import {
  showFormMsg,
  mealInputMsg,
  caloriesInputMsg,
  saveMealMsg,
  deleteMealMsg,
  editMealMsg,
} from "./update";

const {
  pre,
  div,
  h1,
  button,
  form,
  label,
  input,
  table,
  thead,
  tbody,
  tr,
  th,
  td,
  i,
} = hh(h);

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: "f3 pv2 ph3 bg-blue white bn mr2 dim",
        type: "submit",
      },
      "Save",
    ),
    button(
      {
        className: "f3 pv2 ph3 bg-light-gray bn dim",
        type: "button",
        onclick: () => dispatch(showFormMsg(false)),
      },
      "Cancel",
    ),
  ]);
}

function fieldSet(labelText, inputValue, oninput) {
  return div([
    label({ className: "db mb1" }, labelText),
    input({
      className: "pa2 input-reset ba w-100 mb2",
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);
}

function formView(dispatch, model) {
  const { description, calories, showForm } = model;
  if (showForm) {
    return form(
      {
        className: "w-100 mv2",
        onsubmit: (e) => {
          e.preventDefault();
          dispatch(saveMealMsg);
        },
      },
      [
        fieldSet("Meal", description, (e) =>
          dispatch(mealInputMsg(e.target.value)),
        ),
        fieldSet("Calories", calories || "", (e) =>
          dispatch(caloriesInputMsg(e.target.value)),
        ),
        buttonSet(dispatch),
      ],
    );
  }
  return button(
    {
      className: "f3 pv2 ph3 bg-blue white bn",
      onclick: () => dispatch(showFormMsg(true)),
    },
    "Add Meal",
  );
}

function cell(tag, className, value) {
  return tag({ className }, value);
}

function headerRow(className, headers) {
  return tr({ className }, [
    cell(th, "pa2 tl", headers[0]),
    cell(th, "pa2 tr", headers[1]),
    cell(th, "", ""),
  ]);
}

function mealRow(dispatch, className, meal) {
  return [
    tr({ className }, [
      cell(td, "pa2", meal.description),
      cell(td, "pa2 tr", meal.calories),
      cell(td, "pa2 tr", [
        i({
          className: "ph1 fa fa-trash-o pointer",
          onclick: () => dispatch(deleteMealMsg(meal.id)),
        }),
        i({
          className: "ph1 fa fa-pencil-square-o pointer",
          onclick: () => dispatch(editMealMsg(meal.id)),
        }),
      ]),
    ]),
  ];
}

function totalRow(meals) {
  const total = R.pipe(
    R.map((meal) => meal.calories),
    R.sum,
  )(meals);
  return tr({ className: "bt b" }, [
    cell(td, "pa2 tl b", "Total:"),
    cell(td, "pa2 tr b", total),
    cell(td, "", ""),
  ]);
}

function mealHeader(className, headers) {
  const row = headerRow("", headers);
  return thead({ className }, row);
}

function mealBody(dispatch, className, meals) {
  const rows = R.map(R.partial(mealRow, [dispatch, "stripe-dark"]), meals);
  const total = totalRow(meals);
  return tbody({ className }, [...rows, total]);
}

function mealTable(dispatch, meals) {
  if (meals.length === 0) {
    return div({ className: "mv2 i black-50" }, "No meals to display");
  }
  return table({ className: "mw6 w-100 collapse" }, [
    mealHeader("", ["Meal", "Calories"]),
    mealBody(dispatch, "", meals),
  ]);
}

function view(dispatch, model) {
  return div({ className: "mw6 center" }, [
    h1({ className: "f2 pv2 bb" }, "Calorie Counter"),
    formView(dispatch, model),
    mealTable(dispatch, model.meals),
  ]);
}

export default view;
