<template>
  <div class="main">
    <div style="margin: 15px">
      <el-input
        class="searchbar"
        placeholder="请输入街道名称"
        prefix-icon="el-icon-user"
        v-model="street"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-input
        class="searchbar"
        placeholder="请输入社区名称"
        prefix-icon="el-icon-user"
        v-model="community"
        style="width: 200px; margin-right: 10px"
      >
      </el-input
      ><el-input
        class="searchbar"
        placeholder="请输入户籍名称"
        prefix-icon="el-icon-user"
        v-model="hjName"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-input
        class="searchbar"
        placeholder="请输入标准名称"
        prefix-icon="el-icon-user"
        v-model="standardName"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-input
        class="searchbar"
        placeholder="请输入社工叫法"
        prefix-icon="el-icon-user"
        v-model="sgName"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-button
        type="primary"
        size="medium"
        :icon="Search"
        @click="searchClick"
        v-on:keyup.enter="enterSearch"
        >查询</el-button
      >
      <el-button size="medium" type="success" :icon="Plus" @click="addClick">新建</el-button>
    </div>
    <div style="margin: 0 30px 0 15px">
      <el-table border :data="state.configList" stripe>
        <el-table-column label="id" type="index" />
        <el-table-column label="街道" prop="street" />
        <el-table-column label="社区" prop="community" />
        <el-table-column label="户籍名称" prop="hjName" />
        <el-table-column label="标准名称" prop="standardName" />
        <el-table-column label="社工叫法" prop="sgName" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-tooltip content="编辑设置" placement="bottom">
              <el-button
                circle
                :icon="Edit"
                size="mini"
                type="success"
                @click="configEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除设置" placement="bottom">
              <el-popconfirm @confirm="deleteConfig(scope.row)" title="确定要删除吗？">
                <template #reference>
                  <el-button size="mini" circle :icon="Delete" type="danger"></el-button>
                </template>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; float: right"
        v-model:current-page="current"
        v-model:page-size="select"
        :page-sizes="[15, 25, 35, 50]"
        :background="background"
        layout="total, sizes, prev, pager, next jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog :visible="addConfigVisible">
      <el-form ref="myconfigForm" :model="configForm" label-width="130px" :inline="true">
        <el-form-item label="街道" prop="street">
          <el-input v-model="configForm.street" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="社区" prop="community">
          <el-input v-model="configForm.community" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="户籍名称" prop="hjName">
          <el-input v-model="configForm.hjName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="标准名称" prop="standardName">
          <el-input v-model="configForm.standardName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="社工叫法" prop="sgName">
          <el-input v-model="configForm.sgName" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <el-button type="success" style="width: 200px" @click="saveClick">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
  import { tagsApi } from '@/api/tags';
  import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
  import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
  import { useStore } from 'vuex';
  const store = useStore();
  const { ctx } = getCurrentInstance();
  const { msgSuccess, msgError } = ctx._.appContext.config.globalProperties;
  const addConfigVisible = ref(false);
  const username = ref('');
  const standardName = ref('');
  const ds = ref('');
  const community = ref('');
  const street = ref('');
  const hjName = ref('');
  const sgName = ref('');
  const dimId = ref(0);
  const loading = ref(false);
  const myconfigForm = ref(null);
  const current = ref(1);
  const select = ref(15);
  const total = ref(0);
  const state = reactive({
    resultList: [],
    configList: [],
    searchList: [],
    configForm: {
      id: '',
      street: '',
      community: '',
      hjName: '',
      standardName: '',
      sgName: '',
    },
  });
  const handleSizeChange = (val) => {
    console.log(`${val} items per page`);
  };
  onMounted(() => {
    username.value = store.getters['user/username'];
    searchClick();
  });

  const getList = () => {
    tagsApi({ script: 'dim/eighbour/alias/list', account: username.value })
      .then(({ data }) => {
        state.configList = data.records;
      })
      .catch((err) => {});
  };
  // const dateClick = () => {
  //   tagsApi({
  //     script: 'dim/eighbour/alias/list',
  //     id: dimId.value,
  //     ds: ds.value,
  //   })
  //     .then((res) => {
  //       state.resultList = res;
  //     })
  //     .catch((err) => {});
  // };
  // const showResult = (row) => {
  //   dimId.value = row.id;
  //   tagsApi({ script: 'dim/eighbour/alias/list', id: dimId.value })
  //     .then((res) => {
  //       state.resultList = res;
  //     })
  //     .catch((err) => {});
  // };
  const configEdit = (row) => {
    addConfigVisible.value = true;
    state.configForm = row;
  };
  const deleteConfig = (row) => {
    tagsApi({ script: 'dim/eighbour/alias/delete', id: row.id })
      .then((res) => {
        msgSuccess('删除成功');
        getList();
      })
      .catch((err) => {});
  };
  const addClick = () => {
    addConfigVisible.value = true;
    state.configForm.id = '';
    state.configForm.street = '';
    state.configForm.community = '';
    state.configForm.hjName = '';
    state.configForm.standardName = '';
    state.configForm.sgName = '';
  };
  const saveClick = () => {
    myconfigForm.value.validate((valid) => {
      if (valid) {
        if (state.configForm.id == 0) {
          state.configForm.account = username.value;
          state.configForm.script = 'dim/eighbour/alias/add';
          tagsApi(state.configForm)
            .then((res) => {
              addConfigVisible.value = false;
              msgSuccess('添加成功');
              getList();
            })
            .catch((err) => {});
        } else {
          state.configForm.script = 'dim/eighbour/alias/update';
          tagsApi(state.configForm)
            .then((res) => {
              addConfigVisible.value = false;
              msgSuccess('修改成功');
              getList();
            })
            .catch((err) => {});
        }
      } else {
        return false;
      }
    });
  };
  const handleCurrentChange = () => {
    searchClick();
  };
  const searchClick = () => {
    loading.value = true;
    let param = {
      script: 'dim/eighbour/alias/list',
      street: street.value,
      community: community.value,
      hjName: hjName.value,
      standardName: standardName.value,
      sgName: sgName.value,
      current: current.value,
      size: select.value,
    };
    tagsApi(param)
      .then((res) => {
        let records = res.records;
        state.configList = records;
        total.value = res.total;
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
        msgError('接口错误：' + err);
      });
  };
  //回车搜索
  const enterSearch = () => {
    document.onkeyup = (e) => {
      if (e.keyCode === 13) {
        searchClick();
      }
    };
  };
  const pageNumChange = () => {
    searchClick();
  };
  enterSearch();
</script>
<style scoped>
  .main {
    margin-left: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
</style>
