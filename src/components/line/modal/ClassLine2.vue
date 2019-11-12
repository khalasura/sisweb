<template>
<div>
    <b-modal id="modal-classLine2" title="결함필터" header-bg-variant="dark" header-text-variant="light" cancel-variant="danger" @ok="handleOk">
        <b-container fluid id="container">
            <div id="btnDiv">
                <b-button id="btnOpen" @click="btnOpen"><custom-icon :name="open" base-class="custom-icon" v-b-tooltip title="펼치기/접기"></custom-icon></b-button>
                <b-button id="btnSelect" @click="btnSelect"><custom-icon :name="select" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon></b-button>
                <b-button id="btnSave" @click="btnSave"><custom-icon name="save" base-class="custom-icon" v-b-tooltip title="저장"></custom-icon></b-button>
                <b-button id="btnRefresh" @click="btnRefresh"><custom-icon name="rotate-cw" base-class="custom-icon" v-b-tooltip title="초기화"></custom-icon></b-button>
            </div>
            <div id="treeDiv">
                <tree ref="Tree" :data="chartItems" :options="treeOptions" @node:checked="Check" @node:unchecked="Uncheck">
                    <div slot-scope="{ node }" class="node-container">
                        <span class="node-color" v-bind:style="{'color':node.data.color}" v-if="node.data.color != null">■</span>
                        <span class="node-text">{{ node.text }}</span>
                        <span class="node-count" v-if="node.data.count != null">&nbsp;&nbsp;({{ node.data.count }})</span>
                    </div>
                </tree>
            </div>
        </b-container>
    </b-modal>
</div>
</template>

<script>
import LiquorTree from 'liquor-tree'
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { [LiquorTree.name]: LiquorTree, customIcon },
    data() {
        return {
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
    methods: {
        // 결함 데이터 받기
        getTreeData() {
            var items = [];
            
            // root 저장(상위클래스 ex) A, B, 기타...)
            this.chartArray.forEach(g => {
                items.push({text: g.name, children: [], data:{count: g.count}});
            });
            // children 저장(하위클래스 ex) A1, B1, Fd...)
            this.$store.state.chartLine2.forEach(g => {
                items.forEach(t => {
                    if(g.group == t.text) {
                        // 저장된 클래스를 이름과 비교하여 ischeck값을 다르게 적용
                        var find = this.$store.state.keepList.filter(keep=> keep.name == g.name);
                        if(find.length <= 0) {
                            t.children.push({text: g.name, children: [], data:{color: g.color, count: g.data.length, ischeck: true}});
                        } else {
                            t.children.push({text: g.name, children: [], data:{color: g.color, count: g.data.length, ischeck: false}});
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
        // 화면에 트리구조로 결함 데이터 표현
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
                // chartTOP에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chartTOP의 hide 속성을 true
                this.chartItems.forEach(g => {
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
                // chartTOP에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chartTOP의 hide 속성을 false
                this.chartItems.forEach(g => {
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
        // 저장
        btnSave() {
            this.$swal({
                type: 'warning',
                title: '체크된 클래스만 보시겠습니까?',
                text: '다른 코일에서도 숨기기가 적용됩니다.',
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '아니요',
            })
            .then((result) => {
                if(result.value) {
                    // 저장 유지 클래스 컬렉션
                    this.$store.state.keepList = [{name: 'System'}, {name: 'Pseudo'}, {name: 'Fd'}, {name: 'Un'}, {name: 'Ongoing'}, {name: 'Scratch Filter'},
                    {name: 'Wd'}, {name: 'Sy'}, {name: 'Welding Line'}, {name: 'Welding Notch'}, {name: 'Detection Test'}, {name: 'Repeat Defect'}, {name: 'H'}, 
                    {name: 'M2'}, {name: 'M3'}, {name: 'Rename'}, {name: 'F0'}, {name: 'A4'}, {name: 'B6 short'}];
                    var keepList = this.$store.state.keepList;
                    // 숨기기 클래스
                    const Tree = this.$refs.Tree.tree;
                    // 체크된 항목 가져오기
                    let check = Tree.find({data: {ischeck: true}}, true);
                    
                    var classList = [];
                    var checkList = [];

                    for(var i = 0; i < this.$store.state.classInfo.length; i++) {
                        classList[i] = this.$store.state.classInfo[i].name;

                        if(i < check.length) {
                            checkList[i] = check[i].text;
                        }
                    }

                    checkList.forEach(g => {
                        var idx = classList.indexOf(g);
                        classList.splice(idx, 1);
                    });

                    classList.forEach(g => {
                        keepList.push({name: g});
                    });
                }
            })
        },
        // 저장 초기화
        btnRefresh() {
            this.$swal({
                type: 'warning',
                title: '숨기기를 해제하시겠습니까?',
                text: '해제하시면 저장된 숨기기가 모두 해제됩니다.',
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '아니요',
            })
            .then((result) => {
                if(result.value) {
                    this.$store.state.keepList = [];
                    var hideList = ['System', 'Pseudo', 'Fd', 'Un', 'Ps', 'Ongoing', 'Scratch Filter', 'Wd', 'Sy', 'Welding Line', 'Welding Notch', 'Detection Test', 'Repeat Defect'];
                    hideList.forEach(g=> this.$store.state.keepList.push({name: g}));

                    this.getTreeData();
                }
            })
        },
        // 팝업 창 하단의 OK 버튼 클릭
        handleOk() {
            this.$emit('OnClassLine2');
        }
    },
    computed: {
        chartItems: function() {
            return this.$store.state.chartLine2;
        },
        chartArray: function() {
            var overlapStr = [];
            var str = [];
            var result = [];
            for(var i = 0; i < this.$store.state.chartLine2.length; i++) {
                overlapStr[i] = this.$store.state.chartLine2[i].group;
            }
            overlapStr.sort();
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            str.forEach(g=>{
                var cnt = 0;
                var find = this.$store.state.chartLine2.filter(val=> val.group == g);
                find.forEach(f=>{
                    cnt += f.data.length
                });
                result.push({name:g, count:cnt});
            });
            return result;
        },
    },
    watch: {
        chartItems: function(val) {
            if (val.length == 0) return;

            // 버튼 초기화
            this.open = 'plus-square';
            this.select = 'check-square';
            this.openCheck = false;
            this.selectCheck = true;

            this.getTreeData();
        }
    },
}
</script>

<style scoped>
div{ font-size: 16px; }
.tree{ overflow: hidden; }
.custom-icon{ width: 18px; margin-top: -3px; height: 18px; }

#btnOpen, #btnSelect, #btnSave, #btnRefresh{ padding: 4px 8px; }
#btnDiv{ height: 40px; margin-top: 5px; margin-left: 3px; }
#treeDiv{ overflow-y: auto; height: 600px; }
</style>
