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

const shuffleArray = (array: Row[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const trainTestSplit = async () => {
  const data = await getAndArrangeData();
  const ratio = 3;
  const trainBasic: Row[] = [];
  const testBasic: Row[] = [];
  // stratification
  data.forEach((row, i) => {
    if (i % ratio === 0) {
      testBasic.push(row);
    } else trainBasic.push(row);
  });
  // shuffle
  const test = shuffleArray(testBasic);
  const train = shuffleArray(trainBasic);
  return [train, test];
};

// export const linearRegression = async (
//   numFeatures: number,
//   learningRate: number
// ) => {
//   const [train, test] = await trainTestSplit();
//   const theta = Array(numFeatures + 1).fill(0);

// };
export class LinearRegression {
  private theta: number[];
  private learningRate: number;
  private numFeatures: number;

  constructor(learningRate: number, numFeatures: number) {
    this.theta = Array(numFeatures + 1).fill(0);
    this.learningRate = learningRate;
    this.numFeatures = numFeatures;
  }

  train(X: number[][], y: number[], iterations: number): void {
    const m = X.length;

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < m; i++) {
        const prediction = this.predict(X[i]);
        const error = prediction - y[i];

        for (let j = 0; j <= this.numFeatures; j++) {
          if (j === 0) this.theta[j] -= this.learningRate * (1 / m) * error;
          else
            this.theta[j] -= this.learningRate * (1 / m) * error * X[i][j - 1];
        }
      }
    }
  }

  predict(row: number[]): number {
    let prediction = this.theta[0]; // Intercept term

    // for (let i = 0; i < this.numFeatures; i++) {
    //   prediction += this.theta[i + 1] * row[i]; // Multiply each feature with its corresponding theta
    // }
    // console.log("theta", this.theta);
    this.theta.forEach((t, index) => {
      if (index !== 0) prediction += t * row[index - 1];
    });
    return prediction;
  }
}
