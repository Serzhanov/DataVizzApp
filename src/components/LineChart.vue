<template>
  <div>
    <h1 class="chart-title">{{title}}</h1>
    <line-chart prefix="$" xtitle="Time" ytitle="Price" loading="Loading..." :library="chartOptions" :data="chartData"></line-chart>
  </div>
</template>

<script>
import 'chart.js'
import { LineChart } from 'vue-chartkick'
export default {
  name: 'LineCharting',
  props:['data','min','max','title','daily'],
  components: {
    LineChart
  },
  computed:{
    chartData(){
      if(this.data){
        return this.data
      }
      return {}
    }
  },
  // watch:{
  //   min(newValue){
  //     var min=Math.round(newValue/ 10) * 10<=10?0:Math.round(newValue/ 10) * 10-10
  //     this.chartOptions.scales.y.min=min
  //     console.log(min,'here')
  //   },
  //   max(newValue){
  //     var max=Math.round(newValue/ 10) * 10+10
  //     this.chartOptions.scales.y.max=max
  //   }
  // },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        pointRadius:0,
        scales: {
          y: {
            // eslint-disable-next-line vue/no-computed-properties-in-data
            min:this.getMin(),
            // eslint-disable-next-line vue/no-computed-properties-in-data
            max: this.getMax(),
            beginAtZero: true,
            ticks: {
              stepSize: 10,
              callback: function (value) {
                if (value !== 0) {
                  const roundedValue = Math.round(value / 10) * 10;
                  return roundedValue.toString();
                }
                return value.toString();
              }
            },
            grid: {
              display: true,
              color: '#e8e8e8'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        legend: {
          display: false
        }
      }
    }
  },
  methods:{
    getMin(){
      if(this.daily){
        return this.min-1
      }
      var min=Math.round(this.min/ 10) * 10<=10?0:Math.round(this.min/ 10) * 10-10
      console.log(min,'Min value')
      return min
    },
    getMax(){
      if(this.daily){
        return this.max+1
      }
      var max=Math.round(this.max/ 10) * 10 + 10
      console.log(max,'Max value')
      return max
    }
  }
}

</script>

