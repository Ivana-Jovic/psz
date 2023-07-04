import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
import { db } from "./db/drizzle.ts";
import {
  ApartmentsForSale,
  apartmentsForSale,
} from "./db/schema/apartmentsForSale.ts";
import { top5locations } from "./top5Locations.ts";
import { Row, getAndArrangeData } from "./arrangeData.ts";
// todo train test
// todo  shuffle
// todo treniranje
// todo price u categortije

const helperObj: { [key: string]: number } = {
  // id: 0,
  // url: 1,
  // title: 2,
  // price: 0,
  size: 0,
  location: 1,
  // city: varchar("city", { length: 255 }),
  yearOfConstruction: 2,
  //   landSurface: decimal("land_surface"),
  floor: 3,
  // totalFloors: integer("total_floors"),
  numOfBathrooms: 4,
  numOfRooms: 5,
  registered: 6,
  elevator: 7,
  terrace: 8,
  parking: 9,
  garage: 10,
};

const shuffleArrays = (
  arrayX: Omit<Row, "price">[],
  arrayY: number[]
): [Omit<Row, "price">[], number[]] => {
  for (let i = arrayX.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayX[i], arrayX[j]] = [arrayX[j], arrayX[i]];
    [arrayY[i], arrayY[j]] = [arrayY[j], arrayY[i]];
  }
  return [arrayX, arrayY];
};

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

export const trainTestSplit = async (): Promise<
  [Omit<Row, "price">[], number[], Omit<Row, "price">[], number[]]
> => {
  const data = await getAndArrangeData();
  const ratio = 3;
  const trainBasicX: Omit<Row, "price">[] = [];
  const trainBasicY: number[] = [];
  const testBasicX: Omit<Row, "price">[] = [];
  const testBasicY: number[] = [];
  // stratification
  data.forEach((row, i) => {
    const { price, ...rowWithoutPrice } = row;
    if (i % ratio === 0) {
      testBasicX.push(rowWithoutPrice);
      testBasicY.push(price);
    } else {
      trainBasicX.push(rowWithoutPrice);
      trainBasicY.push(price);
    }
  });
  // shuffle
  const [testX, testY] = shuffleArrays(testBasicX, testBasicY);
  const [trainX, trainY] = shuffleArrays(trainBasicX, trainBasicY);
  return [trainX, trainY, testX, testY];
};

export class LinearRegression {
  private theta: number[];
  private learningRate: number;
  private numFeatures: number;
  // private decay = 0.95;

  constructor(learningRate: number) {
    this.numFeatures = Object.keys(helperObj).length;
    this.theta = Array(this.numFeatures + 1).fill(0);
    this.learningRate = learningRate;
  }
  // x is a feature

  train(X: Omit<Row, "price">[], y: number[], iterations: number): void {
    const m = X.length;

    for (let iter = 0; iter < iterations; iter++) {
      [X, y] = shuffleArrays(X, y);
      for (let i = 0; i < m; i++) {
        const prediction = this.predict(X[i]); //h
        const error = prediction - y[i]; // h-y

        // for (let j = 0; j <= this.numFeatures; j++) {
        //   if (j === 0) this.theta[j] -= this.learningRate * (1 / m) * error;
        //   // w0=w0-a*1/m*err
        //   else
        //     this.theta[j] -= this.learningRate * (1 / m) * error * X[i][j - 1];
        //   // w1=w1-a*1/m*err*(x1 za m-ti)
        // }
        this.theta[0] -= this.learningRate * (1 / m) * error;

        Object.keys(helperObj).map((elem) => {
          const indexOfFeatureInTable: number = helperObj[elem];
          this.theta[indexOfFeatureInTable + 1] -=
            this.learningRate * (1 / m) * error * X[i][elem];
        });
        // if (i === 0) {
        //   console.log(iter, prediction, this.theta);
        //   return;
        // }
        // console.log(iter, this.theta);
        // for (let j = 0; j <= this.numFeatures; j++) {
        //   if (j === 0)
        //   // w0=w0-a*1/m*err
        //   else
        //     this.theta[j] -= this.learningRate * (1 / m) * error * X[i][j - 1];
        //   // w1=w1-a*1/m*err*(x1 za m-ti)
        // }
      }
      // this.learningRate = this.learningRate * Math.pow(this.decay, iter / 500);
    }
    console.log("end of train", this.theta);
  }
  // Omit<Row, "price"> todo
  predict(row: Omit<Row, "price">): number {
    let prediction = this.theta[0]; // w0

    // this.theta.forEach((t, index) => {
    //   if (index !== 0) prediction += t * row[index - 1];
    //   //w1*x0 a ne x1 kao u formuli
    // });
    Object.keys(helperObj).map((elem) => {
      const indexOfFeatureInTable: number = helperObj[elem];
      // if (index !== 0) {
      prediction += this.theta[indexOfFeatureInTable + 1] * row[elem];
      //w1*x0 a ne x1 kao u formuli}
    });
    return prediction;
  }
}
