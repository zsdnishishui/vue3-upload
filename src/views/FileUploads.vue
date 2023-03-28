<template>
  <div class="myDiv">
    <el-upload class="upload-demo" action="#" :on-change="uploadFile" :show-file-list="true" :file-list="fileList"
      :auto-upload="false" ref="uploadfile" :limit="1">
      <el-button size="small" type="primary" :loading="loadingFile">上传文件</el-button>
    </el-upload>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
const chunkSize = 1 * 1024 * 1024;//定义分片的大小 暂定为1M，方便测试
export default {
  components: {},
  props: {},
  data() {
    return {
      fileList: [],
      loadingFile: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * 上传文件
     */
    async uploadFile(File) {
      this.loadingFile = true
      var self = this
      //获取用户选择的文件
      const file = File.raw
      this.currentFile = file
      //文件大小
      const fileSize = File.size
      let fileInfo = File.name.split(".")
      let fileName = fileInfo[0]
      let fileType = fileInfo[1]
      // 放入文件列表
      this.fileList = [{ "name": fileName }]
      // 可以设置大于多少兆可以分片上传，否则走普通上传
      if (fileSize <= chunkSize) {
        console.log("上传的文件大于1m才能分片上传")
      }
      //计算当前选择文件需要的分片数量
      const chunkCount = Math.ceil(fileSize / chunkSize)
      console.log("文件大小：", (File.size / 1024 / 1024) + "Mb", "分片数：", chunkCount)
      //获取文件md5
      const fileMd5 = await this.getFileMd5(file, chunkCount);
      console.log("文件md5：", fileMd5)

      console.log("向后端请求本次分片上传初始化")


      var num = 0
      console.log(num, '分片开始序号')
      // 当前为顺序上传方式，若要测试并发上传，请将103 行 await 修饰符删除即可
      // 循环调用上传
      for (var i = num; i < chunkCount; i++) {
        //分片开始位置
        let start = i * chunkSize
        //分片结束位置
        let end = Math.min(fileSize, start + chunkSize)
        //取文件指定范围内的byte，从而得到分片数据
        console.log(File, '0000')
        let _chunkFile = File.raw.slice(start, end)
        console.log(_chunkFile)
        console.log("开始上传第" + i + "个分片")
        let formdata = new FormData()
        // formdata.append('identifier', fileMd5)
        // formdata.append('filename', fileName)
        // formdata.append('totalChunks', chunkCount)
        // formdata.append('chunkNumber', i)
        // formdata.append('totalSize', fileSize)
        // formdata.append('file', _chunkFile)
        // 开始填充上传数据 这里需要使用 FormData 来存储信息
        formdata.append("file", _chunkFile);
        formdata.append("hash", fileMd5);
        formdata.append("filename", fileName);
        formdata.append("seq", i);
        formdata.append("type", fileType);
        formdata.append("chunkCount", chunkCount);
        formdata.append("chunkSize", chunkSize);
        // 通过await实现顺序上传
        await this.getMethods(formdata)
      }
      // 文件上传完毕，请求后端合并文件并传入参数
      self.composeFile(fileMd5, fileName, chunkCount, fileType)


    },
    /**
     * 上传文件方法
     * @param formdata 上传文件的参数
     */
    getMethods(formdata) {
      return new Promise((resolve) => {
        this.$axios.post("/api/uploadSlice", formdata).then((res) => {
          console.log(res)
          resolve();
        });


      });
    },
    /**
  * 获取文件MD5
  * @param file
  * @returns {Promise<unknown>}
  */
    getFileMd5(file, chunkCount) {
      return new Promise((resolve, reject) => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let chunks = chunkCount;
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        let fileReader = new FileReader();

        fileReader.onload = function (e) {
          spark.append(e.target.result);
          currentChunk++;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            let md5 = spark.end();
            resolve(md5);
          }
        };
        fileReader.onerror = function (e) {
          reject(e);
        };
        function loadNext() {
          let start = currentChunk * chunkSize;
          let end = start + chunkSize;
          if (end > file.size) {
            end = file.size;
          }
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
      });
    },
    /**
     * 请求后端合并文件
     * @param fileMd5 文件md5
     * @param fileName 文件名称
     * @param count 文件分片总数
     */
    composeFile(fileMd5, fileName, count, fileType) {
      console.log("开始请求后端合并文件")
      var data = {
        "hash": fileMd5, //文件的md5
        "filename": fileName, //文件名
        "count": count, //分片的总数量
        "type": fileType
      }
      this.$axios.post("/api/merge", data).then((res) => {
        const data = res.data;
        if (data.code) {
          console.log(data.message)
          this.loadingFile = false
          this.$refs.uploadfile.clearFiles()
        } else {
          this.loadingFile = false
          console.log(data.message)
        }
      }).catch(e => {
        console.log('发生错误了');
        this.loadingFile = false
        console.log(e)
      });
    },
  },
  created() { },
  mounted() { }
}
</script>
<style lang="less" scoped></style>