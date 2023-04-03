<template>
  <div>
    <el-input v-model="test1" placeholder="请输入公司" style="width: 300px"></el-input>
    <el-select v-model="value1" placeholder="请选择关系类型" style="margin-left: 5px"
      ><el-option
        v-for="item in select2"
        :key="item.value"
        :label="item.label"
        :value="item.label"
        :disabled="item.disabled"
      ></el-option
    ></el-select>
    <el-button @click="searchRelationship" type="primary" style="margin-left: 10px; height: 36px"
      >查询</el-button
    >

    <div style="height: calc(100vh - 50px)">
      <RelationGraph
        ref="seeksRelationGraph"
        :options="graphOptions"
        :on-node-click="onNodeClick"
        :on-line-click="onLineClick"
      />
    </div>
  </div>
</template>

<script>
  import RelationGraph from 'relation-graph';
  import { noderelationship, relationship } from '@/api/relationship';
  export default {
    name: 'Demo',
    components: { RelationGraph },
    data() {
      return {
        graphOptions: {
          allowSwitchLineShape: false,
          allowSwitchJunctionPoint: true,
          defaultJunctionPoint: 'border',
          allowShowMiniNameFilter: true,
          // 这里可以参考"Graph 图谱"中的参数进行设置
        },
        uscc: '',
        test1: '',
        input2: '',
        select2: [
          {
            value: '选项1',
            label: '职工',
          },
          {
            value: '选项2',
            label: '高管',
            disabled: true,
          },
          {
            value: '选项3',
            label: '股东',
            disabled: true,
          },
          {
            value: '选项4',
            label: '法人',
            disabled: true,
          },
          {
            value: '选项5',
            label: '全部',
            disabled: true,
          },
        ],
        value1: '职工',
        relationship_data: {
          rootId: 'b',
          nodes: [
            { id: 'a', text: '亚瑟', borderColor: 'yellow' },
            { id: 'b', text: '安琪拉', color: '#43a2f1', fontColor: 'yellow' },
            { id: 'c', text: '宫本武藏', nodeShape: 1, width: 80, height: 60 },
            { id: 'e', text: '孙悟空', nodeShape: 0, width: 150, height: 150 },
          ],
          links: [
            { from: 'a', to: 'b', text: '兄弟', color: '#43a2f1' },
            { from: 'a', to: 'c', text: '敌人' },
            { from: 'a', to: 'e', text: '基友' },
            { from: 'b', to: 'e', color: '#67C23A' },
          ],
        },
      };
    },
    created() {
      let test123 = this.$route.query.uscc;

      this.searchRelationship(test123);
    },
    mounted() {
      this.showSeeksGraph();
    },
    methods: {
      showSeeksGraph(query) {
        this.$refs.seeksRelationGraph.setJsonData(this.relationship_data, (seeksRGGraph) => {
          // Called when the relation-graph is completed
        });
      },
      onNodeClick(nodeObject, $event) {
        // this.$router.push({ path: '/tags/tagsearch', query: { searchIdcard: nodeObject.id } });
      },
      onLineClick(lineObject, $event) {},
      searchRelationship(uscc) {
        let input2 = this.value1;
        this.relationship_data.rootId = 'b';

        Promise.all([relationship(uscc, input2), noderelationship({ uscc: uscc })])
          .then(([res, res1]) => {
            this.relationship_data.links = [];
            this.relationship_data.links = res.data;
            this.relationship_data.nodes = [];
            this.relationship_data.nodes = res1.data;
          })
          .then(() => {
            this.$refs.seeksRelationGraph.setJsonData(this.relationship_data, (seeksRGGraph) => {
              // Called when the relation-graph is completed
            });
          });
      },
    },
  };
</script>

<style scoped></style>
