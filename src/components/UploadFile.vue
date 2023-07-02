<template>
  <div class="upload-container">
    <input type="file" id="fileInput" @change="handleFileSelection" class="file-input" />
    <label for="fileInput" class="file-label">
      <span class="file-icon">
        <i class="fas fa-cloud-upload-alt"></i>
      </span>
      <span class="file-text">{{ buttonText }}</span>
    </label>
    <span id="fileName" class="file-name">
      {{ fileName }}
      <span v-if="isUploading" class="upload-status">Uploading...</span>
      <span v-else class="upload-status">Ready to upload</span>
    </span>
  </div>
</template>

<script>
import api from '../../config';

export default {
  name: 'UploadFile',
  data() {
    return {
      selectedFile: null,
      fileName: 'No file selected',
      buttonText: 'Select File',
      isUploading: false
    };
  },
  methods: {
    async handleFileSelection(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.fileName = this.selectedFile.name;
        this.buttonText = 'Change File';
        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        await this.upload(formData);

        this.isUploading = false;
      }
    },
    upload(formData) {
      return new Promise((resolve, reject) => {
        api
          .post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            const data = response.data;
            this.$emit('assign-data', data);
            resolve(response);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });
    }
  }
};
</script>

<style>
.upload-container {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.file-input {
  display: none;
}

.file-label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.file-label:hover {
  background-color: #0056b3;
}

.file-icon {
  margin-right: 1rem;
  font-size: 24px;
}

.file-name {
  margin-left: 2rem;
  font-size: 16px;
  color: #777;
}

.upload-status {
  font-weight: bold;
  color: #007bff;
  margin-left: 1rem;
  font-size: 14px;
  background-color: #eaf5ff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
</style>