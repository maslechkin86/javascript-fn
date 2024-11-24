import * as R from "ramda";

export const MSG = {
  QUESTION_INPUT: "QUESTION_INPUT",
  ANSWER_INPUT: "ANSWER_INPUT",
  SAVE: "SAVE",
  SHOW_ANSWER: "SHOW_ANSWER",
  SCORE: "SCORE",
  NEW_CARD: "NEW_CARD",
  EDIT_CARD: "EDIT_CARD",
  DELETE_CARD: "DELETE_CARD",
};

export function questionInputMsg(id, question) {
  return {
    type: MSG.QUESTION_INPUT,
    id,
    question,
  };
}

export function answerInputMsg(id, answer) {
  return {
    type: MSG.ANSWER_INPUT,
    id,
    answer,
  };
}

export function saveMsg(id) {
  return {
    type: MSG.SAVE,
    id,
  };
}

export function showAnswerMsg(id) {
  return {
    type: MSG.SHOW_ANSWER,
    id,
  };
}

export function scoreMsg(id, score) {
  return {
    type: MSG.SCORE,
    id,
    score,
  };
}

export function editCardMsg(id) {
  return {
    type: MSG.EDIT_CARD,
    id,
  };
}

export function deleteCardMsg(id) {
  return {
    type: MSG.DELETE_CARD,
    id,
  };
}

export const newCardMsg = {
  type: MSG.NEW_CARD,
};

export const SCORES = {
  BAD: 0,
  GOOD: 1,
  GREAT: 2,
};

const updateCards = R.curry((updateCard, card) => {
  if (updateCard.id === card.id) {
    return { ...card, ...updateCard };
  }
  return card;
});

function update(msg, model) {
  console.log(msg);
  switch (msg.type) {
    case MSG.QUESTION_INPUT: {
      const { id, question } = msg;
      const { cards } = model;
      const updatedCards = R.map(updateCards({ id, question }), cards);
      return { ...model, cards: updatedCards };
    }
    case MSG.ANSWER_INPUT: {
      const { id, answer } = msg;
      const { cards } = model;
      const updatedCards = R.map(updateCards({ id, answer }), cards);
      return { ...model, cards: updatedCards };
    }
    case MSG.SAVE: {
      const { id } = msg;
      const { cards } = model;
      const updatedCards = R.map(updateCards({ id, edit: false }), cards);
      return { ...model, cards: updatedCards };
    }
    case MSG.SHOW_ANSWER: {
      const { id } = msg;
      const { cards } = model;
      const updatedCards = R.map(updateCards({ id, showAnswer: true }), cards);
      return { ...model, cards: updatedCards };
    }
    case MSG.EDIT_CARD: {
      const { id } = msg;
      const { cards } = model;
      const updatedCards = R.map(updateCards({ id, edit: true }), cards);
      return { ...model, cards: updatedCards };
    }
    case MSG.SCORE: {
      const { id, score } = msg;
      const { cards } = model;
      const card = R.find(R.propEq("id", id), cards);

      const rank = R.cond([
        [R.propEq("score", SCORES.BAD), R.always(0)],
        [R.propEq("score", SCORES.GOOD), ({ rank }) => rank + 1],
        [R.propEq("score", SCORES.GREAT), ({ rank }) => rank + 2],
      ])({ score, rank: card.rank });
      const updatedCards = R.pipe(
        R.map(updateCards({ id, showAnswer: false, rank })),
        R.sortWith([R.ascend(R.prop("rank")), R.descend(R.prop("id"))]),
      )(cards);
      return { ...model, cards: updatedCards };
    }
    case MSG.NEW_CARD: {
      const { nextId: id, cards } = model;
      const newCard = {
        id,
        question: "",
        answer: "",
        rank: 0,
        showAnswer: false,
        edit: true,
      };
      const updatedCards = R.prepend(newCard, cards);
      return { ...model, cards: updatedCards, nextId: id + 1 };
    }
    case MSG.DELETE_CARD: {
      const { id } = msg;
      const { cards } = model;
      const updatedCards = R.reject(R.propEq("id", id), cards);
      return { ...model, cards: updatedCards };
    }
    default:
      return model;
  }
}

export default update;
