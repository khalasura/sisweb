<template>
<div>
    <b-modal id="modal-classTOP" title="결함클래스" header-bg-variant="dark" header-text-variant="light" cancel-variant="danger" @ok="handleOk" size="lg">
        <b-container fluid id="container">
            <div id="scroll">
                <!-- Main table element -->
                <b-table hover responsive small bordered fixed
                        :items="items"
                        :fields="fields"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                >

                <template slot="actions" slot-scope="row">
                    <b-form-checkbox v-model="row.item.hide">
                        <label v-if="row.item.hide == true">hide</label>
                        <label v-else>show</label>
                    </b-form-checkbox>
                </template>
                <template slot="colors" slot-scope="row">
                    <div :style="{ backgroundColor: row.item.color }" id="classColor"></div>
                </template>

                </b-table>
                <label id="infoLabel" v-if="totalRows > 0">{{totalRows}}개 검색됨 / 총 결함수: {{count}}개</label>
            </div>

            <div id="totalRows">
                <label id="partLabel">클래스 그룹: </label>
                <b-form-select v-model="classModel" :options="classOp" id="coilsearch"></b-form-select>
                <b-button id="partselectbtn" variant="warning" @click="partSelect">선택</b-button>
                <b-button id="partdeselectbtn" variant="warning" @click="partDeselect">해제</b-button>

                <b-button id="selectbtn" variant="info" @click="allSelect">전체선택</b-button>
                <b-button id="deselectbtn" variant="info" @click="allDeselect">전체해제</b-button>

                <b-button id="save" @click="saveBtn">저장</b-button>
                <b-button id="saveClear" @click="clearBtn">초기화</b-button>
            </div>  

        </b-container>
    </b-modal>
</div>
</template>

<script>
import axios from 'axios'

const items = []

export default {
    data() {
        return {
            fields: [
                { key: 'name', label: '이름' },
                { key: 'colors', label: '색상' },
                { key: 'data.length', label: '결함수' },
                { key: 'actions', label: '숨기기' }
            ],
            sortBy: 'name',
            sortDesc: false,
            showclass: 'show',
            clickcheck: false,
            classModel: ''
        }
    },
    methods: {
        saveBtn(){
            this.$swal({
                type: 'warning',
                title: '숨기기를 유지하시겠습니까?',
                text: '유지하시면 다른 코일에서도 숨기기가 유지됩니다.',
                showCancelButton: true,
                confirmButtonText: '네',
                cancelButtonText: '아니요',
            })
            .then((result) => {
                if(result.value) {           
                    // 저장 유지 클래스 컬렉션
                    var keepList = this.$store.state.keepList;
                    // 숨기기 클래스
                    var hideList = this.items.filter(g=> g.hide);                    
                    hideList.forEach(g => {
                        // 숨기기 클래스가 저장유지 컬렉션에 없는 경우에만 푸시
                        var find = keepList.filter(id=> id.name == g.name);
                        if (find.length == 0)
                            keepList.push({name: g.name})
                    });
                }
            })
        },
        clearBtn() {
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

                    // 초기화시 체크박스 선택도 초기화
                    for(var i = 0; i < this.items.length; i++) {
                        switch(this.items[i].name) {
                            case 'System':
                            case 'Pseudo':
                            case 'Fd':
                            case 'Un':
                            case 'Ps':
                            case 'Ongoing':
                            case 'Scratch Filter':
                            case 'Wd':
                            case 'Sy':
                            case 'Welding Line':
                            case 'Welding Notch':
                            case 'Detection Test':
                            case 'Repeat Defect':
                                this.items[i].hide = true;
                                break;
                            default:
                                this.items[i].hide = false;
                                break;
                        }
                    }
                }
            })
        },
        partSelect() {
            switch(this.classModel)
            {
                case 'A':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'A') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'B':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'B') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'C':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'C') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'D':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'D') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'E':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'E') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'F':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'F') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'H':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'H') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'I':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'I') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'P':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'P') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'Q':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'Q') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'N':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'N') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'W':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'W') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                case 'U':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'U') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = true;
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        partDeselect() {
            switch(this.classModel)
            {
                case 'A':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'A') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'B':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'B') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'C':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'C') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'D':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'D') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'E':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'E') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'F':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'F') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'H':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'H') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'I':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'I') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'P':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'P') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'Q':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'Q') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'N':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'N') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'W':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'W') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                case 'U':
                    for(var i = 0; i < this.items.length; i++) {
                        if(this.items[i].name.substr(0, 1) == 'U') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.items[idx].hide = false;
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        allSelect() {
            for(var i = 0; i < this.items.length; i++) {
                this.items[i].hide = true;
            }
        },
        allDeselect() {
            for(var i = 0; i < this.items.length; i++) {
                this.items[i].hide = false;
            }
        },
        handleOk() {
            this.$emit('OnClassTop');
        }
    },
    computed: {
        items: function() {
            return this.$store.state.chartTOP
        },
        totalRows: function() {
            return this.items.length
        },
        count: function() {
            var count = 0;
            for(var i = 0; i < this.$store.state.chartTOP.length; i++) {
                count += this.$store.state.chartTOP[i].data.length
            }
            return count
        },
        classOp: function() {
            var overlapStr = [];
            var str = [];
            for(var i = 0; i < this.$store.state.chartTOP.length; i++) {
                overlapStr[i] = this.$store.state.chartTOP[i].name.substr(0, 1)
            }
            overlapStr.sort();
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            return str
        },
    }
}
</script>

<style scoped>
.container-fluid{ text-align: center; }

#classColor{ height: 24px; }

#scroll{ overflow: auto; height: 690px; }
.table-responsive{ width: 95%; }

#totalRows{ font-size: 14px; margin-top: 10px; text-align: left; }

#infoLabel{ font-size: 14px; float: left; margin-left: 15px; }

#selectbtn{ font-size: 12px; margin-left: 25px; height: 33px; }
#deselectbtn{ font-size: 12px; height: 33px; }
#partLabel{ margin-right: 5px; margin-left: 0px; }
#coilsearch{ width: 80px; height: 33px; } /* 99px */
#partselectbtn{ font-size: 12px; margin-top: 0px; margin-left:5px; height: 33px; background-color: orange; border-color: orange; color: white; }
#partdeselectbtn{ font-size: 12px; margin-top: 0px; height: 33px; background-color: orange; border-color: orange; color: white; }

#save{ font-size: 12px; height: 33px; margin-left: 25px; }
#saveClear{ font-size: 12px; height: 33px; }
</style>