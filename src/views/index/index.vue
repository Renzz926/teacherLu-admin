<template>
  <div class="index-conntainer">
    <div class="content">
      <el-card class="card">
        <template #header>
          <h2 class="title">数据模型</h2>
        </template>
        <div class="card-body" :class="{ mobile: isMobile }">
          <div class="tit">数据模型总数： {{ state.indexCount }}</div>
          <el-row class="modelrow" justify="space-around" :gutter="0">
            <el-col v-for="(item, index) in modelList" :key="index" :span="4">
              <div
                :style="{ background: `url(${getSrc(item.bg)})`, backgroundSize: '100% 100%' }"
                class="modelitem"
              >
                <div class="num">
                  <CountTo
                    class="count"
                    :startVal="0"
                    :endVal="state[item.code]"
                    :duration="2000"
                  ></CountTo
                ></div>
                <div class="percent">+0%</div>
              </div>
            </el-col>
          </el-row>
          <el-row justify="space-around" :gutter="20">
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">数据存储总量</div>
                <div class="value"
                  ><span>
                    <CountTo
                      class="count"
                      :startVal="0"
                      :endVal="totalCount"
                      :duration="2000"
                    ></CountTo></span
                  >GB</div
                >
              </div>
            </el-col>
            <el-col class="split1" :span="1">
              <div class="split"></div>
            </el-col>
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">接口服务数量</div>
                <div class="value"
                  ><span>
                    <CountTo
                      class="count"
                      :startVal="0"
                      :endVal="state.interfaceCount"
                      :duration="2000"
                    ></CountTo></span
                  >个</div
                ></div
              >
            </el-col>
            <el-col class="split1" :span="1">
              <div class="split"></div>
            </el-col>
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">接口实时总调用次数</div>
                <div class="value"
                  ><span>
                    <CountTo
                      class="count"
                      :startVal="0"
                      :endVal="0"
                      :duration="2000"
                    ></CountTo></span></div
              ></div>
            </el-col>
            <el-col class="split1" :span="1">
              <div class="split"></div>
            </el-col>
            <el-col :span="4">
              <div class="overviewitem">
                <div class="text">支撑项目</div>
                <div class="value"
                  ><span>
                    <CountTo
                      class="count"
                      :startVal="0"
                      :endVal="state.ProjectRequirementCountName.length"
                      :duration="2000"
                    ></CountTo></span
                  >个</div
                ></div
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
            <div
              class="card-body"
              style="height: 330px; overflow: scroll"
              :class="{ mobile: isMobile }"
            >
              <div v-for="(item, index) in state.top10ApiData" :key="index">
                <div class="skill-title">{{ item.apiName }}</div>
                <el-progress
                  :stroke-width="8"
                  :format="() => item.num"
                  :percentage="
                    (item.num / (Math.max(...state.top10ApiData.map((item) => item.num)) + 100)) *
                    100
                  "
                  color="#4339F2"
                ></el-progress>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
          <el-card class="card">
            <template #header>
              <h2 class="title">数据分层数量</h2>
            </template>
            <div
              v-if="Object.keys(state.tableCountOptions).length > 0"
              class="card-body"
              style="height: 330px"
              :class="{ mobile: isMobile }"
            >
              <Echarts
                :index="1"
                :style="{
                  height: '100%',
                  width: '100%',
                }"
                :options="state.tableCountOptions"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="7">
          <el-card class="card">
            <template #header>
              <h2 class="title">图表1</h2>
            </template>
            <div class="card-body" style="height: 330px" :class="{ mobile: isMobile }">
              <!-- <Echarts
                :index="2"
                :style="{
                  height: '100%',
                  width: '100%',
                }"
                :options="{
                  xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  },
                  yAxis: {
                    type: 'value',
                  },
                  series: [
                    {
                      data: [120, 200, 150, 80, 70, 110, 130],
                      type: 'bar',
                    },
                  ],
                }"
              /> -->
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
import { indexApi } from '@/api/index.js';
import { useI18n } from 'vue-i18n';
import { getSrc } from '@/utils';
import { modelList } from './config';
import { useStore } from 'vuex';
const store = useStore();

const { t } = useI18n();

const state = reactive({
  jcCount: 0,
  tagsCount: 0,
  relationshipCount: 0,
  dimCount: 0,
  interfaceCount: 0,
  indexCount: 0,
  ProjectRequirementCount: [],
  ProjectRequirementCountName: [],
  top10ApiData: [],
  tableCountOptions: {},
});
const avatar = ref('https://i.gtimg.cn/club/item/face/img/2/15922_100.gif');
const totalCount = ref(0);

// 获取基础模型
const getJcCount = () => {
  indexApi({ script: 'index/count/jc' })
    .then((res) => {
      state.jcCount = res.data;
    })
    .catch((err) => {});
};
//获取标签模型
const getTagsCount = () => {
  indexApi({ script: 'index/count/tags' })
    .then((res) => {
      state.tagsCount = res.data;
    })
    .catch((err) => {});
};
//获取关系模型
const getRelationshipCount = () => {
  indexApi({ script: 'index/count/relationship' })
    .then((res) => {
      state.relationshipCount = res.data;
    })
    .catch((err) => {});
};
//获取维度模型
const getDimCount = () => {
  indexApi({ script: 'index/count/dim' })
    .then((res) => {
      state.dimCount = res.data;
    })
    .catch((err) => {});
};
//获取接口数量
const getInterfaceCount = () => {
  indexApi({ script: 'index/count/interface' })
    .then((res) => {
      state.interfaceCount = res.data;
    })
    .catch((err) => {});
};
//获取数据模型
const getIndexCount = () => {
  indexApi({ script: 'index/count' })
    .then((res) => {
      state.indexCount = res.data;
    })
    .catch((err) => {});
};
//获取总数据量
const getTotalCount = () => {
  indexApi({ script: 'index/count/tableData' })
    .then((res) => {
      totalCount.value = Math.floor(res.data * 100) / 100;
    })
    .catch((err) => {});
};
//获取项目需求量 创建图表
const getProjectRequirementCount = () => {
  indexApi({ script: 'index/count/projectRequirementCount' }).then(({ data }) => {
    state.ProjectRequirementCount = data.reverse();
    //获取原表中所有projectName
    state.ProjectRequirementCountName = state.ProjectRequirementCount.map(
      (item) => item.projectName
    );
  });
};
//获取接口调用前十 创建图表
const getTop10ApiCount = () => {
  indexApi({ script: 'index/count/apicountlimit10' }).then((res) => {
    state.top10ApiData = res.data;
  });
};

//获取各层表数量
const getTableCount = () => {
  indexApi({ script: 'index/count/table' }).then((res) => {
    state.tableCountOptions = {
      xAxis: {
        type: 'category',
        axisLine: { show: false },
        splitLine: { show: false },
        data: Object.keys(res.data),
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
      },
      series: [
        {
          data: Object.keys(res.data).map((item) => res.data[item]),
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            color: 'rgba(205, 163, 67, 0.79)',
          },
        },
      ],
    };
  });
};

const yAxis = reactive({
  type: 'value',
});

const isMobile = computed(() => {
  return store.getters['setting/isMobile'];
});

onBeforeMount(() => {
  getTableCount();
  getIndexCount();
  getRelationshipCount();
  getJcCount();
  getTagsCount();
  getDimCount();
  getInterfaceCount();
  getTotalCount();
  getProjectRequirementCount();
  getTop10ApiCount();
});
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
          position: relative;
          // width: 218px;
          height: 90px;
          text-align: center;
          border-radius: 2px;
          .num {
            position: absolute;
            right: 10px;
            top: 10px;
            font-weight: 600;
            font-size: 30px;
            color: #fff;
          }
          .percent {
            position: absolute;
            right: 16px;
            bottom: 10px;
            font-size: 20px;
          }
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
