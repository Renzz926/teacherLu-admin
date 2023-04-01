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
        icon="el-icon-search"
        @click="searchClick"
        v-on:keyup.enter="enterSearch"
        >查询</el-button>
      <el-button
        size="medium"
        type="success"
        icon="el-icon-folder-add"
        @click="addClick"
        style="margin-bottom: 20px"
      >新建</el-button>
    </div>
    <div style="margin: 0 30px 0 15px">
      <el-table border :data="configList" stripe>
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
                icon="el-icon-edit"
                size="mini"
                type="success"
                @click="configEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除设置" placement="bottom">
              <el-popconfirm
                title="确定要删除吗？"
                @confirm="deleteConfig(scope.row)"
              >
                <el-button
                  size="mini"
                  circle
                  icon="el-icon-delete"
                  type="danger"
                  style="margin: 0 10px 0 10px"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; float: right"
        v-if="configList.length > 0 || current > 1"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="select"
        :pager-count="15"
        :total="total"
        layout="total, prev, pager, next, jumper"
      >
      </el-pagination>
      <el-select
        v-model="select"
        placeholder="请选择"
        style="margin-top: 20px; width: 90px; float: right"
        @change="pageNumChange(select)"
      >
        <el-option
          v-for="item in pageNum"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 弹窗 -->
    <el-dialog :visible="addConfigVisible">
      <el-form
        ref="configForm"
        :model="configForm"
        label-width="130px"
        :inline="true"
      >
        <el-form-item label="街道" prop="street">
          <el-input v-model="configForm.street" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="社区" prop="community">
          <el-input
            v-model="configForm.community"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="户籍名称" prop="hjName">
          <el-input v-model="configForm.hjName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="标准名称" prop="standardName">
          <el-input
            v-model="configForm.standardName"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="社工叫法" prop="sgName">
          <el-input v-model="configForm.sgName" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <el-button type="success" style="width: 200px" @click="saveClick"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tagsApi } from "@/api/tags";
export default {
  data() {
    return {
      addConfigVisible: false,
      resultList: [],
      username: "",
      configList: [],
      searchList: [],
      street: "",
      community: "",
      hjName: "",
      standardName: "",
      sgName: "",
      current: 1,
      total: 0,
      loading: false,
      ds: "",
      dimId: 0,
      configForm: {
        id: "",
        street: "",
        community: "",
        hjName: "",
        standardName: "",
        sgName: "",
      },
      pageNum: [
        { value: "15", label: "10/页" },
        { value: "25", label: "20/页" },
        { value: "35", label: "30/页" },
        { value: "50", label: "40/页" },
      ],
      select: 15,
    };
  },
  created() {
    this.enterSearch();
  },
  mounted() {
    this.username = this.$store.getters.name;
    // this.getList();
    this.searchClick();
  },
  methods: {
    getList() {
      tagsApi({ script: "dim.eighbour/alias/list", account: this.username })
        .then((res) => {
          this.configList = res.records;
        })
        .catch((err) => {});
    },
    dateClick() {
      tagsApi({
        script: "dim/eighbour/alias/list",
        id: this.dimId,
        ds: this.ds,
      })
        .then((res) => {
          this.resultList = res;
        })
        .catch((err) => {});
    },
    showResult(row) {
      this.dimId = row.id;
      tagsApi({ script: "dim/eighbour/alias/list", id: this.dimId })
        .then((res) => {
          this.resultList = res;
        })
        .catch((err) => {});
    },
    configEdit(row) {
      this.addConfigVisible = true;
      this.configForm = row;
    },
    deleteConfig(row) {
      tagsApi({ script: "dim/eighbour/alias/delete", id: row.id })
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getList();
        })
        .catch((err) => {});
    },
    addClick() {
      this.addConfigVisible = true;
      this.configForm.id = "";
      this.configForm.street = "";
      this.configForm.community = "";
      this.configForm.hjName = "";
      this.configForm.standardName = "";
      this.configForm.sgName = "";
    },
    saveClick() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          if (this.configForm.id == 0) {
            this.configForm.account = this.username;
            this.configForm.script = "dim/eighbour/alias/add";
            tagsApi(this.configForm)
              .then((res) => {
                this.addConfigVisible = false;
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
                this.getList();
              })
              .catch((err) => {});
          } else {
            this.configForm.script = "dim/eighbour/alias/update";
            tagsApi(this.configForm)
              .then((res) => {
                this.addConfigVisible = false;
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.getList();
              })
              .catch((err) => {});
          }
        } else {
          return false;
        }
      });
    },
    handleCurrentChange() {
      this.searchClick();
    },
    searchClick() {
      this.loading = true;
      let param = {
        script: "dim/eighbour/alias/list",
        street: this.street,
        community: this.community,
        hjName: this.hjName,
        standardName: this.standardName,
        sgName: this.sgName,
        current: this.current,
        size: this.select,
      };
      tagsApi(param)
        .then((res) => {
          let records = res.records;
          this.configList = records;
          this.total = res.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "接口错误：" + err,
          });
        });
    },
    //回车搜索
    enterSearch() {
      document.onkeyup = (e) => {
        if (e.keyCode === 13) {
          this.searchClick();
        }
      };
    },
    pageNumChange() {
      this.searchClick();
    },
  },
};
</script>
<style scoped>
.main {
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}
</style>
