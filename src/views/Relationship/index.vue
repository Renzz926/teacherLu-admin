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
      <relation-graph ref="relationGraph$" :options="options">
        <template #node="{ node }">
          <div style="padding-top: 20px">节点：{{ node.text }}</div>
        </template>
      </relation-graph>
    </div>
  </div>
</template>

<script setup>
  import { noderelationship, relationship } from '@/api/relationship';
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import RelationGraph from 'relation-graph/vue3';
  const router = useRouter();
  const route = useRoute();
  const options = {
    defaultExpandHolderPosition: 'right',
    // defaultLineShape: 4,
    debug: true,
    showDebugPanel: true,
  };
  const uscc = ref('');
  const relationGraph$ = ref(null);
  const test1 = ref('');
  const input2 = ref('');
  const value1 = ref('职工');
  let select2 = [
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
  ];
  const state = reactive({});
  let test123 = route.query.uscc;

  const showSeeksGraph = (query) => {
    const graphJsonData = {
      rootId: 'N3',
      nodes: [
        { id: 'N4', text: '十4' },
        { id: 'N5', text: '十5' },
        { id: 'N6', text: '十6' },
        { id: 'N7', text: '十7' },
        { id: 'N3', text: '十三' },
        { id: 'N9', text: '152****3393' },
      ],
      lines: [
        { from: 'N3', to: 'N9', text: '分享' },
        { from: 'N3', to: 'N4', text: '分享444' },
        { from: 'N3', to: 'N5', text: '分享555' },
        { from: 'N3', to: 'N6', text: '分享666' },
        { from: 'N3', to: 'N7', text: '分享777' },
        { from: 'N9', to: 'N4', text: '分享x' },
      ],
    };
    relationGraph$.value.setJsonData(graphJsonData, () => {
      console.log('relationGraph ready!');
    });
  };
  const onNodeClick = (nodeObject, $event) => {
    router.push({ path: '/tags/tagsearch', query: { searchIdcard: nodeObject.id } });
  };
  const searchRelationship = (uscc) => {
    // let input2 = value1.value;
    // state.relationship_data.rootId = 'b';
    // Promise.all([relationship(uscc, input2), noderelationship({ uscc: uscc })])
    //   .then(([res, res1]) => {
    //     state.relationship_data.links = [];
    //     state.relationship_data.links = res.data;
    //     state.relationship_data.nodes = [];
    //     state.relationship_data.nodes = res1.data;
    //   })
    //   .then(() => {
    //     seeksRelationGraph.value.setJsonData(state.relationship_data, (seeksRGGraph) => {
    //       // Called when the relation-graph is completed
    //     });
    //   });
  };
  searchRelationship(test123);

  onMounted(() => {
    showSeeksGraph();
  });
</script>

<style scoped></style>
