<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="所在空间" prop="appGuid">
        <el-input
          v-model="queryParams.appGuid"
          placeholder="所在空间"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="表描述" prop="tableDesc">
        <el-input
          v-model="queryParams.tableDesc"
          placeholder="请输入表描述"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="创建者" prop="ownerId">
        <el-input
          v-model="queryParams.ownerId"
          placeholder="请输入表所有者的云账号"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <!--      <el-table-column label="创建时间" align="center" prop="id" />-->
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="所在空间" align="center" prop="appGuid" />
      <el-table-column label="表名称" align="center" prop="tableName" />
      <!--      <el-table-column label="表唯一标识" align="center" prop="tableGuid" />-->
      <!--      <el-table-column label="来源类型，0表示ODPS" align="center" prop="srcType" />-->
      <el-table-column label="表描述" align="center" prop="tableDesc" />
      <!--      <el-table-column label="表标签" align="center" prop="labels" />-->
      <!--      <el-table-column label="是否为分区表，1表示分区表。" align="center" prop="hasPart" />-->
      <el-table-column label="表所有者的云账号" align="center" prop="ownerId" />
      <!--      <el-table-column label="是否可见，1表示可见" align="center" prop="isVisible" />-->
      <el-table-column label="生命周期" align="center" prop="lifeCycle" />
      <!--      <el-table-column label="表占用的存储空间" align="center" prop="dataSize" />-->
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
      :page="queryParams.pageNum"
      :limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { listTable, getTable, delTable, addTable, updateTable, exportTable } from '@/api/table';

  export default {
    name: 'Table',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // dw信息表格数据
        tableList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
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
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          appGuid: [{ required: true, message: '表所在项目的标识不能为空', trigger: 'blur' }],
          tableName: [{ required: true, message: '表名称不能为空', trigger: 'blur' }],
          tableGuid: [{ required: true, message: '表唯一标识不能为空', trigger: 'blur' }],
          gmtCreateTime: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询dw信息列表 */
      getList() {
        this.loading = true;
        listTable(this.queryParams).then((response) => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
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
        this.resetForm('form');
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm');
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.id);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = '添加dw信息';
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getTable(id).then((response) => {
          this.form = response.data;
          this.open = true;
          this.title = '修改dw信息';
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              updateTable(this.form).then((response) => {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              });
            } else {
              addTable(this.form).then((response) => {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除dw信息编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(function () {
            return delTable(ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess('删除成功');
          })
          .catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有dw信息数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.exportLoading = true;
            return exportTable(queryParams);
          })
          .then((response) => {
            this.download(response.msg);
            this.exportLoading = false;
          })
          .catch(() => {});
      },
    },
  };
</script>
