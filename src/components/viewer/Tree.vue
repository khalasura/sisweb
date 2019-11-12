<template>
<div>
    <div v-if="loading">
        {{loadingString}}
    </div>
    <div class="navigation">
        <tree ref="someTree" v-model="selectedNode" :options="treeOptions" @node:dblclick="dbclick">
            <div slot-scope="{ node }" class="node-container">
                <span class="node-text">{{ node.text }}</span>                
                <span class="node-check" v-if="node.data.isCheck"><custom-icon name="check" base-class="custom-icon"></custom-icon></span>
                <span class="node-length" v-if="node.hasChildren()">({{ node.children.length }})</span>
                <div class="node-controls" v-if="node.data.isCoil">
                    <label @mouseup.stop="handlePart(node)" id="search">부분조회</label> &nbsp;
                    <label @mouseup.stop="handleAll(node)" id="search">전체조회</label>
                </div>
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
    components: {
        [LiquorTree.name]: LiquorTree, customIcon
    },    
    data () {
        return{
            loading: true,
            loadingString: 'No Data',
            selectedNode: null,
            treeData: [],
            treeOptions: {
                
            },
            modalActive:false,
    }},
    methods: {
        // 전체조회  
        handleAll: function(node) {
            // 모든 노드의 셀렉션 해제
            let allNodes = this.$refs.someTree.tree.find(/^/, true);
            allNodes.unselect();

            // 전체조회 노드 선택
            node.select();

            // 이름 저장
            this.$store.state.chartName = this.$store.state.currentCoil;
            this.$store.state.chartName.CoilId = node.data.no;

            // 비즈니스 로직..
            this.select(node);
            this.$emit('handleAll');
        },
        // 부분조회
        handlePart: function(node) {
            // 모든 노드의 셀렉션 해제
            let allNodes = this.$refs.someTree.tree.find(/^/, true);
            allNodes.unselect();

            // 전체조회 노드 선택
            node.select();

            // 비즈니스 로직..
            this.select(node);
            this.$emit('handlePart');
        },
        // 모계도 데이터 트리구조로 사용할 수 있도록 저장
        SelectTreeViewItem: function(items, val) {
            var find = null;
            if (items == null) return null;
            items.forEach(g=>{
                if (g.text == val){
                    find = g;
                    return;
                } 
                if (g.children.length > 0){
                    var tvItem = this.SelectTreeViewItem(g.children, val);
                    if (tvItem != null){
                        find = tvItem;
                        return;
                    }
                }                
            });
            return find;
        },
        // 모계도 데이터 받기
        getTreeViewItem: function(item){
            // 모계도
            if (item.HEAT_NO == null){
                return null;
            }
            return axios.get(this.$store.state.baseURL + '/api/coil/', {
                params : {heat:item.HEAT_NO}
            })
            .then((response)=>{
                var data = response.data;

                //if (data = null) return;
                var items = [];
                // 제강(HEAT)
                items.push({text:item.HEAT_NO, children:[], data: { isCoil: false, isCheck: false, no:item.HEAT_NO}});
                data.forEach(g=>{
                    var HEAT_NO = g.HEAT_NO != null ? g.HEAT_NO : item.HEAT_NO;
                    var SLAB_NO = g.SLAB_NO != null ? g.SLAB_NO : "?";
                    var RPV_RMTL_NO = g.RPV_RMTL_NO != null ? g.RPV_RMTL_NO : "?";
                    var MTL_COIL_NO = g.MTL_COIL_NO != null ? g.MTL_COIL_NO : RPV_RMTL_NO;
                    var level1 = g.level1 != null ? g.level1 : MTL_COIL_NO;
                    var level2 = g.level2 != null ? g.level2 : level1;
                    var level3 = g.level3 != null ? g.level3 : level2;
                    var level4 = g.level4 != null ? g.level4 : level3;
                    var level5 = g.level5 != null ? g.level5 : level4;
                    var level6 = g.level6 != null ? g.level6 : level5;
                    var level7 = g.level7 != null ? g.level7 : level6;
                    var level8 = g.level8 != null ? g.level8 : level7;
                    var level9 = g.level9 != null ? g.level9 : level8;
                    var level10 = g.level10 != null ? g.level10 : level9;

                    var pl = SLAB_NO + " " + "("+ RPV_RMTL_NO +")";
                    var tvItem = this.SelectTreeViewItem(items, HEAT_NO);
                    if (this.SelectTreeViewItem(items, pl) == null)
                        tvItem.children.push({text: pl, children:[], data: { isCoil: this.isCoil(RPV_RMTL_NO), isCheck: false, no: RPV_RMTL_NO}}); 
                        
                    tvItem = this.SelectTreeViewItem(items, pl);
                    if (this.SelectTreeViewItem(items, MTL_COIL_NO) == null)
                        tvItem.children.push({text: MTL_COIL_NO, children:[], data: { isCoil: this.isCoil(MTL_COIL_NO), isCheck: false, no: MTL_COIL_NO} });   
                        
                    tvItem = this.SelectTreeViewItem(items, MTL_COIL_NO);
                    if (this.SelectTreeViewItem(items, level1) == null)
                        tvItem.children.push({text: level1, children:[], data: { isCoil: this.isCoil(level1), isCheck: false, no: level1} });  
                        
                    tvItem = this.SelectTreeViewItem(items, level1);
                    if (this.SelectTreeViewItem(items, level2) == null)
                        tvItem.children.push({text: level2, children:[], data: { isCoil: this.isCoil(level2), isCheck: false, no: level2} });
                        
                    tvItem = this.SelectTreeViewItem(items, level2);
                    if (this.SelectTreeViewItem(items, level3) == null)
                        tvItem.children.push({text: level3, children:[], data: { isCoil: this.isCoil(level3), isCheck: false, no: level3} });
                        
                    tvItem = this.SelectTreeViewItem(items, level3);
                    if (this.SelectTreeViewItem(items, level4) == null)
                        tvItem.children.push({text: level4, children:[], data: { isCoil: this.isCoil(level4), isCheck: false, no: level4} });
                        
                    tvItem = this.SelectTreeViewItem(items, level4);
                    if (this.SelectTreeViewItem(items, level5) == null)
                        tvItem.children.push({text: level5, children:[], data: { isCoil: this.isCoil(level5), isCheck: false, no: level5} });
                        
                    tvItem = this.SelectTreeViewItem(items, level5);
                    if (this.SelectTreeViewItem(items, level6) == null)
                        tvItem.children.push({text: level6, children:[], data: { isCoil: this.isCoil(level6), isCheck: false, no: level6} });
                        
                    tvItem = this.SelectTreeViewItem(items, level6);
                    if (this.SelectTreeViewItem(items, level7) == null)
                        tvItem.children.push({text: level7, children:[], data: { isCoil: this.isCoil(level7), isCheck: false, no: level7} });
                        
                    tvItem = this.SelectTreeViewItem(items, level7);
                    if (this.SelectTreeViewItem(items, level8) == null)
                        tvItem.children.push({text: level8, children:[], data: { isCoil: this.isCoil(level8), isCheck: false, no: level8} });
                        
                    tvItem = this.SelectTreeViewItem(items, level8);
                    if (this.SelectTreeViewItem(items, level9) == null)
                        tvItem.children.push({text: level9, children:[], data: { isCoil: this.isCoil(level9), isCheck: false, no: level9} });
                        
                    tvItem = this.SelectTreeViewItem(items, level9);
                    if (this.SelectTreeViewItem(items, level10) == null)
                        tvItem.children.push({text: level10, children:[], data: { isCoil: this.isCoil(level10), isCheck: false, no: level10} });       
                                        
                });  
                this.treeData = items;                
                this.display(item.CoilId);
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })                        
        },
        // heat코일 데이터 받기
        getHeatCoils: function(heat){
            return axios.get(this.$store.state.baseURL + '/api/coil/', {
                params : {heat2:heat}
            })
            .then((response)=>{
                var data = response.data;
                if (data != null)
                    this.$store.state.treeCoils = data;
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })             
        },
        // tree 라이브러리에서 display하기 위해 사용
        getData: function(){
            return new Promise(resolve => {
                setTimeout(() => { resolve(this.treeData) }, 100)
            })
        },
        // 화면에 모계도 데이터 표현
        display: function(text){
            const tree = this.$refs.someTree.tree
            this.getData().then(data => {
                let model = tree.parse(data);
                tree.setModel(model);                                

                // 모든 노드 펼치기
                // let nodes = tree.find(/^/, true);
                // nodes.expand(true);
                
                //let node = tree.find(text);
                let node = tree.find({data: {no: text}}, true);
                node.select(true);
                node[0].data.isCheck = true;

                // 통과공정 tooltip에 나타내기 위해 스토어 변수에 저장하는 로직
                if(node.tree.selectedNodes[0].parent != null) {
                    if(this.$store.state.currentCoil.ACT_PAS_PROC.length > 3) {
                        if(node.tree.selectedNodes[0].parent.parent.parent != null) {
                            this.$store.state.hotName = node.tree.selectedNodes[0].parent.parent.data.no;
                            this.$store.state.coldName = node.tree.selectedNodes[0].parent.data.no;
                            this.$store.state.yeonjuName = node.tree.selectedNodes[0].parent.parent.data.text;
                        } else {
                            this.$store.state.hotName = node.tree.selectedNodes[0].parent.data.no;
                            this.$store.state.coldName = node.tree.selectedNodes[0].data.no;
                            this.$store.state.yeonjuName = node.tree.selectedNodes[0].parent.data.text;
                        }
                    } else{
                        this.$store.state.hotName = node.tree.selectedNodes[0].data.no;
                        this.$store.state.coldName = node.tree.selectedNodes[0].children[0].data.no;
                        this.$store.state.yeonjuName = node.tree.selectedNodes[0].data.text;
                    }
                }
                // 부모 노드 펼치기
                var nd = node[0];
                while (true) {
                    var parent = nd.parent;
                    if (parent == null) break;
                    parent.expand(true);
                    nd = parent;
                }
                this.loading = false;
            })
        },
        // 트리뷰 초기화
        clear: function(){
            const tree = this.$refs.someTree.tree
            let model = tree.parse([])
            this.$set(this.$refs.someTree, 'model', model)
            tree.setModel(model)            
        },
        // 모계도 데이터 받을 때(getTreeViewItem에서 사용) 데이터 비교 후 true, false로 받아서 사용
        isCoil(CoilId){
            var cnt = this.$store.state.treeCoils.filter(g=> g.CoilId == CoilId).length;
            if (cnt > 0)
                return true;
            else
                return false;
        },
        // 부분조회
        partdata() {
            this.$emit('partdata');
        },
        // 더블클릭
        dbclick(node) {
            //const events = this.events
            if (node.data.isCoil) {
                this.$store.state.chartName = this.$store.state.currentCoil;
                this.$emit('handleAll');
            }
        },
        // 모계도에서 노드 클릭
        select(node){
            if(node == null) return;
            var coilNo = node.data.no;
            // 트리뷰 코일 목록에서 선택된 노드와 일치하는 코일이 있는지 체크
            var coils = this.$store.state.treeCoils.filter(g=>g.CoilId == coilNo);
            // 해당 코일이 있다면 노드 선택 활성화
            if (coils.length > 0)
            {
                // 트리뷰 노드 중 이전에 선택된 코일 노드를 찾는다
                var find = this.$refs.someTree.tree.find({data: {isCheck: true}}, true);
                if (find != null)
                {
                    // 이전 노드 선택 해제
                    find[0].data.isCheck = false;
                }

                node.data.isCheck = true;
                var coil = coils[0];
                if (this.$store.state.currentCoil.CoilNo != coil.CoilNo)
                {
                    // 코일 상세 목록에 표현 할 변수
                    this.$store.state.currentCoil = coil;

                    // 부분조회 데이터 & 결함 클래스별 결함수 데이터 가져오기
                    this.partdata();
                }
            }                
            // 코일목록 컴포넌트에 알려주기 위한 선택 노드 할당
            this.$store.state.clickNode = node;
            // 코일목록 조회버튼 비활성화
            // this.$store.state.clickcheck = true;
        }        
    },
    computed:{
        row: function(){
            return this.$store.state.clickrow;
        }
    },
    watch:{
        row: function(val){
            if (val == null) return;
            const tree = this.$refs.someTree.tree

            // // 모든 노드 가져오기
            // let nodes = tree.find(/^/, true);
            // if (nodes != null)
            // {
            //     // 같은 히트번호일 경우 트리뷰 변화 없음
            //     // if (nodes[0].text == val.HEAT_NO)
            //     // {
            //     //     // 코일목록 조회버튼 활성화
            //     //     this.$store.state.clickcheck = false;                                        
            //     //     return;
            //     // }
            // }
            // 모계도 히트번호에 해당하는 코일목록 가져오기
            this.loading = true;
            this.loadingString = 'Get Coil List ...';
            this.getHeatCoils(val.HEAT_NO);
            setTimeout(() => { this.loadingString = 'Treeview Loading ...'; }, 500);
            // 트리뷰 클리어
            this.clear();
            // 모계도 정보 가져오기         
            var result = this.getTreeViewItem(val);
            if (result == null)
            {
                setTimeout(() => { this.loadingString = 'No Heat!'; }, 500)
                // 코일목록 조회버튼 활성화
                this.$store.state.clickcheck = false;
            }
        },
        selectedNode: function(val){
            // 처음 조회시 감시할 필요없음
            if(val.length == 0) return;
            
            var node = val[0];
            // 코일목록 조회버튼 활성화
            this.$store.state.clickcheck = false;
        }
    },
}
</script>

<style scoped>
.custom-icon { width: 17px;height: 17px; margin-top: -3px; color: red; }
#search{ color: rgb(0, 119, 255); }
#search:hover{ cursor: pointer; color: red; }
.node-length {
    color: green; padding-left: 6px;
}      
</style>