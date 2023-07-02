// Calculate the mean (average) of an array of values
export function calculateMean(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  }
  
  // Calculate the variance of an array of values
export function calculateVariance(data) {
    const mean = calculateMean(data);
    const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
    const sum = squaredDifferences.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  }
  
  // Calculate the median of an array of values
  export function calculateMedian(data) {
    const sortedData = data.sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      return (sortedData[middleIndex - 1] + sortedData[middleIndex]) / 2;
    } else {
      return sortedData[middleIndex];
    }
  }
  
  //Calculate the standard deviation of an array of values
  export function calculateStandardDeviation(data) {
    const variance = calculateVariance(data);
    return Math.sqrt(variance);
  }
  
 // Calculate the range (difference between the maximum and minimum values) of an array of values
  export function calculateRange(data) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return max - min;
  }
  
  // Calculate the specified percentile of an array of values
  export function calculatePercentile(data, percentile) {
    const sortedData = data.sort((a, b) => a - b);
    const index = (percentile / 100) * (sortedData.length - 1);
    const floorIndex = Math.floor(index);
    const ceilIndex = Math.ceil(index);
    if (floorIndex === ceilIndex) {
      return sortedData[floorIndex];
    } else {
      const lowerValue = sortedData[floorIndex] * (ceilIndex - index);
      const upperValue = sortedData[ceilIndex] * (index - floorIndex);
      return lowerValue + upperValue;
    }
  }
  
  // Calculate the correlation between two arrays of values
  export function calculateCorrelation(data1, data2) {
    const mean1 = calculateMean(data1);
    const mean2 = calculateMean(data2);
    const deviations1 = data1.map(value => value - mean1);
    const deviations2 = data2.map(value => value - mean2);
    const productDeviations = deviations1.map((value, index) => value * deviations2[index]);
    const sumProductDeviations = productDeviations.reduce((acc, value) => acc + value, 0);
    const squaredDeviations1 = deviations1.map(value => Math.pow(value, 2));
    const squaredDeviations2 = deviations2.map(value => Math.pow(value, 2));
    const sumSquaredDeviations1 = squaredDeviations1.reduce((acc, value) => acc + value, 0);
    const sumSquaredDeviations2 = squaredDeviations2.reduce((acc, value) => acc + value, 0);
    return sumProductDeviations / Math.sqrt(sumSquaredDeviations1 * sumSquaredDeviations2);
  }