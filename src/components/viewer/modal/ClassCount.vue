<template>
    <b-modal id="modal-classCount" title="결함 클래스별 결함수" header-bg-variant="dark" header-text-variant="light" cancel-variant="danger" @ok="handleOk" size="lg">
        <b-container fluid id="container">
            <table class="table table-bordered table-hover" style="margin-top: 3px; margin-bottom: -2px; text-align: center;">
                <thead>
                    <tr style="background-color: rgb(246, 248, 251);">
                        <th style="padding: 5px; margin: 0; width: 123px;">선택</th>
                        <th style="padding: 5px; margin: 0; width: 124px;">Class</th>
                        <th style="padding: 5px; margin: 0; width: 124px;">Top</th>
                        <th style="padding: 5px; margin: 0; width: 124px;">Bot</th>
                        <th style="padding: 5px; margin: 0; width: 126px;">total</th>
                    </tr>
                </thead>
            </table>
            <div id="table">
                <b-table hover responsive small bordered fixed
                    :items="item"
                    :fields="fields"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                >

                <template slot="checkbox" slot-scope="row">
                    <b-form-checkbox v-model="row.item.download">
                        <label v-if="row.item.download == true">Checked</label>
                        <label v-else>UnChecked</label>
                    </b-form-checkbox>
                </template>

                </b-table>
            </div>
            <label id="secondLabel"> 전면: {{topcount}}개, 이면: {{botcount}}개, 총 결함: {{count}}개 </label>
            <br>
            <label id="partLabel">클래스 그룹: </label>
            <b-form-select v-model="classModel" :options="classOp" id="coilsearch"></b-form-select>
            <b-button id="partselectbtn" variant="warning" @click="partSelect">선택</b-button>
            <b-button id="partdeselectbtn" variant="warning" @click="partDeselect">해제</b-button>

            <b-button id="selectbtn" variant="info" @click="allSelect">전체선택</b-button>
            <b-button id="deselectbtn" variant="info" @click="allDeselect">전체해제</b-button>
        </b-container>
    </b-modal>
</template>

<script>
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { customIcon },
    data() {
        return {
            fields: [
                { key: 'checkbox', label: '선택', thStyle: { display: 'none', width: '98px' } },
                { key: 'class', label: '클래스', thStyle: { display: 'none', width: '98px' } },
                { key: 'top', label: '전면', thStyle: { display: 'none', width: '98px' } },
                { key: 'bot', label: '이면', thStyle: { display: 'none', width: '98px' } },
                { key: 'total', label: '총결함', thStyle: { display: 'none', width: '98px' } },
            ],
            sortBy: null,
            sortDesc: false,
            classModel: '',
            data: []
        }
    },
    methods: {
        // 전체선택
        allSelect() {
            for(var i = 0; i < this.item.length; i++) {
                this.item[i].download = true;
            }
        },
        // 전체해제
        allDeselect() {
            for(var i = 0; i < this.item.length; i++) {
                this.item[i].download = false;
            }
        },
        // 클래스 선택 - ex) A - A1, A2, A3 ...
        partSelect() {
            switch(this.classModel)
            {
                case 'A':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'A') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'B':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'B') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'C':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'C') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'D':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'D') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'E':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'E') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'F':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'F') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'H':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'H') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'I':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'I') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'P':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'P') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'Q':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'Q') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'N':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'N') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'W':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'W') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                case 'U':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'U') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = true;
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        // 클래스 선택해제 - ex) A - A1, A2, A3 ...
        partDeselect() {
            switch(this.classModel)
            {
                case 'A':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'A') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'B':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'B') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'C':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'C') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'D':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'D') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'E':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'E') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'F':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'F') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'H':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'H') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'I':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'I') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'P':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'P') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'Q':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'Q') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'N':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'N') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'W':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'W') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                case 'U':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'U') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].download = false;
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        // Ok버튼 클릭 - 선택된 클래스만 코일 차트에 표시하도록 데이터 저장
        handleOk(evt) {
            // true인것만 찾기
            var downList = this.item.filter(g=> g.download);

            // 저장된 excel data 초기화
            this.$store.state.excelClass = [];
            // Formatting 변수
            var topFormat = null;
            var botFormat = null;
            var totalFormat = null;
            // true인 것만 다시 저장
            downList.forEach(g => {
                topFormat = g.top.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                botFormat = g.bot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                totalFormat = g.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                this.$store.state.excelClass.push({'클래스': g.class, '전면': topFormat, '이면': botFormat, '총결함': totalFormat});
            });

            // 선택된 데이터만 차트에 표현해 주기 위한 변수
            this.$store.state.rowClassData = downList;
        }
    },
    computed: {
        item: function() {
            return this.$store.state.rowClassAll
        },
        count: function() {
            var count = 0
            for(var i = 0; i < this.$store.state.rowClassAll.length; i++) {
                count += this.$store.state.rowClassAll[i].total
            }
            return count
        },
        topcount: function() {
            var topcount = 0
            for(var i = 0; i < this.$store.state.rowClassAll.length; i++) {
                topcount += this.$store.state.rowClassAll[i].top
            }
            return topcount
        },
        botcount: function() {
            var botcount = 0
            for(var i = 0; i < this.$store.state.rowClassAll.length; i++) {
                botcount += this.$store.state.rowClassAll[i].bot
            }
            return botcount
        },
        classOp: function() {
            var overlapStr = [];
            var str = [];
            for(var i = 0; i < this.$store.state.rowClassAll.length; i++) {
                overlapStr[i] = this.$store.state.rowClassAll[i].class.substr(0, 1)
            }
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            return str
        },
        title: function() {
            return this.$store.state.currentCoil.CoilId
        }
    }
}
</script>

<style scoped>
.custom-icon { width: 10px; margin-top: -6px; color: white; }

#table{ height: 400px; overflow: auto; overflow-x: hidden; margin-left: -14px; }
#partLabel{ margin-right: 5px; }
#coilsearch{ width: 80px; height: 33px; margin-left: 0px; } /* 99px */
#partselectbtn{ font-size: 12px; margin-top: 0px; margin-left:10px; height: 33px; background-color: orange; border-color: orange; color: white; }
#partdeselectbtn{ font-size: 12px; margin-top: 0px; height: 33px; background-color: orange; border-color: orange; color: white; }
#selectbtn{ font-size: 12px; margin-left: 10px; height: 33px; }
#deselectbtn{ font-size: 12px; height: 33px; }
#downbtn{ font-size: 12px; height: 33px; margin-left: 160px; }

#secondLabel{ margin-top: 10px; }
</style>