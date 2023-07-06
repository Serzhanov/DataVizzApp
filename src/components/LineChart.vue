<template>
  <div>
    <h1 class="chart-title">{{title}}</h1>
    <line-chart empty="Please check the box below to view the data." prefix="$" xtitle="Time"  loading="Loading..." :library="chartOptions" :data="chartData"></line-chart>
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
  watch:{
    min(newVal){
      this.chartOptions.scales.y.min=newVal
    },
    max(newVal){
      this.chartOptions.scales.y.max=newVal
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        pointRadius:0,
        scales: {
          y: {
            min:this.min,
            max: this.max,
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
  }
}

</script>

