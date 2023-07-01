<template>
  <div>
    <div>
      <UploadFile @assign-data="setData"></UploadFile>
    </div>
    <RadioButtons :features="features"></RadioButtons>
    <div v-if="data.length > 0">
      <LineCharting :min="processedOverallData[1]" :title="'Time & Price'" :max="processedOverallData[2]"
        :data="processedOverallData[0]"></LineCharting>
    </div>
    <!-- <div>
      <LineCharting :min="minPrice" :title="'Time & Price'" :max="maxPrice" :data="processedLineChartData"></LineCharting>
    </div> -->
    <div class="container" v-if="data.length > 0">
      <h1>Yearly Data</h1>
      <div class="range-container">
        <label for="start">Start Date:</label>
        <input type="date" id="start" v-model="startDateYearly" :max="maxStartDate" @change="updateEndDate">
      </div>
      <div class="chart-container">
        <LineCharting v-if="startDateYearly" :min="processedYearData[1]" :title="'Year Data'" :max="processedYearData[2]"
          :data="processedYearData[0]"></LineCharting>
      </div>
    </div>

    <div class="container" v-if="data.length > 0">
      <h1>Montlhy Data</h1>
      <div class="range-container">
        <label for="start">Start Date:</label>
        <input type="date" id="start" v-model="startDateMonthly" :max="maxStartDate" @change="updateEndDate">
      </div>
      <div v-for="(month, index) in monthIndexes" :key="index" class="chart-container">
        {{ value }}
        <LineCharting v-if="startDateMonthly" :daily="true" :min="processedMonthlyData[index][1]" :title="month + ' Data'"
          :max="processedMonthlyData[index][2]" :data="processedMonthlyData[index][0]"></LineCharting>
      </div>
    </div>

  </div>
</template>

<script>
import LineCharting from './components/LineChart.vue';
import UploadFile from './components/UploadFile.vue';
import RadioButtons from './components/RadioButtons.vue';
import { getOverallData, getYearDatabyRange, groupObjectsByMonth } from './utils'
// data = [
//   {name: 'Workout', data: {'2021-01-01': 3, '2021-01-02': 4}},
//   {name: 'Call parents', data: {'2021-01-01': 5, '2021-01-02': 3}}
// ];
export default {
  components: {
    UploadFile,
    LineCharting,
    RadioButtons
  },
  watch: {
    startDateMonthly() {
      //console.log(this.processedMonthlyData[0][1])
    }
  },
  computed: {
    maxStartDate() {
      // Set the maximum start date as today
      console.log(this.maxDate)
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
        // /console.log(groupObjectsByMonth(this.data,startDate))
        // console.log(monthlyData.map(data=>{
        //   return this.processData(data)
        // })
        monthlyData.forEach(data => {
          arr.push(this.processData(data))
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
      console.log("year", getYearDatabyRange(this.data, startDate, endDate))
      const yearData = getYearDatabyRange(this.data, startDate, endDate)
      return this.processData(yearData)
    },
    processedOverallData() {
      let overallData = getOverallData(this.data)
      console.log(this.data)
      console.log('triggered', overallData)
      // if (overallData && overallData.length > 0) {
      //   overallData.forEach((record) => {
      //     var key = this.formatDate(new Date(record.Date))
      //     if (this.minPrice > record.Price) {
      //       this.minPrice = record.Price
      //     }
      //     if (this.maxPrice < record.Price) {
      //       this.maxPrice = record.Price
      //     }
      //     obj[key] = record.Price
      //   })
      //   console.log('my obj', obj)
      //   return obj
      // }
      return this.processData(overallData)

    }
  },
  data() {
    return {
      startDateYearly: null,
      startDateMonthly: null,
      data: [],
      minPrice: -1,
      maxPrice: -1,
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
      selectedFeatures: ['Price']
    }
  },
  methods: {
    setData(data) {
      this.data = data
      this.features = Object.keys(data[0]);
      this.minPrice = data[0].Price
      this.maxPrice = data[0].Price
      this.maxDate = new Date(data[data.length - 1].Date)
    },
    //returns an array .First element is an object of dates ,the two lasts are min and max for y-axis range
    processData(data) {
      if (data.length === 0) {
        return {}
      }
      let obj = {}
      console.log(data)
      let maxPrice = data[0].Price
      let minPrice = data[0].Price
      if (data && data.length > 0) {
        data.forEach((record) => {
          var key = this.formatDate(new Date(record.Date))
          if (minPrice > record.Price) {
            minPrice = record.Price
          }
          if (maxPrice < record.Price) {
            maxPrice = record.Price
          }
          obj[key] = record.Price
        })
        console.log('my obj', obj)
      }
      return [obj, minPrice, maxPrice]
    },
    processData2(data) {
      if (data.length === 0) {
        return {}
      }
      let obj = {}
      console.log(data)
      let minObj = {}
      let maxObj = {}
      if (data && data.length > 0) {
        let keys = Object.keys(data[0])
        keys = keys.filter(element => {
          if (this.selectedFeatures.includes(element)) {
            return true
          }
          return false
        })
        for (const key of keys) {
          minObj[key] = data[0][key]
          maxObj[key] = data[0][key]
        }
        for (const key of keys) {
          let dataObj = {}
          data.forEach((record) => {
            var key = this.formatDate(new Date(record.Date))
            if (minObj[key] > record[key]) {
              minObj[key] = record[key]
            }
            if (maxObj[key] < record[key]) {
              maxObj[key] = record[key]
            }
            dataObj[key] = record[key]

          })
          obj[key] = key
          obj['data'] = dataObj
        }
      }
      return [obj, minObj, maxObj]
    },
    formatDate(dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      return formattedDate
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
</style>