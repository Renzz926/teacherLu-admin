<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="表英文名" prop="tableEn">
        <el-input
          v-model="queryParams.tableEn"
          placeholder="表英文名"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表中文名" prop="tableCn">
        <el-input
          v-model="queryParams.tableCn"
          placeholder="表中文名"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段中文名" prop="colunmCn">
        <el-input
          v-model="queryParams.colunmCn"
          placeholder="字段中文名"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段值" prop="typeValue">
        <el-input
          v-model="queryParams.typeValue"
          placeholder="字段值"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段中文名2" prop="columnCn">
        <el-input
          v-model="queryParams.columnCn"
          placeholder="字段中文名2"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段值" prop="colunmValues">
        <el-input
          v-model="queryParams.colunmValues"
          placeholder="字段值"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="字段中文名" prop="colunmnDiscri">
        <el-input
          v-model="queryParams.colunmnDiscri"
          placeholder="字段中文名"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
          v-hasPermi="['education_code:education_code:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['education_code:education_code:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['education_code:education_code:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['education_code:education_code:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="education_codeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表英文名" align="center" prop="tableEn" />
      <el-table-column label="表中文名" align="center" prop="tableCn" />
      <el-table-column label="字段中文名" align="center" prop="colunmCn" />
      <el-table-column label="字段值" align="center" prop="typeValue" />
      <el-table-column label="字段中文名2" align="center" prop="columnCn" />
      <el-table-column label="字段值" align="center" prop="colunmValues" />
      <el-table-column label="字段英文值" align="center" prop="colunmValuesInternation" />
      <el-table-column label="字段编码" align="center" prop="colunmnDiscri" />
      <el-table-column label="备注" align="center" prop="mark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['education_code:education_code:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['education_code:education_code:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page="queryParams.pageNum"
      :limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改教育厅码值对话框 -->
    <el-dialog :title="title" :visible="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="tableEn">
          <el-input v-model="form.tableEn" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="tableCn">
          <el-input v-model="form.tableCn" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="colunmCn">
          <el-input v-model="form.colunmCn" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="typeValue">
          <el-input v-model="form.typeValue" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="columnCn">
          <el-input v-model="form.columnCn" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="colunmValues">
          <el-input v-model="form.colunmValues" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="colunmValuesInternation">
          <el-input v-model="form.colunmValuesInternation" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="colunmnDiscri">
          <el-input v-model="form.colunmnDiscri" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="mark">
          <el-input v-model="form.mark" placeholder="请输入${comment}" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEducation_code, getEducation_code, delEducation_code, addEducation_code, updateEducation_code, exportEducation_code } from "@/api/education_code";

export default {
  name: "Education_code",
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
      // 教育厅码值表格数据
      education_codeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableEn: null,
        tableCn: null,
        colunmCn: null,
        typeValue: null,
        columnCn: null,
        colunmValues: null,
        colunmValuesInternation: null,
        colunmnDiscri: null,
        mark: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询教育厅码值列表 */
    getList() {
      this.loading = true;
      listEducation_code(this.queryParams).then(response => {
        this.education_codeList = response.rows;
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
        tableEn: null,
        tableCn: null,
        colunmCn: null,
        typeValue: null,
        columnCn: null,
        colunmValues: null,
        colunmValuesInternation: null,
        colunmnDiscri: null,
        mark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tableEn)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教育厅码值";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tableEn = row.tableEn || this.ids
      getEducation_code(tableEn).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教育厅码值";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.tableEn != null) {
            updateEducation_code(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEducation_code(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tableEns = row.tableEn || this.ids;
      this.$confirm('是否确认删除教育厅码值编号为"' + tableEns + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEducation_code(tableEns);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有教育厅码值数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportEducation_code(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
