<template>
<el-form-item label="增加附件" prop="climb_cert" label-width="164px">
    <el-upload
      ref="upload"
      class="upload-demo"
      action="api/files_process/"
      :http-request="fileUpload"
      :file-list="fileList"
      :auto-upload="true"
      :show-file-list="true"
    >
      <el-button size="small" type="primary" @click="setName('climb_cert')">点击上传</el-button>
    </el-upload>
  </el-form-item>
</template>


<script>
export default {
  data() {
    return {
      fileName: '',
      fileList:[],
      calculatType: 'type',
    }
},
methods: {
    setName(name) {
      this.fileName = name
    },
    fileUpload(param) {
      const loading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fd = new FormData()
      fd.append('file', param.file)// 传文件
      fd.append('type', this.calculatType)// 传文件
      this.$axios({
        method: 'post',
        url: '/api/upload',
        headers: {
          'Authorization': this.token,
          'content-type': 'multipart/form-data; boundary=<calculated when request is sent>'
        },
        data: fd
      }).then(res => {
        console.log(res)
        loading.close()
      })
    },
}
}
</script>