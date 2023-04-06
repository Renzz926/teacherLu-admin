<template>
  <div class="app-container">
    <el-form
      :model="state.queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="字段名" prop="colunmName">
        <el-input
          v-model="state.queryParams.colunmName"
          placeholder="请输入字段名"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段值" prop="columnValue">
        <el-input
          v-model="state.queryParams.columnValue"
          placeholder="请输入字段值"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="释义" prop="columnDescreption">
        <el-input
          v-model="state.queryParams.columnDescreption"
          placeholder="请输入释义"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['social_insurance_code:social_insurance_code:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['social_insurance_code:social_insurance_code:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['social_insurance_code:social_insurance_code:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['social_insurance_code:social_insurance_code:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar :showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="state.social_insurance_codeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字段名" align="center" prop="colunmName" />
      <el-table-column label="字段值" align="center" prop="columnValue" />
      <el-table-column label="释义" align="center" prop="columnDescreption" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['social_insurance_code:social_insurance_code:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['social_insurance_code:social_insurance_code:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改社保缴纳码值对话框 -->
    <el-dialog :title="title" :visible="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="state.rules" label-width="80px">
        <el-form-item label="字段名" prop="colunmName">
          <el-input v-model="form.colunmName" placeholder="请输入字段名" />
        </el-form-item>
        <el-form-item label="字段值" prop="columnValue">
          <el-input v-model="form.columnValue" placeholder="请输入字段值" />
        </el-form-item>
        <el-form-item label="释义" prop="columnDescreption">
          <el-input v-model="form.columnDescreption" placeholder="请输入释义" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import {
    listSocial_insurance_code,
    getSocial_insurance_code,
    delSocial_insurance_code,
    addSocial_insurance_code,
    updateSocial_insurance_code,
    exportSocial_insurance_code,
  } from '@/api/social_insurance_code';
  import { ElMessageBox } from 'element-plus';
  import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
  const { ctx } = getCurrentInstance();
  const { msgSuccess, resetForm, download, msgError } = ctx._.appContext.config.globalProperties;
  const loading = ref(true);
  const single = ref(true);
  const multiple = ref(true);
  const showSearch = ref(true);
  const exportLoading = ref(false);
  const open = ref(false);
  const total = ref(0);
  const title = ref('');
  const queryForm = ref(null);
  const form = ref(null);

  const state = reactive({
    ids: [],
    social_insurance_codeList: [],
    queryParams: {
      pageNum: 1,
      pageSize: 10,
      colunmName: null,
      columnValue: null,
      columnDescreption: null,
    }, // 表单参数
    form: {},
    // 表单校验
    rules: {},
  });

  /** 查询社保缴纳码值列表 */
  const getList = () => {
    loading.value = true;
    listSocial_insurance_code(state.queryParams).then((response) => {
      state.social_insurance_codeList = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  };
  getList();
  // 取消按钮
  const cancel = () => {
    open.value = false;
    reset();
  };
  // 表单重置
  const reset = () => {
    state.form = {
      colunmName: null,
      columnValue: null,
      columnDescreption: null,
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
    ids.value = selection.map((item) => item.colunmName);
    single.value = selection.length !== 1;
    multiple.value = !selection.length;
  };
  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    open.value = true;
    title.value = '添加社保缴纳码值';
  };
  /** 修改按钮操作 */
  const handleUpdate = (row) => {
    reset();
    const colunmName = row.colunmName || ids.value;
    getSocial_insurance_code(colunmName).then((response) => {
      state.form = response.data;
      open.value = true;
      title.value = '修改社保缴纳码值';
    });
  };
  /** 提交按钮 */
  const submitForm = () => {
    form.value.validate((valid) => {
      if (valid) {
        if (state.form.colunmName != null) {
          updateSocial_insurance_code(state.form).then((response) => {
            msgSuccess('修改成功');
            open.value = false;
            getList();
          });
        } else {
          addSocial_insurance_code(state.form).then((response) => {
            msgSuccess('新增成功');
            openmsgSuccess = false;
            getList();
          });
        }
      }
    });
  };
  /** 删除按钮操作 */
  const handleDelete = (row) => {
    const colunmNames = row.colunmName || ids.value;
    ElMessageBox.confirm('是否确认删除社保缴纳码值编号为"' + colunmNames + '"的数据项?')
      .then(function () {
        return delSocial_insurance_code(colunmNames);
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
    ElMessageBox.confirm('是否确认导出所有社保缴纳码值数据项?')
      .then(() => {
        exportLoading.value = true;
        return exportSocial_insurance_code(queryParams);
      })
      .then((response) => {
        download(response.msg);
        exportLoading.value = false;
      })
      .catch(() => {});
  };
</script>
