<template>
  <div class="checkbox-table">
    <div class="checkbox-row">
      <div v-for="(value, index) in features" :key="index" class="checkbox-cell">
        <button :class="['checkbox-button', { 'checkbox-selected': isSelected(index) }]" @click="toggleSelected(index)">
          {{ value }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['features'],
  data() {
    return {
      selectedOptions: []
    };
  },
  methods: {
    isSelected(index) {
      return this.selectedOptions.includes(index);
    },
    toggleSelected(index) {
      if (this.isSelected(index)) {
        this.selectedOptions = this.selectedOptions.filter((value) => value !== index);
      } else {
        this.selectedOptions.push(index);
      }
      this.$emit('changedOptions', Object.values(this.selectedOptions));
    }
  }
};
</script>

<style>
.checkbox-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.checkbox-row {
  display: table-row;
}

.checkbox-cell {
  display: table-cell;
  padding: 10px;
}

.checkbox-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.checkbox-button:hover {
  background-color: #f5f5f5;
}

.checkbox-selected {
  background-color: #007bff;
  color: #fff;
}

.checkbox-selected:hover {
  background-color: #0056b3;
}

.selected-options {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
}
</style>