<template>
  <div class="main">
    <div style="margin: 15px">
      <el-input
        class="searchbar"
        placeholder="区县名称"
        prefix-icon="el-icon-user"
        v-model="searchArea"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-input
        class="searchbar"
        placeholder="乡镇街道名称"
        prefix-icon="el-icon-user"
        v-model="searchStandardStreet"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-input
        class="searchbar"
        placeholder="标准村社名称"
        prefix-icon="el-icon-user"
        v-model="searchStandardCommunity"
        style="width: 200px; margin-right: 10px"
      >
      </el-input>
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-search"
        @click="searchClick"
        v-on:keyup.enter="enterSearch"
        >查询</el-button
      >
      <el-button
        size="medium"
        type="success"
        icon="el-icon-folder-add"
        @click="addClick"
        style="margin-bottom: 20px"
        >新建</el-button
      >
    </div>
    <div style="margin: 0 30px 0 15px">
      <el-table border :data="configList" stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="区县名称" prop="area" sortable />
        <el-table-column label="区县id" prop="areaId" width="90px" sortable />
        <el-table-column label="标准乡镇街道名" prop="standardStreet" sortable />
        <el-table-column label="乡镇街道名称" prop="street" sortable />
        <el-table-column label="乡镇街道id" prop="streetId" sortable />
        <el-table-column label="户籍乡镇街道id" prop="hjStreetId" sortable />
        <el-table-column label="省全员乡镇街道id" prop="sqyStreetId" sortable />
        <el-table-column label="标准村社名称" prop="standardCommunity" sortable />
        <el-table-column label="村社名称" prop="community" sortable />
        <el-table-column label="村社id" prop="communityId" sortable />
        <el-table-column label="户籍村社id" prop="hjCommunityId" sortable />
        <el-table-column label="省全员村社id" prop="sqyCommunityId" sortable />
        <el-table-column label="是否在用" prop="isUse" width="80px" />
        <el-table-column label="备注" prop="mark" width="50px" />
        <el-table-column label="修改时间" prop="uptime" sortable />
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
              <el-popconfirm title="确定要删除吗？" @confirm="deleteConfig(scope.row)">
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
      <el-form ref="configForm" :model="configForm" label-width="130px" :inline="true">
        <el-form-item label="省名称" prop="provName">
          <el-input v-model="configForm.provName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="省id" prop="provId">
          <el-input v-model="configForm.provId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="市id" prop="cityId">
          <el-input v-model="configForm.cityId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="市名称" prop="cityName">
          <el-input v-model="configForm.cityName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="区县名称" prop="area">
          <el-input v-model="configForm.area" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="区县id" prop="areaId">
          <el-input v-model="configForm.areaId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="标准乡镇街道名" prop="standardStreet">
          <el-input v-model="configForm.standardStreet" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="乡镇街道名称" prop="street">
          <el-input v-model="configForm.street" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="乡镇街道id" prop="streetId">
          <el-input v-model="configForm.streetId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="户籍乡镇街道id" prop="hjStreetId">
          <el-input v-model="configForm.hjStreetId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="省全员乡镇街道id" prop="sqyStreetId">
          <el-input v-model="configForm.sqyStreetId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="标准村社名称" prop="standardCommunity">
          <el-input v-model="configForm.standardCommunity" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="村社名称" prop="community">
          <el-input v-model="configForm.community" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="村社id" prop="communityId">
          <el-input v-model="configForm.communityId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="户籍村社id" prop="hjCommunityId">
          <el-input v-model="configForm.hjCommunityId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="省全员村社id" prop="sqyCommunityId">
          <el-input v-model="configForm.sqyCommunityId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="是否在用" prop="isUse">
          <!-- <el-input v-model="configForm.isUse" style="width: 300px"></el-input> -->
          <el-select v-model="configForm.isUse" style="width: 300px" placeholder="请选择">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="configForm.mark" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <el-button type="success" style="width: 200px" @click="saveClick">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { tagsApi } from '@/api/tags';
  export default {
    data() {
      return {
        addConfigVisible: false,
        resultList: [],
        username: '',
        configList: [],
        searchList: [],
        searchStandardStreet: '',
        searchStandardCommunity: '',
        searchArea: '',
        current: 1,
        total: 0,
        loading: false,
        ds: '',
        dimId: 0,
        configForm: {
          id: '',
          provName: '',
          provId: '',
          cityId: '',
          cityName: '',
          area: '',
          areaId: '',
          standardStreet: '',
          street: '',
          streetId: '',
          hjStreetId: '',
          sqyStreetId: '',
          standardCommunity: '',
          community: '',
          communityId: '',
          hjCommunityId: '',
          sqyCommunityId: '',
          isUse: '',
          mark: '',
          uptime: '',
        },
        pageNum: [
          { value: 10, label: '10/页' },
          { value: 20, label: '20/页' },
          { value: 30, label: '30/页' },
          { value: 40, label: '40/页' },
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
        tagsApi({ script: 'dim/regional/select', account: this.username })
          .then((res) => {
            this.configList = res.records;
          })
          .catch((err) => {});
      },
      dateClick() {
        tagsApi({
          script: 'dim/regional/select',
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
        tagsApi({ script: 'dim/regional/select', id: this.dimId })
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
        tagsApi({ script: 'dim/regional/delete', id: row.id })
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.getList();
          })
          .catch((err) => {});
      },
      addClick() {
        this.addConfigVisible = true;
        this.configForm.provName = '';
        this.configForm.provId = '';
        this.configForm.cityId = '';
        this.configForm.cityName = '';
        this.configForm.areaId = '';
        this.configForm.standardStreet = '';
        this.configForm.street = '';
        this.configForm.streetId = '';
        this.configForm.hjStreetId = '';
        this.configForm.sqyStreetId = '';
        this.configForm.standardCommunity = '';
        this.configForm.community = '';
        this.configForm.communityId = '';
        this.configForm.hjCommunityId = '';
        this.configForm.sqyCommunityId = '';
        this.configForm.isUse = '';
        this.configForm.mark = '';
        this.configForm.uptime = '';
      },
      saveClick() {
        this.$refs.configForm.validate((valid) => {
          if (valid) {
            if (this.configForm.id == 0) {
              this.configForm.account = this.username;
              this.configForm.script = 'dim/regional/add';
              tagsApi(this.configForm)
                .then((res) => {
                  this.addConfigVisible = false;
                  this.$message({
                    type: 'success',
                    message: '添加成功',
                  });
                  this.getList();
                })
                .catch((err) => {});
            } else {
              this.configForm.script = 'dim/regional/update';
              tagsApi(this.configForm)
                .then((res) => {
                  this.addConfigVisible = false;
                  this.$message({
                    type: 'success',
                    message: '修改成功',
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
          script: 'dim.regional.select',
          area: this.searchArea,
          standardStreet: this.searchStandardStreet,
          standardCommunity: this.searchStandardCommunity,
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
              type: 'error',
              message: '接口错误：' + err,
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
