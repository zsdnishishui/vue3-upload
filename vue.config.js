const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: "./",
  productionSourceMap: false,
  
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
        },
        javascriptEnabled: true,
      }
    }
  },
  outputDir: './dist',
  devServer: {
    port: 3001, // 前端端口
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9300',  // 后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

  lintOnSave: undefined
})

