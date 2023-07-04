export const calculateRMSE = (actual: number[], predicted: number[]) => {
  if (actual.length !== predicted.length) {
    throw new Error("Input arrays must have the same length");
  }

  const sumSquaredErrors = actual.reduce((sum, actualValue, index) => {
    const predictedValue = predicted[index];
    const squaredError = Math.pow(predictedValue - actualValue, 2);
    return sum + squaredError;
  }, 0);

  const meanSquaredError = sumSquaredErrors / actual.length;
  const rootMeanSquaredError = Math.sqrt(meanSquaredError);

  return rootMeanSquaredError;
};

export const calculateMAE = (actual: number[], predicted: number[]) => {
  if (actual.length !== predicted.length) {
    throw new Error("Input arrays must have the same length");
  }

  const sumAbsErrors = actual.reduce((sum, actualValue, index) => {
    const predictedValue = predicted[index];
    const squaredError = Math.abs(predictedValue - actualValue);
    return sum + squaredError;
  }, 0);

  const meanAbsError = sumAbsErrors / actual.length;

  return meanAbsError;
};

const calculateMean = (array: number[]) => {
  const sum = array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const mean = sum / array.length;
  return mean;
};

export const calculateR2 = (actual: number[], predicted: number[]) => {
  if (actual.length !== predicted.length) {
    throw new Error("Input arrays must have the same length");
  }

  const meanActual = calculateMean(actual);
  const ssr = predicted.reduce((sum, predictedValue, index) => {
    const actualValue = actual[index];
    const residual = actualValue - predictedValue;
    return sum + Math.pow(residual, 2);
  }, 0);

  const sst = actual.reduce((sum, actualValue) => {
    const residual = actualValue - meanActual;
    return sum + Math.pow(residual, 2);
  }, 0);

  const r2 = 1 - ssr / sst;
  return r2;
};
