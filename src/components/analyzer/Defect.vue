<template>
<div style="margin-top: -15px;">
    <div id="treeDiv">
        <tree ref="Tree" :data="items" :options="treeOptions" @node:selected="click" @node:checked="check" @node:unchecked="uncheck">
            <div slot-scope="{ node }" class="node-container">
                <span class="node-check" v-if="node.data.isCheck == true && trendType != 5">
                    <img src="@/assets/rectangle.png" style="margin-top: -5px; margin-right: 5px;"/>
                </span>
                <span class="node-text">{{ node.text }}</span>
            </div>
        </tree>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import LiquorTree from 'liquor-tree'
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { [LiquorTree.name]: LiquorTree, customIcon },
    data() {
        return {
            classInfo: [],
            items: [],
            treeOptions: {
                checkbox: false
            },
        }
    },
    methods: {
        // 결함 데이터 받기
        getTreeData() {
            var item = [];
            
            // 그룹 정렬 및 중복그룹 제거 후 str변수에 저장
            var overlapStr = [];
            var str = [];
            var result = [];
            for(var i = 0; i < this.classInfo.length; i++) {
                overlapStr[i] = this.classInfo[i].GroupName;
            }
            overlapStr.sort();
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })

            // root 저장(상위클래스 ex) A, B, 기타...)
            str.forEach(g => {
                item.push({text: g, children: [], data:{isCheck: false}});
            });
            // children 저장(하위클래스 ex) A1, B1, Fd...)
            this.classInfo.forEach(g => {
                item.forEach(t => {
                    if(g.GroupName == t.text) {
                        t.children.push({text: g.ClassName, children: [], data:{isCheck: false}});
                    }
                })
            });

            this.items = item;
            this.display();
        },
        // tree 라이브러리에서 display하기 위해 사용
        getData: function(){
            return new Promise(resolve => {
                setTimeout(() => { resolve(this.items) }, 100)
            })
        },
        // 화면에 트리구조로 결함 데이터 표현
        display: function(){
            const tree = this.$refs.Tree.tree;
            this.getData().then(data => {
                let model = tree.parse(data);
                tree.setModel(model);
            })
        },
        // 개별 선택
        click(node) {
            if(this.$store.state.trendType != 5) {
                const tree = this.$refs.Tree.tree;
                // 그룹 노드면 리턴
                if (node.children.length > 0) return;
    
                // 단일 선택 시 모든 노드의 체크를 해제한다.
                let nodes = tree.find(/^/, true);
                nodes.forEach(g=> {
                    if (g.data.isCheck)
                        g.data.isCheck = false;
                });
    
                // 단일 선택
                node.data.isCheck = true;
                // 스토어 저장
                this.$store.state.defectItem = [];
                this.$store.state.defectItem.push({name:node.data.text});
            }

            // var isCheck = node.data.isCheck;
            // if (!isCheck){
            //     node.data.isCheck = true;
            //     if (node.children.length > 0)
            //         node.children.forEach(g=> {g.data.isCheck = true;});
            // }                    
            // else{
            //     node.data.isCheck = false;
            //     if (node.children.length > 0)
            //         node.children.forEach(g=> {g.data.isCheck = false;});
            // }                    
        },
        // 전체 선택
        check(node) {
            if(this.$store.state.trendType == 5) {
                if(this.$store.state.defectItem.length < 6) {
                    // 부모노드가 없을때만 찾는다.
                    if(node.parent != null) {
                        this.$store.state.defectItem.push({name: node.data.text});
                    }
                } else {
                    node.states.checked = false;
                }
            }
        },
        // 전체 해제
        uncheck(node) {
            if(this.$store.state.trendType == 5) {
                // 부모노드가 없을때만 찾는다.
                if(node.parent != null) {
                    // this.$store.state.defectItem에 저장된 이름과 선택 node 이름 비교 후 index 추출
                    var findIdx = this.$store.state.defectItem.findIndex((item, idx) => {
                        return item.name == node.data.text;
                    })
                    // 추출된 index 삭제
                    this.$store.state.defectItem.splice(findIdx, 1);
                }
            }
        },
        // 클래스 데이터 받기
        ClassQuery(){
            axios.get(this.$store.state.baseURL + '/api/class/').then((response)=>{
                this.classInfo = response.data;
            })
            .catch((ex)=>{console.log("ERROR!!!: ", ex);})
        },
    },
    computed: {
        trendType: function() {
            return this.$store.state.trendType
        },
        btnOpen: function() {
            return this.$store.state.btnOpen
        }
    },
    watch: {
        trendType: function(val) {
            const tree = this.$refs.Tree.tree;
            // 데이터 초기화
            this.$store.state.defectItem = [];

            if(val == 5) {
                // 체크박스 옵션 true
                tree.options.checkbox = true;
    
                // 단일 선택 시 모든 노드의 체크를 해제한다.
                let nodes = tree.find(/^/, true);
                nodes.forEach(g=> {
                    if (g.data.isCheck)
                        g.data.isCheck = false;
                });
                // 모든 노드 접기, 선택 해제, 체크 해제
                nodes.collapse();
                nodes.unselect();
                nodes.uncheck();
            } else {
                // 체크박스 옵션 false
                tree.options.checkbox = false;

                // 단일 선택 시 모든 노드의 체크를 해제한다.
                let nodes = tree.find(/^/, true);
                if(nodes == null) return;
                nodes.forEach(g=> {
                    if (g.data.isCheck)
                        g.data.isCheck = false;
                });
                // 모든 노드 접기, 선택 해제, 체크 해제
                nodes.collapse();
                nodes.unselect();
                nodes.uncheck();
            }
        },
        btnOpen: function(val) {
            const tree = this.$refs.Tree.tree;
            let nodes = tree.find(/^/, true);

            if(val) nodes.collapse();
            else nodes.expand();
        }
    },
    mounted() {
        this.ClassQuery();
        setTimeout(this.getTreeData, 100);
    }
}
</script>

<style scoped>

</style>
