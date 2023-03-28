import { createRouter, createWebHashHistory } from 'vue-router'
import FileView from '../views/FileUpload.vue'
import FileViews from '../views/FileUploads.vue'
import MinioUpload from '../views/MinioUpload.vue'
const routes = [
  {
    path: '/file',
    name: 'file',
    component: FileView
  },
  {
    path: '/files',
    name: 'files',
    component: FileViews
  },
  {
    path: '/minio',
    name: 'minio',
    component: MinioUpload
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
