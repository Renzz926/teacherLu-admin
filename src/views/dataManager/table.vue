<template>
  <div class="app-container">
    <el-form
      :model="state.queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="所在空间" prop="appGuid">
        <el-input
          v-model="state.queryParams.appGuid"
          placeholder="所在空间"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="state.queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="表描述" prop="tableDesc">
        <el-input
          v-model="state.queryParams.tableDesc"
          placeholder="请输入表描述"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="创建者" prop="ownerId">
        <el-input
          v-model="state.queryParams.ownerId"
          placeholder="请输入表所有者的云账号"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="state.tableList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="所在空间" align="center" prop="appGuid" />
      <el-table-column label="表名称" align="center" prop="tableName" />
      <el-table-column label="表描述" align="center" prop="tableDesc" />
      <el-table-column label="表所有者的云账号" align="center" prop="ownerId" />
      <el-table-column label="生命周期" align="center" prop="lifeCycle" />
      <el-table-column label="最后表的更新时间" align="center" prop="lastDdlTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastDdlTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" align="center" prop="lastModifyTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastModifyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="gmtCreateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.gmtCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page="state.queryParams.pageNum"
      :limit="state.queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup>
  import { listTable, getTable, delTable, addTable, updateTable, exportTable } from '@/api/table';
  import { ref, reactive, getCurrentInstance } from 'vue';
  import { ElMessageBox } from 'element-plus';
  const loading = ref(true);
  const exportLoading = ref(false);
  const single = ref(true);
  const multiple = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const title = ref('');
  const open = ref(false);
  const state = reactive({
    ids: [],
    tableList: [],
    queryParams: {
      pageNum: 1,
      pageSize: 20,
      appGuid: null,
      tableName: null,
      tableGuid: null,
      srcType: null,
      tableDesc: null,
      labels: null,
      hasPart: null,
      ownerId: null,
      isVisible: null,
      lifeCycle: null,
      dataSize: null,
      lastDdlTime: null,
      lastModifyTime: null,
      gmtCreateTime: null,
    },
    form: {},
    rules: {
      appGuid: [{ required: true, message: '表所在项目的标识不能为空', trigger: 'blur' }],
      tableName: [{ required: true, message: '表名称不能为空', trigger: 'blur' }],
      tableGuid: [{ required: true, message: '表唯一标识不能为空', trigger: 'blur' }],
      gmtCreateTime: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
    },
  });
  const { ctx } = getCurrentInstance();
  const { download, msgSuccess } = ctx._.appContext.config.globalProperties;
  const getList = () => {
    loading.value = true;
    listTable(state.queryParams).then((response) => {
      state.tableList = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  };
  getList();
  const cancel = () => {
    open.value = false;
    reset();
  };
  // 表单重置
  const reset = () => {
    state.form = {
      id: null,
      appGuid: null,
      tableName: null,
      tableGuid: null,
      srcType: null,
      tableDesc: null,
      labels: null,
      hasPart: null,
      ownerId: null,
      isVisible: null,
      lifeCycle: null,
      dataSize: null,
      createTime: null,
      lastDdlTime: null,
      lastModifyTime: null,
      gmtCreateTime: null,
    };
    resetForm('form');
  };
  /** 搜索按钮操作 */
  const handleQuery = () => {
    state.queryParams.pageNum = 1;
    getList();
  };
  /** 重置按钮操作 */
  const resetQuery = () => {
    resetForm('queryForm');
    handleQuery();
  };

  // 多选框选中数据
  const handleSelectionChange = (selection) => {
    ids.value = selection.map((item) => item.id);
    single.value = selection.length !== 1;
    multiple.value = !selection.length;
  };
  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    open.value = true;
    title.value = '添加dw信息';
  };
  /** 修改按钮操作 */
  const handleUpdate = (row) => {
    reset();
    const id = row.id || state.ids;
    getTable(id).then((response) => {
      state.form = response.data;
      open.value = true;
      title.value = '修改dw信息';
    });
  };
  /** 提交按钮 */
  const submitForm = () => {
    this.$refs['form'].validate((valid) => {
      if (valid) {
        if (state.form.id != null) {
          updateTable(state.form).then((response) => {
            msgSuccess('修改成功');
            open.value = false;
            getList();
          });
        } else {
          addTable(state.form).then((response) => {
            msgSuccess('新增成功');
            open.value = false;
            getList();
          });
        }
      }
    });
  };
  /** 删除按钮操作 */
  const handleDelete = (row) => {
    const ids = row.id || state.ids;
    ElMessageBox.confirm('是否确认删除dw信息编号为"' + ids + '"的数据项??')
      .then(function () {
        return delTable(ids);
      })
      .then(() => {
        getList();
        msgSuccess('删除成功');
      })
      .catch(() => {});
  };
  /** 导出按钮操作 */
  const handleExport = () => {
    const queryParams = state.queryParams;
    ElMessageBox.confirm('是否确认导出所有dw信息数据项?')
      .then(() => {
        texportLoading.vaule = true;
        return exportTable(queryParams);
      })
      .then((response) => {
        download(response.msg);
        texportLoading.vaule = false;
      })
      .catch(() => {});
  };
</script>
