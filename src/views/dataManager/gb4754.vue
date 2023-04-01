<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门类" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择门类" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="门类名称" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入门类名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行业大类编码" prop="bigtype">
        <el-select v-model="queryParams.bigtype" placeholder="请选择行业大类编码" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="行业大类名称" prop="bigtypeName">
        <el-input
          v-model="queryParams.bigtypeName"
          placeholder="请输入行业大类名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行业中类编码" prop="midtype">
        <el-select v-model="queryParams.midtype" placeholder="请选择行业中类编码" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="行业中类名称" prop="midtypeName">
        <el-input
          v-model="queryParams.midtypeName"
          placeholder="请输入行业中类名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行业小类编码" prop="subtype">
        <el-select v-model="queryParams.subtype" placeholder="请选择行业小类编码" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="行业小类名称" prop="subtypeName">
        <el-input
          v-model="queryParams.subtypeName"
          placeholder="请输入行业小类名称"
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
          v-hasPermi="['gb4754_2017:gb4754:add']"
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
          v-hasPermi="['gb4754_2017:gb4754:edit']"
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
          v-hasPermi="['gb4754_2017:gb4754:remove']"
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
          v-hasPermi="['gb4754_2017:gb4754:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gb4754List" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门类" align="center" prop="type" />
      <el-table-column label="门类名称" align="center" prop="typeName" />
      <el-table-column label="行业大类编码" align="center" prop="bigtype" />
      <el-table-column label="行业大类名称" align="center" prop="bigtypeName" />
      <el-table-column label="行业中类编码" align="center" prop="midtype" />
      <el-table-column label="行业中类名称" align="center" prop="midtypeName" />
      <el-table-column label="行业小类编码" align="center" prop="subtype" />
      <el-table-column label="行业小类名称" align="center" prop="subtypeName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['gb4754_2017:gb4754:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gb4754_2017:gb4754:remove']"
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

    <!-- 添加或修改经济行业分类对话框 -->
    <el-dialog :title="title" :visible="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门类" prop="type">
          <el-select v-model="form.type" placeholder="请选择门类">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="门类名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入门类名称" />
        </el-form-item>
        <el-form-item label="行业大类编码" prop="bigtype">
          <el-select v-model="form.bigtype" placeholder="请选择行业大类编码">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="行业大类名称" prop="bigtypeName">
          <el-input v-model="form.bigtypeName" placeholder="请输入行业大类名称" />
        </el-form-item>
        <el-form-item label="行业中类编码" prop="midtype">
          <el-select v-model="form.midtype" placeholder="请选择行业中类编码">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="行业中类名称" prop="midtypeName">
          <el-input v-model="form.midtypeName" placeholder="请输入行业中类名称" />
        </el-form-item>
        <el-form-item label="行业小类编码" prop="subtype">
          <el-select v-model="form.subtype" placeholder="请选择行业小类编码">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="行业小类名称" prop="subtypeName">
          <el-input v-model="form.subtypeName" placeholder="请输入行业小类名称" />
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
import { listGb4754, getGb4754, delGb4754, addGb4754, updateGb4754, exportGb4754 } from "@/api/gb4754";

export default {
  name: "Gb4754",
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
      // 经济行业分类表格数据
      gb4754List: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        typeName: null,
        bigtype: null,
        bigtypeName: null,
        midtype: null,
        midtypeName: null,
        subtype: null,
        subtypeName: null
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
    /** 查询经济行业分类列表 */
    getList() {
      this.loading = true;
      listGb4754(this.queryParams).then(response => {
        this.gb4754List = response.rows;
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
        type: null,
        typeName: null,
        bigtype: null,
        bigtypeName: null,
        midtype: null,
        midtypeName: null,
        subtype: null,
        subtypeName: null
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
      this.ids = selection.map(item => item.type)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加经济行业分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const type = row.type || this.ids
      getGb4754(type).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改经济行业分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.type != null) {
            updateGb4754(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGb4754(this.form).then(response => {
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
      const types = row.type || this.ids;
      this.$confirm('是否确认删除经济行业分类编号为"' + types + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGb4754(types);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有经济行业分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportGb4754(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
