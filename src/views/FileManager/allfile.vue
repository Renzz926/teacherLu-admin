<template>
  <div class="main">
    <div style="margin: 15px">
      <!-- 文件查询 -->
      <el-input
        class="searchbar"
        placeholder="请输入文件名"
        prefix-icon="el-icon-user"
        v-model="name"
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

      <!-- 文件上传 -->
      <input type="file" @change="uploadFile" ref="inputFile" style="display: none" />
      <el-button
        class="fileBnt"
        type="primary"
        size="medium"
        icon="el-icon-folder"
        @click="$refs.inputFile.click()"
        >文件上传</el-button
      >
    </div>
    <div style="margin: 0 30px 0 15px">
      <el-table border :data="configList" stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="文件名称" prop="name" sortable />
        <el-table-column label="文件类型" prop="type" width="75px" />
        <el-table-column label="文件id" prop="id" width="60px" />
        <el-table-column label="文件大小" prop="size" width="150px" sortable />
        <el-table-column label="文件md5" prop="md5" />
        <el-table-column label="上传用户名称" prop="account" width="100px" />
        <el-table-column label="上传时间" prop="createTime" width="170px" sortable />
        <!-- <el-table-column label="解析状态" /> -->
        <el-table-column label="操作" width="120px">
          <template #default="scope">
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
            <el-tooltip content="下载" placement="bottom">
              <el-button
                size="mini"
                circle
                icon="el-icon-download"
                type="success"
                style="margin: 0 10px 0 10px"
                @click="downloadFile(scope.row)"
              ></el-button>
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
  </div>
</template>
<script>
  import { tagsApi } from '@/api/tags';
  import axios from 'axios';
  import { getToken } from '@/utils/auth';
  import { param } from '@/utils';
  import { download, upload, changeAnalysis } from '@/api/tags/file';
  // import $qs from qs;
  export default {
    data() {
      return {
        flag: true,
        resultList: [],
        username: '',
        name: '',
        configList: [],
        searchList: [],
        current: 1,
        total: 0,
        loading: false,
        dimId: 0,
        configForm: {
          id: '',
          name: '',
          type: '',
          md5: '',
          account: '',
          createTime: '',
          analysis: '',
          file: {},
          analysisStatus: '',
          size: '',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: '',
        },
        pageNum: [
          { value: '10', label: '10/页' },
          { value: '20', label: '20/页' },
          { value: '30', label: '30/页' },
          { value: '40', label: '40/页' },
        ],
        select: 10,
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
        if (this.flag) {
          this.flag = false;
          tagsApi({
            script: 'sysfile/list',
            account: this.username,
            username: this.username,
          })
            .then((res) => {
              this.configList = res.records;
            })
            .catch((err) => {});
        }
        this.flag = true;
      },
      dateClick() {
        tagsApi({
          script: 'sysfile/list',
          id: this.dimId,
        })
          .then((res) => {
            this.resultList = res;
          })
          .catch((err) => {});
      },
      configEdit(row) {
        this.configForm = row;
      },
      deleteConfig(row) {
        tagsApi({ script: 'sysfile/delete', id: row.id })
          .then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.getList();
          })
          .catch((err) => {});
      },
      handleCurrentChange(page) {
        this.searchClick();
      },
      searchClick() {
        this.loading = true;
        let param = {
          script: 'sysfile/list',
          fileName: this.name,
          current: this.current,
          username: this.username,
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
            // this.$message({
            //   type: "error",
            //   message: "接口错误：" + err,
            // });
          });
      },
      // 更新解析状态
      updateAnalysis(row) {
        let fd = new FormData(); //创建FormData对象,
        fd.append('fileId', row.id);
        fd.append('analysis', row.analysis);
        var timer = setTimeout(() => {
          this.getList();
        }, 100);
        timer;
        changeAnalysis(fd, getToken())
          .then((res) => {
            this.getList();
          })
          .catch((err) => {
            console.log(err);
          });
      },
      //文件下载
      downloadFile(row) {
        download(row.id)
          .then((response) => {
            // console.log(response);
            //headers请求头的乱码数据转换为中文
            const fileName = decodeURI(
              response.headers['content-disposition'].split(';')[1].split('=')[1]
            );
            // 下载文件
            let blob = new Blob([response.data], {
              // type: "application/vnd.ms-excel",
            });
            let objectUrl = URL.createObjectURL(blob); // 创建URL
            const link = document.createElement('a');
            link.href = objectUrl;
            // link.download = '.xlsx'// 自定义文件名
            //这里是获取后台传过来的文件名
            link.setAttribute('download', fileName);
            link.click(); // 下载文件
            URL.revokeObjectURL(objectUrl); // 释放内存
          })
          .catch((err) => {
            console.log(err);
          });
      },
      // 文件上传
      uploadFile(e) {
        const file = e.target.files[0];
        let fd = new FormData(); //创建FormData对象,
        fd.append('file', file);
        upload(fd, getToken()).then((res) => {
          this.getList();
          if (res.data.msg === '操作成功') {
            // this.$message({
            //   type: "success",
            //   message: "文件上传成功",
            // });
          } else {
            // this.$message({
            //   type: "success",
            //   message: "文件秒传成功",
            // });
          }
        });

        fd = '';
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

<style lang="scss" scoped>
  .main {
    margin-left: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }

  .fileBnt {
    margin-left: 10px;
  }

  .el-tag {
    margin-left: 15px;
  }
</style>
