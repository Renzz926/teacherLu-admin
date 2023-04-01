<template>
  <div class="index-conntainer">
    <div class="content">
      <el-card class="card">
        <template #header>
          <h2 class="title">数据模型</h2>
        </template>
        <div class="card-body" :class="{ mobile: isMobile }">
          <div class="tit">数据模型总数： 123</div>
          <el-row class="modelrow" justify="space-around" :gutter="20">
            <el-col v-for="(item, index) in modelList" :key="index" :span="4">
              <div :style="{ background: item.color }" class="modelitem">{{ item.name }}</div>
            </el-col>
          </el-row>
          <el-row justify="space-around" :gutter="20">
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">数据存储总量</div>
                <div class="value"><span>10</span>GB</div>
              </div>
            </el-col>
            <el-col class="split1" :span="1">
              <div class="split"></div>
            </el-col>
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">接口服务数量</div> <div class="value"><span>10</span>个</div></div
              >
            </el-col>
            <el-col class="split1" :span="1">
              <div class="split"></div>
            </el-col>
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">接口实时总调用次数</div>
                <div class="value"><span>10</span></div></div
              >
            </el-col>
            <el-col class="split1" :span="1">
              <div class="split"></div>
            </el-col>
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">支撑项目</div> <div class="value"><span>10</span>个</div></div
              >
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="7">
          <el-card class="card">
            <template #header>
              <h2 class="title">实时接口调用量 top 10</h2>
            </template>
            <div class="card-body" :class="{ mobile: isMobile }">
              <Echarts
                :index="1"
                headerIcon="icon-chart-line"
                :style="{
                  height: '200px',
                }"
                :options="{
                  series: series2,
                  xAxis,
                  yAxis,
                  toolbox,
                }"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
          <el-card class="card">
            <template #header>
              <h2 class="title">数据分层数量</h2>
            </template>
            <div class="card-body" :class="{ mobile: isMobile }">
              <Echarts
                :index="1"
                headerIcon="icon-chart-line"
                :style="{
                  height: '200px',
                }"
                :options="{
                  series: series2,
                  xAxis,
                  yAxis,
                  toolbox,
                }"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="7">
          <el-card class="card">
            <template #header>
              <h2 class="title">图表1</h2>
            </template>
            <div class="card-body" :class="{ mobile: isMobile }">
              <Echarts
                :index="1"
                headerIcon="icon-chart-line"
                :style="{
                  height: '200px',
                }"
                :options="{
                  series: series2,
                  xAxis,
                  yAxis,
                  toolbox,
                }"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
  };
</script>

<script setup>
  import { ref, computed, reactive, onBeforeMount } from 'vue';

  import { CountTo } from 'vue3-count-to';
  import Echarts from '@/components/Echarts/index.vue';

  import { useI18n } from 'vue-i18n';
  import { modelList } from './config';
  import { useStore } from 'vuex';
  const store = useStore();

  const { t } = useI18n();

  const state = reactive({});
  const avatar = ref('https://i.gtimg.cn/club/item/face/img/2/15922_100.gif');

  const series2 = reactive([
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
    },
  ]);

  const xAxis = reactive({
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });

  const yAxis = reactive({
    type: 'value',
  });

  const toolbox = reactive({
    show: true,
  });

  const isMobile = computed(() => {
    return store.getters['setting/isMobile'];
  });

  onBeforeMount(() => {});
</script>

<style lang="scss" scoped>
  .index-conntainer {
    width: $base-width;
    .content {
      margin: 16px 0;
      .tit {
        position: relative;
        padding-left: 15px;
        font-weight: 500;
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 30px;
        color: #4763e4;
        &::before {
          position: absolute;
          top: 3px;
          left: 0px;
          content: '';
          width: 3px;
          height: 16px;
          background-color: #4763e4;
        }
      }

      .count-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
          display: flex;
          flex-direction: column;
          text-align: center;
          .label {
            padding: 10px 0;
            font-size: $base-font-size-big;
          }
          .count {
            font-size: $base-font-size-max;
            font-weight: bolder;
            color: $base-color-primary;
            &.error {
              color: var(--el-color-danger);
            }
            &.success {
              color: var(--el-color-success);
            }
          }
        }
      }
      .title {
        margin: 0;
      }
      .skill-title {
        padding: 10px 0;
        font-weight: 500;
      }
      .card {
        margin-bottom: 16px;
        &-body {
          .modelitem {
            width: 218px;
            line-height: 90px;
            height: 90px;
            text-align: center;
            border-radius: 2px;
          }
          .split1 {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .split {
            width: 1px;
            height: 40px;
            background-color: #6d6d76;
          }
          .overviewitem {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            .text {
              font-size: 16px;
              color: #aaaaaa;
              margin-bottom: 20px;
            }
            .value {
              font-size: 16px;
              display: flex;
              align-items: center;
              color: #aaaaaa;
              span {
                font-size: 32px;
                line-height: 45px;
                color: #8da2fb;
              }
            }
          }
        }
      }
      .modelrow {
        margin-bottom: 50px;
      }
    }
  }
</style>
