<template>
    <div class="upload-container">
        <input type="file" id="fileInput" @change="handleFileSelection" class="file-input" />
        <label for="fileInput" class="file-label">
            <span class="file-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </span>
            <span class="file-text">Select File</span>
        </label>
        <span id="fileName" class="file-name">No file selected</span>
    </div>
</template>
<script>
import api from '../../config';
export default {
  name:'UploadFile',
  data() {
    return {
      selectedFile:null
    };
  },
  methods: {
    async handleFileSelection(event) {
      this.selectedFile = event.target.files[0];
      if(this.selectedFile){
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        await this.upload(formData)
      }
    },
    upload(formData){
      return new Promise((resolve, reject) => {
        api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        )
          .then(response => {
            console.log(response)
            const data = response.data
            this.$emit('assign-data',data)
            resolve(response)
          })
          .catch(error => {
            console.error(error);
            reject(error)
          });
      })

    }
  }
};
</script>
<style>

.upload-container {
  display: flex;
  align-items: center;
}

.file-input {
  display: none;
}

.file-label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.file-label:hover {
  background-color: #e0e0e0;
}

.file-icon {
  margin-right: 0.5rem;
}

.file-name {
  margin-left: 1rem;
  font-size: 14px;
  color: #777;
}
</style>