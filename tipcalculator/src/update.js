export const MSG = {
  BILL_AMOUNT_INPUT: "BILL_AMOUNT_INPUT",
  TIP_PERCENT_INPUT: "TIP_PERCENT_INPUT",
};

export function billAmountInputMsg(billAmount) {
  return {
    type: MSG.BILL_AMOUNT_INPUT,
    billAmount,
  };
}

export function tipPercentInputMsg(tipPercent) {
  return {
    type: MSG.TIP_PERCENT_INPUT,
    tipPercent,
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSG.BILL_AMOUNT_INPUT: {
      const { billAmount } = msg;
      return { ...model, billAmount };
    }
    case MSG.TIP_PERCENT_INPUT: {
      const { tipPercent } = msg;
      return { ...model, tipPercent };
    }
    default:
      return model;
  }
}

export default update;
