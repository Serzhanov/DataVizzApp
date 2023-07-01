<template>
  <div>
    <label v-for="(value, index) in features" :key="index">
      <input type="checkbox" :checked="isChecked(index)" :value=index @change="updateSelectedOptions(index)">
      {{ value }}
    </label>
    <p>Selected options: {{ selectedOptions }}</p>
  </div>
</template>
  
<script>
export default {
  props: ['features'],
  data() {
    return {
      selectedOptions: [],
      afterFirstChange:false
    };
  },
  methods: {
    isChecked(index) {
      console.log('index', this.features[index] === 'Price')
      if (this.features[index] === 'Price') {
        if(!this.selectedOptions.includes(index)&&!this.afterFirstChange)
          this.selectedOptions.push(index)
        return true
      }
      return false
    },
    updateSelectedOptions(index) {
      this.afterFirstChange=true
      if (this.selectedOptions.includes(index)) {
        this.selectedOptions = this.selectedOptions.filter((value) => value !== index);
      } else {
        this.selectedOptions.push(index);
      }
    }
  },

};
</script>