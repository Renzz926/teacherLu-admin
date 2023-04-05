import { createApp } from 'vue';

// permission 权限文件
import './config/permission';

// element
import 'element-plus/theme-chalk/display.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import App from './App.vue';
import '../public/fonts/fonts.css';
const app = createApp(App);

import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree,
} from '@/utils/ruoyi';
import { ElMessage } from 'element-plus';
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.msgSuccess = function (msg) {
  ElMessage({
    message: msg,
    type: 'success',
  });
};
app.config.globalProperties.msgError = function (msg) {
  ElMessage.error(msg);
};

import { VueClipboard } from '@soerenmartius/vue3-clipboard';
app.use(VueClipboard);

// layout components
import layoutComp from './layouts/components/export';
layoutComp(app);

// router
import router from './router/index';
app.use(router);

// vuex
import store from '@/store';
app.use(store);

// 按需注册方式
// import elementPlus from './plugin/el-comp';
// 注册 elementPlus组件/插件
// elementPlus(app);
// // 完整引入

// 注册字节跳动图标
import iconPark from './plugin/icon-park';
iconPark(app);

import loadI18n from './plugin/i18n';
loadI18n(app);

app.mount('#app');
