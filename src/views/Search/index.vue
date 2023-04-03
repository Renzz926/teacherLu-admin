<template>
  <div class="content">
    <div style="width: 50%" class="search_index">
      <el-input class="input1" v-model="input1"></el-input>
      <el-button
        type="primary"
        style="margin-left: 10px"
        @click="search_qiye"
        v-on:keyup.enter="enterSearch"
        >企业搜索</el-button
      >
    </div>

    <div style="margin: 0 30px 0 15px; margin-top: 5px" v-show="show1">
      <el-table border :data="qiye_list" stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="企业名称" prop="dwmc">
          <template #default="scope">
            <div v-html="scope.row.dwmc"></div>
          </template>
        </el-table-column>
        <el-table-column label="社会统一信用代码" prop="uscc">
          <template #default="scope">
            <div v-html="scope.row.uscc"></div>
          </template>
        </el-table-column>
        <el-table-column label="经营地址" prop="jydz">
          <template #default="scope">
            <div v-html="scope.row.jydz"></div>
          </template>
        </el-table-column>
        <el-table-column label="行业大类" prop="hydl">
          <template #default="scope">
            <div v-html="scope.row.hydl"></div>
          </template>
        </el-table-column>
        <el-table-column label="行业小类" prop="hyxl">
          <template #default="scope">
            <div v-html="scope.row.hyxl"></div>
          </template>
        </el-table-column>
        <el-table-column label="职工人数">
          <template #default="scope">
            <div
              class="downNum"
              size="mini"
              type="success"
              @click="showDetail(scope.row)"
              v-html="scope.row.p_num"
            ></div>
          </template>
        </el-table-column>
        <el-table-column label="法人姓名">
          <template #default="scope">
            <div
              class="downNum"
              size="mini"
              type="success"
              @click="showDetail2(scope.row)"
              v-html="scope.row.legal_rep"
            ></div>
          </template>
        </el-table-column>
        <el-table-column label="法人电话">
          <template #default="scope">
            <div v-html="scope.row.legal_rep_tel"></div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        v-if="state.qiye_list.length > 0 || current > 1"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="size"
        :pager-count="15"
        :total="total"
        layout="total, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Search',
  };
</script>
<script setup>
  import { tagsApi } from '@/api/tags';
  import { useRouter } from 'vue-router';
  import { ref, reactive } from 'vue';

  const router = useRouter();
  const input1 = ref('');
  const current = ref(1);
  const size = ref(15);
  const total = ref(0);
  const show1 = ref(false);
  const state = reactive({
    qiye_list: [],
  });
  //回车搜索
  const enterSearch = () => {
    document.onkeyup = (e) => {
      if (e.keyCode === 13) {
        search_qiye();
      }
    };
  };
  enterSearch();

  const initial = () => {
    show1.value = false;
    input1.value = '';
  };

  const search_qiye = () => {
    show1.value = true;
    //获取数据的接口
    tagsApi({
      script: 'es/qiyebasicinfo',
      search: input1.value,
      size: size.value,
      current: current.value,
    }).then((res) => {
      state.qiye_list = res.records;
      total.value = res.total;
    });
  };

  const handleCurrentChange = (page) => {
    search_qiye();
  };

  const showDetail = (row) => {
    router.push({ path: '/relationship/index', query: { uscc: row.uscc } });
  };
  const showDetail2 = (row) => {
    router.push({
      path: '/tags/tagsearch',
      query: { searchIdcard: row.legal_rep_idcard },
    });
  };
</script>

<style lang="scss" scoped>
  .content {
    box-sizing: border-box;
    .search_index {
      display: flex;
    }
    .input1 {
      width: 1000px;
      border-color: #1890ff;
      border-style: solid;
    }
    .downNum {
      text-decoration: underline;
      color: #1890ff;
      cursor: pointer;
    }
  }
</style>
