<template>
  <div>
    <div>
      <UploadFile @assign-data="setData"></UploadFile>
    </div>
    <h1 v-if="data.length === 0" class="no-data-title">No data available, please upload a file</h1>
    <div class="sticky-header">
      <RadioButtons @changedOptions="setSelectedFeatures" :features="features"></RadioButtons>
    </div>
    <div class="overview-container" v-if="data.length > 0">
      <h1 class="chart-title">Time-Based Overview: Examining Data Trends Over Time</h1>
      <LineCharting :min="processedOverallData[1]" :max="processedOverallData[2]" :data="processedOverallData[0]">
      </LineCharting>
      <StatParams :features="selectedFeatures" :data="processedOverallData[0]"></StatParams>
    </div>

    <div class="container" v-if="data.length > 0">
      <h1 class="chart-title">Yearly Data Analysis: Exploring Trends and Patterns Over Time</h1>
      <div class="range-container">
        <label for="startYearly">Start Date:</label>
        <div class="date-input">
          <input type="date" id="startYearly" v-model="startDateYearly" :max="maxStartDate" @change="updateEndDate">
          <i class="far fa-calendar-alt"></i>
        </div>
      </div>
      <div class="chart-container" v-if="startDateYearly">
        <LineCharting :min="processedYearData[1]" :max="processedYearData[2]" :data="processedYearData[0]"></LineCharting>
        <StatParams :features="selectedFeatures" :data="processedYearData[0]"></StatParams>
      </div>
    </div>

    <div class="container" v-if="data.length > 0">
      <h1 class="chart-title">Monthly Data Insights: Analyzing Trends and Patterns Over Time</h1>
      <div class="range-container">
        <label for="startMonthly">Start Date:</label>
        <div class="date-input">
          <input type="date" id="startMonthly" v-model="startDateMonthly" :max="maxStartDate" @change="updateEndDate">
          <i class="far fa-calendar-alt"></i>
        </div>
      </div>
      <div v-for="(month, index) in monthIndexes" :key="index" class="chart-container">
        <div v-if="startDateMonthly">
          <h2 class="chart-title">{{ month }} Data</h2>
          <LineCharting :daily="true" :min="processedMonthlyData[index][1]" :max="processedMonthlyData[index][2]"
            :data="processedMonthlyData[index][0]"></LineCharting>
          <StatParams :features="selectedFeatures" :data="processedMonthlyData[index][0]"></StatParams>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LineCharting from './components/LineChart.vue';
import UploadFile from './components/UploadFile.vue';
import RadioButtons from './components/RadioButtons.vue';
import StatParams from './components/StatParams.vue';
import { getOverallData, getYearDatabyRange, groupObjectsByMonth } from './utilsChart'
export default {
  components: {
    UploadFile,
    LineCharting,
    RadioButtons,
    StatParams
  },
  computed: {
    maxStartDate() {
      // Set the maximum start date as today
      if (this.maxDate) {
        const maxDateObj = new Date(this.maxDate)
        const maxStartDate = new Date(maxDateObj.getFullYear() - 1, maxDateObj.getMonth(), 0)
        return maxStartDate.toISOString().split('T')[0];
      }
      return null
    },
    endDateYearly() {
      // Calculate the end date based on the start date plus one month
      if (this.startDateYearly) {
        const startDateObj = new Date(this.startDateYearly);
        const endDateObj = new Date(startDateObj.getFullYear() + 1, startDateObj.getMonth(), 0);
        return endDateObj
      }
      return null;
    },
    processedMonthlyData() {
      if (this.startDateMonthly) {
        let arr = []
        const startDate = new Date(this.startDateMonthly)
        let monthlyData = groupObjectsByMonth(this.data, startDate)
        monthlyData.forEach(data => {
          arr.push(this.processData(data, true))
        })
        return arr
      }
      return []
    },

    processedYearData() {
      if (!this.startDateYearly || !this.endDateYearly) {
        return [];
      }
      const startDate = new Date(this.startDateYearly);
      const endDate = new Date(this.endDateYearly);
      const yearData = getYearDatabyRange(this.data, startDate, endDate)
      return this.processData(yearData)
    },
    processedOverallData() {
      let overallData = getOverallData(this.data)
      return this.processData(overallData)

    }
  },
  data() {
    return {
      startDateYearly: null,
      startDateMonthly: null,
      data: [],
      maxDate: null,
      monthIndexes: {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
      },
      features: [],
      selectedFeatures: []
    }
  },
  methods: {
    setData(data) {
      this.data = data
      this.features = Object.keys(data[0]);
      this.features = this.features.filter(element => {
        if (element === 'Date' || element==='Year' || element==='Month') {
          return false
        }
        return true
      })
      //Default choice is Price
      this.selectedFeatures.push(this.features.indexOf('Price'))
      this.maxDate = new Date(data[data.length - 1].Date)
    },
    //returns an array .First element is an object of dates ,the two lasts are min and max for y-axis range
    processData(data, daily = false) {
      if (data.length === 0) {
        return {}
      }
      let lineChartDataObj = []
      let minObj = {}
      let maxObj = {}
      if (data && data.length > 0) {
        let keys = this.features
        keys = keys.filter((element, index) => {
          if (this.selectedFeatures.includes(index)) {
            return true
          }
          return false
        })
        //set min and max of each feature
        for (const key of keys) {
          minObj[key] = data[0][key]
          maxObj[key] = data[0][key]
        }
        for (const key of keys) {
          let dataObj = {}
          let obj = {}
          data.forEach((record) => {
            var keyDate = this.formatDate(new Date(record.Date))
            if (minObj[key] > record[key]) {
              minObj[key] = record[key]
            }
            if (maxObj[key] < record[key]) {
              maxObj[key] = record[key]
            }
            dataObj[keyDate] = record[key]

          })
          obj['name'] = key
          obj['data'] = dataObj
          lineChartDataObj.push(obj)
        }
      }
      return [lineChartDataObj, this.getMin(minObj, daily), this.getMax(maxObj, daily)]
    },
    setSelectedFeatures(features) {
      this.selectedFeatures = features
    },
    formatDate(dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      return formattedDate
    },

    getMin(minObj, daily = false) {
      if (daily) {
        return Math.min(...Object.values(minObj)) - 1
      }
      var tempMin = Math.min(...Object.values(minObj))
      var min = Math.round(tempMin / 10) * 10 <= 10 ? 0 : Math.round(tempMin / 10) * 10 - 10
      return min
    },
    getMax(maxObj, daily = false) {
      if (daily) {
        return Math.max(...Object.values(maxObj)) + 1
      }
      var tempMax = Math.max(...Object.values(maxObj))
      var max = Math.round(tempMax / 10) * 10 + 10
      return max
    },
    getYearFromDateStr(str) {
      //str is yyyy-mm-dd
      return str.split('-')[0]
    }
  }

}
</script>


<style>
.chart-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.container {
  margin-top: 20px;
}

.range-container {
  margin-bottom: 10px;
}

.chart-container {
  margin-bottom: 40px;
}

.date-input {
  position: relative;
  display: inline-block;
}

.date-input input[type="date"] {
  padding: 8px 32px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

.date-input i {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #999;
}

.date-input i.far.fa-calendar-alt {
  font-size: 18px;
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 999;
}
.no-data-title {
  text-align: center;
  margin-top: 50px;
  font-size: 24px;
  color: red;
}

</style>