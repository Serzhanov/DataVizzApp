<template>
    <div>
      <table class="statistical-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th v-for="feature in features" :key="feature">{{ feature.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mean</td>
            <td v-for="feature in features" :key="feature.name">{{ getMean(feature.data) }}</td>
          </tr>
          <tr>
            <td>Variance</td>
            <td v-for="feature in features" :key="feature.name">{{ getVariance(feature.data) }}</td>
          </tr>
          <tr>
            <td>Median</td>
            <td v-for="feature in features" :key="feature.name">{{ getMedian(feature.data) }}</td>
          </tr>
          <tr>
            <td>Standard Deviation</td>
            <td v-for="feature in features" :key="feature.name">{{ getSd(feature.data) }}</td>
          </tr>
          <tr>
            <td>Range</td>
            <td v-for="feature in features" :key="feature.name">{{ getRange(feature.data) }}</td>
          </tr>
          <tr>
            <td>25th Percentile</td>
            <td v-for="feature in features" :key="feature.name">{{ getPercentile(feature.data,25) }}</td>
          </tr>
          <tr>
            <td>75th Percentile</td>
            <td v-for="feature in features" :key="feature.name">{{ getPercentile(feature.data,75) }}</td>
          </tr>
          <tr>
            <td>Correlation</td>
            <td colspan="2">
              <select v-model="selectedFeature1" class="form-select">
                <option v-for="feature in features" :key="feature.name" :value="feature.name">{{ feature.name }}</option>
              </select>
            </td>
            <td colspan="2">
              <select v-model="selectedFeature2" class="form-select">
                <option v-for="feature in features" :key="feature.name" :value="feature.name">{{ feature.name }}</option>
              </select>
            </td>
            <td>
              <button class="btn btn-primary" @click="calculateCorrelation" :disabled="!selectedFeature1 || !selectedFeature2">Calculate</button>
            </td>
            <td>{{ correlation }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { calculateMean, calculateVariance, calculateMedian, calculateRange, calculateStandardDeviation, calculatePercentile, calculateCorrelation } from '../utilsStats'
  
  export default {
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        selectedFeature1: '',
        selectedFeature2: '',
        correlation: '',
      };
    },
    computed: {
      features() {
        return this.data.map(obj => ({ name: obj.name, data: obj.data }));
      },
    },
    methods: {
      calculateCorrelation() {
        const feature1Data = this.features.find(feature => feature.name === this.selectedFeature1)?.data;
        const feature2Data = this.features.find(feature => feature.name === this.selectedFeature2)?.data;
        if (feature1Data && feature2Data) {
          const data1 = Object.values(feature1Data);
          const data2 = Object.values(feature2Data);
          this.correlation = calculateCorrelation(data1, data2);
        }
      },

      getMean(data){
        return calculateMean(Object.values(data))
      },
      getVariance(data){
        return calculateVariance(Object.values(data))
      },
      getMedian(data){
        return calculateMedian(Object.values(data))
      },
      getSd(data){
        return calculateStandardDeviation(Object.values(data))
      },
      getRange(data){
        return calculateRange(Object.values(data))
      },
      getPercentile(data,percent){
        return calculatePercentile(Object.values(data),percent)
      }
    },

  };
  </script>
  
  <style>
  .statistical-table {
    margin-bottom: 20px;
    border-collapse: collapse;
    width: 100%;
  }
  
  .statistical-table th,
  .statistical-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .statistical-table th {
    font-weight: bold;
  }
  
  .form-select {
    padding: 6px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    width: 100%;
  }
  
  .form-select:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
  }
  
  .btn-primary:focus {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
  }
  
  .btn-primary:disabled {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
    opacity: 0.65;
    cursor: not-allowed;
  }
  </style>