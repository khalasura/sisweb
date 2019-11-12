<template>
<div>
    <b-modal ref="partModal" id="modal-classPart" title="부분조회 설정" header-bg-variant="dark" header-text-variant="light" 
    cancel-variant="danger" @ok="handleOk" @cancel="$emit('handleCancel')" size="lg">
        <b-container fluid id="container">
            <div class="row">
                <div class="col-sm-4">
                    <label style="font-weight: bold; color: blue;">{{title1}}</label>
                    <b-table hover responsive small bordered fixed
                        :items="line1"
                        :fields="fields1"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                    ></b-table>
                </div>
                <div class="col-sm-4">
                    <label style="font-weight: bold; color: blue;">{{title2}}</label>
                    <b-table hover responsive small bordered fixed
                        :items="line2"
                        :fields="fields1"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                    ></b-table>
                </div>
                <div class="col-sm-4">
                    <label style="font-weight: bold; color: blue;">총 결함</label>
                    <div id="btnDiv">
                        <b-button id="btnOpen" @click="btnOpen" v-b-tooltip title="펼치기/접기"><custom-icon :name="open" base-class="custom-icon"></custom-icon></b-button>
                        <b-button id="btnSelect" @click="btnSelect" v-b-tooltip title="전체선택/전체해제"><custom-icon :name="select" base-class="custom-icon"></custom-icon></b-button>
                    </div>
                    <div id="treeDiv">
                        <tree ref="Tree" :data="total" :options="treeOptions" @node:checked="Check" @node:unchecked="Uncheck">
                            <div slot-scope="{ node }" class="node-container">
                                <span class="node-color" v-bind:style="{'color':node.data.color}" v-if="node.data.color != null">■</span>
                                <span class="node-text">{{ node.text }}</span>
                                <span class="node-count" v-if="node.data.count != null">&nbsp;&nbsp;({{ node.data.count }})</span>
                            </div>
                        </tree>
                    </div>
                </div>
                <!-- 로딩 컴포넌트 -->
                <loading :active.sync="isLoading"  color="#0099ff" background-color="black" :is-full-page="false"></loading>
            </div>
        </b-container>
    </b-modal>    
</div>
</template>

<script>
import LiquorTree from 'liquor-tree'
import customIcon from 'vue-icon/lib/vue-feather.esm'

// 로딩 컴포넌트
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
    components: { [LiquorTree.name]: LiquorTree, customIcon, Loading },
    data() {
        return {
            fields1: [
                { key: 'Class', label: '클래스' },
                { key: 'TopCnt', label: '전면' },
                { key: 'BotCnt', label: '이면' },
            ],
            sortBy: null,
            sortDesc: false,
            item: [],
            treeOptions: {
                checkbox: true
            },
            // toggle버튼 이미지 변환
            open: 'plus-square',
            select: 'check-square',
            openCheck: false,
            selectCheck: true,
        }
    },
    props: {
        active: Boolean
    },
    methods: {
        // 부분조회 데이터 받기
        getTreeData() {
            var items = [];

            var overlapStr = [];
            var str = [];
            var result = [];
            for(var i = 0; i < this.$store.state.partTotal.length; i++) {
                overlapStr[i] = this.$store.state.partTotal[i].group;
            }
            overlapStr.sort();
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            
            // root 저장(상위클래스 ex) A, B, 기타...)
            str.forEach(g => {
                items.push({text: g, children: [], data:{count: g.count}});
            });
            // children 저장(하위클래스 ex) A1, B1, Fd...)
            this.$store.state.partTotal.forEach(g => {
                items.forEach(t => {
                    if(g.group == t.text) {
                        // 저장된 클래스를 이름과 비교하여 ischeck값을 다르게 적용
                        var find = this.$store.state.keepList.filter(keep=> keep.name == g.name);
                        if(find.length <= 0) {
                            t.children.push({text: g.name, children: [], data:{color: g.color, count: g.All, ischeck: true}});
                        } else {
                            t.children.push({text: g.name, children: [], data:{color: g.color, count: g.All, ischeck: false}});
                        }
                    }
                })
            });

            this.item = items;
            this.display();
        },
        // tree 라이브러리에서 display하기 위해 사용
        getData: function(){
            return new Promise(resolve => {
                setTimeout(() => { resolve(this.item) }, 100)
            })
        },
        // 화면에 트리구조로 부분조회 데이터 표현
        display: function(){
            const Tree = this.$refs.Tree.tree;
            this.getData().then(data => {
                // 전면
                let model = Tree.parse(data);
                Tree.setModel(model);
                let node = Tree.find({data: {ischeck: true}}, true);
                node.forEach(g=>{
                    g.check();
                });
            })
        },
        // 전체 선택
        Check(node) {
            // 부모노드가 없을때만 찾는다.
            if(node.parent != null) {
                // chart에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chart의 hide 속성을 true
                this.total.forEach(g => {
                    if(node.data.text == g.name) {
                        g.hide = false;
                        node.data.ischeck = true;
                    }
                })
            }
        },
        // 전체 해제
        Uncheck(node) {
            // 부모노드가 없을때만 찾는다.
            if(node.parent != null) {
                // chart에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chart의 hide 속성을 false
                this.total.forEach(g => {
                    if(node.data.text == g.name) {
                        g.hide = true;
                        node.data.ischeck = false;
                    }
                })
            }
        },
        // 트리 펼치기/접기
        btnOpen() {
            this.openCheck = !this.openCheck;

            // 모든 노드 가져오기
            const Tree = this.$refs.Tree.tree;
            let nodes = Tree.find(/^/, true);

            if(this.openCheck) {
                // 펼치기
                nodes.expand();
                this.open = 'minus-square';
            }
            else {
                // 접기
                nodes.collapse();
                this.open = 'plus-square';
            }
        },
        // 개별 선택
        btnSelect() {
            this.selectCheck = !this.selectCheck;

            // 모든 노드 가져오기
            const Tree = this.$refs.Tree.tree;
            let nodes = Tree.find(/^/, true);

            if(this.selectCheck) {
                nodes.uncheck();
                this.select = 'check-square';
            }
            else {
                nodes.check();
                this.select = 'square';
            }
        },
        // 부분조회시 색상
        getSeriesColor(name){
            // 시리즈 추가
            var find = this.$store.state.classInfo.find(g=> g.name == name);
            var a = 'gray';
            var g = '기타';
            if (find != null) {
                a = find.color;
                g = find.group;
            }
            return {color:a, group:g};
        },
        // 부분조회시 데이터
        bindingChartData(item, defect, seq){
            var x = Math.round(defect.DistanceLeftEdge);
            var y = (defect.DistanceFromStart / 1000).toFixed(1);

            if (item.findIndex(g=>g.name==defect.Class) < 0 )
            {
                // 시리즈 색상,그룹명 결정
                var s = this.getSeriesColor(defect.Class);
                // 시리즈 추가
                item.push({name: defect.Class, data: [[x, y, defect, seq.idx]], color:s.color, hide: false, group: s.group});
            }
            else
            {
                // 시리즈 찾기
                var series = item.find(g=>g.name == defect.Class);
                // 데이터 추가
                series.data = series.data.concat([[x, y, defect, seq.idx]]);
            }

            // 시퀀스 증가
            seq.idx++;
        },
        // 팝업 창 하단의 OK 버튼 클릭 - 유효성 검사 및 선택된 클래스 저장
        handleOk: async function() {
            // 선택 클래스 목록 할당
            var checkClass = '';
            const Tree = this.$refs.Tree.tree;
            Tree.checkedNodes.forEach(g =>{
                if(g.children.length == 0) {
                    if(g.data.ischeck == true) {
                        checkClass +=  g.data.text + ",";
                    }
                }
            });
            if(checkClass == '') {
                return this.$swal({
                    type: 'warning',
                    title: '선택된 클래스가 없습니다.',
                    text: '선택된 클래스가 하나라도 있어야합니다.'
                })
            }
            this.$emit('handleOk', checkClass);
            this.$refs.partModal.hide();
        },
    },
    computed: {
        isLoading: function() {
            return this.$store.state.linePartLoading;
        },        
        line1: function() {
            if(this.$store.state.partLine1 == null) return;
            return this.$store.state.partLine1;
        },
        line2: function() {
            if(this.$store.state.partLine2 == null) return;
            return this.$store.state.partLine2;
        },
        total: function() {
            if(this.$store.state.partTotal == null) return;
            return this.$store.state.partTotal;
        },
        title1: function() {
            if(this.$store.state.Line1Text == null) return;
            return this.$store.state.Line1Text;
        },
        title2: function() {
            if(this.$store.state.Line2Text == null) return;
            return this.$store.state.Line2Text;
        },
    },
    watch: {
        total: function(val) {
            if (val.length == 0) return;

            // 버튼 초기화
            this.open = 'plus-square';
            this.select = 'check-square';
            this.openCheck = false;
            this.selectCheck = true;
            
            this.getTreeData();
        },
        active: function(val){
            if (val)
                this.$refs.partModal.show();
            else
                this.$refs.partModal.hide();
        },
    },
}
</script>

<style scoped>
.modal-lg{max-width: 900px;}
.tree{ overflow: hidden; }
.custom-icon{ width: 18px; margin-top: -3px; height: 18px; }

#btnOpen, #btnSelect, #btnSave, #btnRefresh{ padding: 4px 8px; }
#btnDiv{ height: 40px; margin-top: 5px; margin-left: 3px; }
#treeDiv{ overflow-y: auto; height: 630px; }
</style>
