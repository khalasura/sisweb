<template>
<div>
    <b-tabs>
        <b-tab title="전면" active>
            <div id="btnDiv">
                <b-button id="btnOpen" @click="btnOpenTop" :disabled="btndisabled">
                    <custom-icon :name="openTop" base-class="custom-icon" v-b-tooltip title="펼치기/접기"></custom-icon>
                </b-button>
                <b-button id="btnSelect" @click="btnSelectTop" :disabled="btndisabled">
                    <custom-icon :name="selectTop" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon>
                </b-button>
                <b-button id="btnSave" @click="btnSaveTop" :disabled="btndisabled">
                    <custom-icon name="save" base-class="custom-icon" v-b-tooltip title="저장"></custom-icon>
                </b-button>
                <b-button id="btnRefresh" @click="btnRefreshTop" :disabled="btndisabled">
                    <custom-icon name="rotate-cw" base-class="custom-icon" v-b-tooltip title="초기화"></custom-icon>
                </b-button>
            </div>
            <div id="treeDiv">
                <tree ref="TopTree" :data="itemTop" :options="treeOptions" @node:checked="topCheck" @node:unchecked="topUncheck">
                    <div slot-scope="{ node }" class="node-container">
                        <span class="node-color" v-bind:style="{'color':node.data.color}" v-if="node.data.color != null">■</span>
                        <span class="node-text">{{ node.text }}</span>
                        <span class="node-count" v-if="node.data.count != null">&nbsp;&nbsp;({{ node.data.count }})</span>
                    </div>
                </tree>
            </div>
        </b-tab>
        <b-tab title="이면">
            <div id="btnDiv">
                <b-button id="btnOpen" @click="btnOpenBot" :disabled="btndisabled">
                    <custom-icon :name="openBot" base-class="custom-icon" v-b-tooltip title="펼치기/접기"></custom-icon>
                </b-button>
                <b-button id="btnSelect" @click="btnSelectBot" :disabled="btndisabled">
                    <custom-icon :name="selectBot" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon>
                </b-button>
                <b-button id="btnSave" @click="btnSaveBot" :disabled="btndisabled">
                    <custom-icon name="save" base-class="custom-icon" v-b-tooltip title="저장"></custom-icon>
                </b-button>
                <b-button id="btnRefresh" @click="btnRefreshBot" :disabled="btndisabled">
                    <custom-icon name="rotate-cw" base-class="custom-icon" v-b-tooltip title="초기화"></custom-icon>
                </b-button>
            </div>
            <div id="treeDiv">
                <tree ref="BotTree" :data="itemBot" :options="treeOptions" @node:checked="botCheck" @node:unchecked="botUncheck">
                    <div slot-scope="{ node }" class="node-container">
                        <span class="node-color" v-bind:style="{'color':node.data.color}" v-if="node.data.color != null">■</span>
                        <span class="node-text">{{ node.text }}</span>
                        <span class="node-count" v-if="node.data.count != null">&nbsp;&nbsp;({{ node.data.count }})</span>
                    </div>
                </tree>
            </div>
        </b-tab>
    </b-tabs>
</div>
</template>

<script>
import LiquorTree from 'liquor-tree'
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { [LiquorTree.name]: LiquorTree, customIcon },
    data() {
        return {
            itemTop: [],
            itemBot: [],
            treeOptions: {
                checkbox: true
            },
            // toggle버튼 이미지 변환(top)
            openTop: 'plus-square',
            selectTop: 'check-square',
            openCheckTop: false,
            selectCheckTop: true,
            // toggle버튼 이미지 변환(bot)
            openBot: 'plus-square',
            selectBot: 'check-square',
            openCheckBot: false,
            selectCheckBot: true,
        }
    },
    methods: {
        // 결함 데이터 받기
        getTreeData() {
            var top = [];
            var bot = [];
            
            // root 저장(상위클래스 ex) A, B, 기타...)
            this.topArray.forEach(g => {
                top.push({text: g.name, children: [], data:{count: g.count}});
            });
            // children 저장(하위클래스 ex) A1, B1, Fd...)
            this.$store.state.chartTOP.forEach(g => {
                top.forEach(t => {
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

            // root 저장(상위클래스 ex) A, B, 기타...)
            this.botArray.forEach(g => {
                bot.push({text: g.name, children: [], data:{count: g.count}});
            });
            // children 저장(하위클래스 ex) A1, B1, Fd...)
            this.$store.state.chartBOT.forEach(g => {
                bot.forEach(b => {
                    if(g.group == b.text) {
                        // 저장된 클래스를 이름과 비교하여 ischeck값을 다르게 적용
                        var find = this.$store.state.keepList.filter(keep=> keep.name == g.name);
                        if(find.length <= 0) {
                            b.children.push({text: g.name, children: [], data:{color: g.color, count: g.data.length, ischeck: true}});
                        } else {
                            b.children.push({text: g.name, children: [], data:{color: g.color, count: g.data.length, ischeck: false}});
                        }
                    }
                })
            });

            this.itemTop = top;
            this.itemBot = bot;
            this.display();
        },
        // tree 라이브러리에서 display하기 위해 사용
        getData: function(){
            return new Promise(resolve => {
                setTimeout(() => { resolve({top: this.itemTop, bot: this.itemBot});}, 100)
            })
        },
        // 화면에 트리구조로 결함 데이터 표현
        display: function(){
            const topTree = this.$refs.TopTree.tree;
            const botTree = this.$refs.BotTree.tree;
            this.getData().then(data => {
                // 전면
                let model = topTree.parse(data.top);
                topTree.setModel(model);
                let node = topTree.find({data: {ischeck: true}}, true);
                if(node != null) {
                    node.forEach(g=>{
                        g.check();
                    });
                }

                // 이면
                model = botTree.parse(data.bot);
                botTree.setModel(model);
                node = botTree.find({data: {ischeck: true}}, true);
                if(node != null) {
                    node.forEach(g=>{
                        g.check();
                    });
                }
            })
        },
        // 차트 전면 - 모두 선택
        topCheck(node) {
            // 부모노드가 없을때만 찾는다.
            if(node.parent != null) {
                // chartTOP에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chartTOP의 hide 속성을 true
                this.topItems.forEach(g => {
                    if(node.data.text == g.name) {
                        g.hide = false;
                        node.data.ischeck = true;
                    }
                })
                this.$store.state.Topchecked = true;
            }
        },
        // 차트 전면 - 모두 선택 해제
        topUncheck(node) {
            // 부모노드가 없을때만 찾는다.
            if(node.parent != null) {
                // chartTOP에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chartTOP의 hide 속성을 false
                this.topItems.forEach(g => {
                    if(node.data.text == g.name) {
                        g.hide = true;
                        node.data.ischeck = false;
                    }
                })
                this.$store.state.Topchecked = true;
            }
        },
        // 차트 이면 - 모두 선택
        botCheck(node) {
            // 부모노드가 없을때만 찾는다.
            if(node.parent != null) {
                // chartTOP에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chartTOP의 hide 속성을 true
                this.botItems.forEach(g => {
                    if(node.data.text == g.name) {
                        g.hide = false;
                        node.data.ischeck = true;
                    }
                })
                this.$store.state.Botchecked = true;
            }
        },
        // 차트 이면 - 모두 선택 해제
        botUncheck(node) {
            // 부모노드가 없을때만 찾는다.
            if(node.parent != null) {
                // chartTOP에 저장된 클래스 이름과 내가 선택한 체크박스의 클래스 이름 비교 후 같다면 => chartTOP의 hide 속성을 false
                this.botItems.forEach(g => {
                    if(node.data.text == g.name) {
                        g.hide = true;
                        node.data.ischeck = false;
                    }
                })
                this.$store.state.Botchecked = true;
            }
        },
        // 차트 전면 - 트리 펼치기/접기
        btnOpenTop() {
            this.openCheckTop = !this.openCheckTop;

            // 모든 노드 가져오기
            const topTree = this.$refs.TopTree.tree;
            let nodes = topTree.find(/^/, true);

            if(this.openCheckTop) {
                // 펼치기
                nodes.expand();
                this.openTop = 'minus-square';
            }
            else {
                // 접기
                nodes.collapse();
                this.openTop = 'plus-square';
            }
        },
        // 차트 전면 - 개별 선택
        btnSelectTop() {
            this.selectCheckTop = !this.selectCheckTop;

            // 모든 노드 가져오기
            const topTree = this.$refs.TopTree.tree;
            let nodes = topTree.find(/^/, true);

            if(this.selectCheckTop) {
                nodes.uncheck();
                this.selectTop = 'check-square';
            }
            else {
                nodes.check();
                this.selectTop = 'square';
            }
        },
        // 차트 전면 - 저장
        btnSaveTop() {
            this.$swal({
                type: 'warning',
                title: '체크된 클래스만 보시겠습니까?',
                text: '다른 코일에서도 숨기기가 적용됩니다.',
                showCancelButton: true,
                confirmButtonText: '예',
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
                    const topTree = this.$refs.TopTree.tree;
                    // 체크된 항목 가져오기
                    let check = topTree.find({data: {ischeck: true}}, true);
                    
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

                    // let hideList = topTree.find({data: {ischeck: false}}, true);
                    // hideList.forEach(g => {
                    //     // 숨기기 클래스가 저장유지 컬렉션에 없는 경우에만 푸시
                    //     var find = keepList.filter(id=> id.name == g.text);
                    //     if (find.length == 0)
                    //         keepList.push({name: g.text})
                    // });
                }
            })
        },
        // 차트 전면 - 저장 초기화
        btnRefreshTop() {
            this.$swal({
                type: 'warning',
                title: '숨기기를 해제하시겠습니까?',
                text: '해제하시면 저장된 숨기기가 모두 해제됩니다.',
                showCancelButton: true,
                confirmButtonText: '예',
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
        // 차트 이면 - 트리 펼치기/접기
        btnOpenBot() {
            this.openCheckBot = !this.openCheckBot;

            // 모든 노드 가져오기
            const botTree = this.$refs.BotTree.tree;
            let nodes = botTree.find(/^/, true);

            if(this.openCheckBot) {
                // 펼치기
                nodes.expand();
                this.openBot = 'minus-square';
            }
            else {
                // 접기
                nodes.collapse();
                this.openBot = 'plus-square';
            }
        },
        // 차트 이면 - 개별 선택
        btnSelectBot() {
            this.selectCheckBot = !this.selectCheckBot;

            // 모든 노드 가져오기
            const botTree = this.$refs.BotTree.tree;
            let nodes = botTree.find(/^/, true);

            if(this.selectCheckBot) {
                nodes.uncheck();
                this.selectBot = 'check-square';
            }
            else {
                nodes.check();
                this.selectBot = 'square';
            }
        },
        // 차트 이면 - 저장
        btnSaveBot() {
            this.$swal({
                type: 'warning',
                title: '체크된 클래스만 보시겠습니까?',
                text: '다른 코일에서도 숨기기가 적용됩니다.',
                showCancelButton: true,
                confirmButtonText: '예',
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
                    const botTree = this.$refs.BotTree.tree;
                    // 체크된 항목 가져오기
                    let check = botTree.find({data: {ischeck: true}}, true);
                    
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
        // 차트 이면 - 저장 초기화
        btnRefreshBot() {
            this.$swal({
                type: 'warning',
                title: '숨기기를 해제하시겠습니까?',
                text: '해제하시면 저장된 숨기기가 모두 해제됩니다.',
                showCancelButton: true,
                confirmButtonText: '예',
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
        }
    },
    computed: {
        topItems: function() {
            return this.$store.state.chartTOP;
        },
        botItems: function() {
            return this.$store.state.chartBOT;
        },
        topArray: function() {
            var overlapStr = [];
            var str = [];
            var result = [];
            for(var i = 0; i < this.$store.state.chartTOP.length; i++) {
                overlapStr[i] = this.$store.state.chartTOP[i].group;
            }
            overlapStr.sort();
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            str.forEach(g=>{
                var cnt = 0;
                var find = this.$store.state.chartTOP.filter(val=> val.group == g);
                find.forEach(f=>{
                    cnt += f.data.length
                });
                result.push({name:g, count:cnt});
            });
            return result;
        },
        botArray: function() {
            var overlapStr = [];
            var str = [];
            var result = [];
            for(var i = 0; i < this.$store.state.chartBOT.length; i++) {
                overlapStr[i] = this.$store.state.chartBOT[i].group;
            }
            overlapStr.sort();
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            str.forEach(g=>{
                var cnt = 0;
                var find = this.$store.state.chartBOT.filter(val=> val.group == g);
                find.forEach(f=>{
                    cnt += f.data.length
                });
                result.push({name:g, count:cnt});
            });
            return result;
        },
        btndisabled: function() {
            return this.$store.state.classclick;
        }
    },
    watch: {
        botItems: function(val) {
            if (val.length == 0) return;

            // 버튼 초기화
            // toggle버튼 이미지 변환(top)
            this.openTop = 'plus-square';
            this.selectTop = 'check-square';
            this.openCheckTop = false;
            this.selectCheckTop = true;
            // toggle버튼 이미지 변환(bot)
            this.openBot = 'plus-square';
            this.selectBot = 'check-square';
            this.openCheckBot = false;
            this.selectCheckBot = true;

            this.getTreeData();
        }
    },
}
</script>

<style scoped>
div{ font-size: 14px; }
.tree{ overflow: hidden; font-family: Arial; font-weight: bold; }
.custom-icon{ width: 18px; margin-top: -3px; height: 18px; }

#btnOpen, #btnSelect, #btnSave, #btnRefresh{ padding: 4px 8px; }
#btnDiv{ height: 40px; margin-top: 5px; margin-left: 3px; }
#treeDiv{ overflow-y: auto; height: 750px; }
</style>
