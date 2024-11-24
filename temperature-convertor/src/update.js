import * as R from "ramda";

const MSG = {
  LEFT_VALUE_INPUT: "LEFT_VALUE_INPUT",
  RIGHT_VALUE_INPUT: "RIGHT_VALUE_INPUT",
  LEFT_UNIT_CHANGE: "LEFT_UNIT_CHANGE",
  RIGHT_UNIT_CHANGE: "RIGHT_UNIT_CHANGE",
};

const UNITS = {
  FAHRENHEIT: "FAHRENHEIT",
  CELSIUS: "CELSIUS",
  KELVIN: "KELVIN",
};

export function leftInputMsg(leftValue) {
  return {
    type: MSG.LEFT_VALUE_INPUT,
    leftValue,
  };
}

export function rightInputMsg(rightValue) {
  return {
    type: MSG.RIGHT_VALUE_INPUT,
    rightValue,
  };
}

export function leftUnitChangeMsg(leftUnit) {
  return {
    type: MSG.LEFT_UNIT_CHANGE,
    leftUnit,
  };
}

export function rightUnitChangeMsg(rightUnit) {
  return {
    type: MSG.RIGHT_UNIT_CHANGE,
    rightUnit,
  };
}

function FtoC(value) {
  return (5 / 9) * (value - 32);
}

function CtoF(value) {
  return (9 / 5) * (value + 32);
}

function CtoK(value) {
  return value + 273.15;
}

function KtoC(value) {
  return value - 273.15;
}

const FtoK = R.pipe(FtoC, CtoK);

const KtoF = R.pipe(KtoC, CtoF);

const toInt = R.pipe(parseInt, R.defaultTo(0));

const unitConversions = {
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK,
  },
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK,
  },
  Kelvin: {
    Celsius: KtoC,
    Fahrenheit: KtoF,
  },
};

function round(number) {
  return Math.round(number * 10) / 10;
}

function convert(model) {
  const { leftValue, leftUnit, rightValue, rightUnit } = model;
  const [fromTemp, fromUnit, toUnit] = model.sourceLeft
    ? [leftValue, leftUnit, rightUnit]
    : [rightValue, rightUnit, leftUnit];
  const otherValue = R.pipe(convertFromToTemp, round)(
    fromUnit,
    toUnit,
    fromTemp,
  );
  return model.sourceLeft
    ? { ...model, rightValue: otherValue }
    : { ...model, leftValue: otherValue };
}

function convertFromToTemp(fromUnit, toUnit, temp) {
  const convertFn = R.pathOr(R.identity, [fromUnit, toUnit], unitConversions);
  return convertFn(temp);
}

function update(msg, model) {
  switch (msg.type) {
    case MSG.LEFT_VALUE_INPUT: {
      const leftValue = toInt(msg.leftValue);
      return convert({
        ...model,
        leftValue,
        sourceLeft: true,
      });
    }
    case MSG.RIGHT_VALUE_INPUT: {
      const rightValue = toInt(msg.rightValue);
      return convert({
        ...model,
        rightValue,
        sourceLeft: false,
      });
    }
    case MSG.LEFT_UNIT_CHANGE: {
      const { leftUnit } = msg;
      return convert({ ...model, leftUnit });
    }
    case MSG.RIGHT_UNIT_CHANGE: {
      const { rightUnit } = msg;
      return convert({ ...model, rightUnit });
    }
    default: {
      return model;
    }
  }
}

export default update;
