<template>
<div style="overflow-x: hidden;">
    <!-- Header !-->
    <Header></Header>

    <!-- body !-->
    <div class="row" style="height: 904px; display: flex; overflow: hidden;">
        <div class="col-sm-3" style="padding-left: 10px; padding-right: 3px;">
            <div class="col-sm-12" style="padding-right: 10px;">
                <div class="card">
                    <div class="card-header">
                        특정 빈도 선택
                    </div>
                    <div class="card-body" id="selectlayout">
                        <Select></Select>
                    </div>
                </div>
            </div>
            <div class="row" style="margin-left: 0; margin-right: 0;">
                <div class="col-sm-6" style="padding-right: 0;">
                    <div class="card">
                        <div class="card-header" v-bind:style="{ 'background-color': defectBack }">
                            결함 클래스
                            <b-button id="btnOpen" @click="btnOpen">
                                <custom-icon :name="open" base-class="custom-icon" v-b-tooltip title="펼치기/접기"></custom-icon>
                            </b-button>
                        </div>
                        <div class="card-body" id="defectlayout">
                            <Defect></Defect>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6" style="padding-left: 0; padding-right: 0;">
                    <div class="col-sm-12" style="padding-right: 10px;">
                        <div class="card">
                            <div class="card-header" v-bind:style="{ 'background-color': pathBack }">
                                주공정
                                <b-button id="btnSelect" @click="btnSelect1">
                                    <custom-icon :name="select1" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon>
                                </b-button>
                            </div>
                            <div class="card-body" id="Criticalpathlayout">
                                <Criticalpath></Criticalpath>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12" style="padding-right: 10px;">
                        <div class="card">
                            <div class="card-header" v-bind:style="{ 'background-color': coldBack }">
                                냉간압연
                                <b-button id="btnSelect" @click="btnSelect2">
                                    <custom-icon :name="select2" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon>
                                </b-button>
                            </div>
                            <div class="card-body" id="ColdRollinglayout">
                                <ColdRolling></ColdRolling>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12" style="padding-right: 10px;">
                        <div class="card">
                            <div class="card-header" v-bind:style="{ 'background-color': hotBack }">
                                열연
                                <b-button id="btnSelect" @click="btnSelect3">
                                    <custom-icon :name="select3" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon>
                                </b-button>
                            </div>
                            <div class="card-body" id="HotRollinglayout">
                                <HotRolling></HotRolling>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12" style="padding-right: 10px;">
                        <div class="card">
                            <div class="card-header" v-bind:style="{ 'background-color': yeonjuBack }">
                                연주
                                <b-button id="btnSelect" @click="btnSelect4">
                                    <custom-icon :name="select4" base-class="custom-icon" v-b-tooltip title="전체선택/전체해제"></custom-icon>
                                </b-button>
                            </div>
                            <div class="card-body" id="Yeonjulayout">
                                <Yeonju></Yeonju>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12" style="padding-right: 10px;">
                        <Period></Period>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-8">
            <div class="col-sm-12" style="padding-left: 0; padding-right: 10px;">
                <div class="card">
                    <div class="card-header">
                        <label v-if="this.$store.state.title == null" style="margin-bottom: 0;">차트</label>
                        <label v-else style="margin-bottom: 0; margin-left: 4px;">{{this.$store.state.title}}</label>
                    </div>
                    <div class="card-body" id="chartlayout">
                        <Chart></Chart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

import Header from '../common/Header'
import Defect from '../analyzer/Defect'
import Criticalpath from '../analyzer/Criticalpath'
import ColdRolling from '../analyzer/ColdRolling'
import HotRolling from '../analyzer/HotRolling'
import Yeonju from '../analyzer/Yeonju'
import Period from '../analyzer/Period'
import Select from '../analyzer/Select'
import Chart from '../analyzer/Chart'
// import Help from '../analyzer/modal/Help'

export default {
    components: { customIcon, Header, Defect, Criticalpath, ColdRolling, HotRolling, Yeonju, Period, Select, Chart },
    data() {
        return {
            // 헤더 배경색 설정
            defectBack: 'lightslategray',
            pathBack: 'lightslategray',
            coldBack: 'lightslategray',
            hotBack: 'lightslategray',
            yeonjuBack: 'lightslategray',
            // 버튼(아이콘) 설정
            open: 'plus-square',
            select1: 'square',
            select2: 'square',
            select3: 'square',
            select4: 'square',
        }
    },
    methods: {
        // 결함클래스 오른쪽 버튼 - 펼치기/접기
        btnOpen() {
            this.$store.state.btnOpen = !this.$store.state.btnOpen;

            if(!this.$store.state.btnOpen) {
                this.open = 'square';
            } else {
                this.open = 'plus-square';
            }
        },
        // 주공정 오른쪽 버튼 - 전체선택/전체해제
        btnSelect1() {
            this.$store.state.btnSelected1 = !this.$store.state.btnSelected1;

            if(!this.$store.state.btnSelected1) {
                this.select1 = 'check-square';
            } else {
                this.select1 = 'square';
            }
        },
        // 냉간압연 오른쪽 버튼 - 전체선택/전체해제
        btnSelect2() {
            this.$store.state.btnSelected2 = !this.$store.state.btnSelected2;

            if(!this.$store.state.btnSelected2) {
                this.select2 = 'check-square';
            } else {
                this.select2 = 'square';
            }
        },
        // 열연 오른쪽 버튼 - 전체선택/전체해제
        btnSelect3() {
            this.$store.state.btnSelected3 = !this.$store.state.btnSelected3;

            if(!this.$store.state.btnSelected3) {
                this.select3 = 'check-square';
            } else {
                this.select3 = 'square';
            }
        },
        // 연주 오른쪽 버튼 - 전체선택/전체해제
        btnSelect4() {
            this.$store.state.btnSelected4 = !this.$store.state.btnSelected4;

            if(!this.$store.state.btnSelected4) {
                this.select4 = 'check-square';
            } else {
                this.select4 = 'square';
            }
        },
    },
    computed: {
        trendType: function() {
            return this.$store.state.trendType;
        }
    },
    beforeCreate: function() {
        if (!this.$session.exists()) {
            this.$router.push('/')
        }
    },
    mounted() {
        this.$store.state.viewerActive = false;
        this.$store.state.lineActive = false;
        this.$store.state.analyzerActive = true;
    },
    watch: {
        trendType: function(val) {
            // 버튼 초기화
            this.open = 'plus-square';
            this.$store.state.btnOpen = true;

            switch(val) {
                case 1:
                    this.defectBack = 'green';
                    this.pathBack = 'green';
                    this.coldBack = 'lightslategray';
                    this.hotBack = 'lightslategray';
                    this.yeonjuBack = 'lightslategray';

                    this.select1 = 'check-square';
                    this.select2 = 'square';
                    this.select3 = 'square';
                    this.select4 = 'square';

                    this.$store.state.btnSelected1 = false;
                    this.$store.state.btnSelected2 = true;
                    this.$store.state.btnSelected3 = true;
                    this.$store.state.btnSelected4 = true;
                    break;
                case 2:
                    this.defectBack = 'green';
                    this.pathBack = 'lightslategray';
                    this.coldBack = 'green';
                    this.hotBack = 'lightslategray';
                    this.yeonjuBack = 'lightslategray';

                    this.select1 = 'square';
                    this.select2 = 'check-square';
                    this.select3 = 'square';
                    this.select4 = 'square';

                    this.$store.state.btnSelected1 = true;
                    this.$store.state.btnSelected2 = false;
                    this.$store.state.btnSelected3 = true;
                    this.$store.state.btnSelected4 = true;
                    break;
                case 3:
                    this.defectBack = 'green';
                    this.pathBack = 'lightslategray';
                    this.coldBack = 'lightslategray';
                    this.hotBack = 'green';
                    this.yeonjuBack = 'lightslategray';

                    this.select1 = 'square';
                    this.select2 = 'square';
                    this.select3 = 'check-square';
                    this.select4 = 'square';

                    this.$store.state.btnSelected1 = true;
                    this.$store.state.btnSelected2 = true;
                    this.$store.state.btnSelected3 = false;
                    this.$store.state.btnSelected4 = true;
                    break;
                case 4:
                    this.defectBack = 'green';
                    this.pathBack = 'lightslategray';
                    this.coldBack = 'lightslategray';
                    this.hotBack = 'lightslategray';
                    this.yeonjuBack = 'green';

                    this.select1 = 'square';
                    this.select2 = 'square';
                    this.select3 = 'square';
                    this.select4 = 'check-square';

                    this.$store.state.btnSelected1 = true;
                    this.$store.state.btnSelected2 = true;
                    this.$store.state.btnSelected3 = true;
                    this.$store.state.btnSelected4 = false;
                    break;
                case 5:
                    this.defectBack = 'green';
                    this.pathBack = 'lightslategray';
                    this.coldBack = 'lightslategray';
                    this.hotBack = 'lightslategray';
                    this.yeonjuBack = 'lightslategray';

                    this.select1 = 'square';
                    this.select2 = 'square';
                    this.select3 = 'square';
                    this.select4 = 'square';

                    this.$store.state.btnSelected1 = true;
                    this.$store.state.btnSelected2 = true;
                    this.$store.state.btnSelected3 = true;
                    this.$store.state.btnSelected4 = true;
                    break;
                case null:
                    this.defectBack = 'lightslategray';
                    this.pathBack = 'lightslategray';
                    this.coldBack = 'lightslategray';
                    this.hotBack = 'lightslategray';
                    this.yeonjuBack = 'lightslategray';

                    this.select1 = 'square';
                    this.select2 = 'square';
                    this.select3 = 'square';
                    this.select4 = 'square';

                    this.$store.state.btnSelected1 = true;
                    this.$store.state.btnSelected2 = true;
                    this.$store.state.btnSelected3 = true;
                    this.$store.state.btnSelected4 = true;
                    break;
            }
        }
    }
}
</script>

<style scoped>
.custom-icon{ width: 18px; margin-top: -3px; height: 18px; color: white; }

row{ margin-left: 0; margin-right: 0; }
.card { margin-bottom: 5px; }
/* .col-sm-2 { margin-right: -20px; margin-left: -5px; flex: 0 0 14.6667%; -ms-flex: 0 0 12.6667%; } */
.col-sm-8 { flex: 0 0 74.27%; -ms-flex: 0 0 74%; max-width: 74.27%; padding: 0; }
.card-header { font-weight: bold; color: white; background-color: lightslategray; padding: 6px; } /* font-size: 17px; */

#defectlayout { height: 769px; font-size: 14px; overflow: auto; margin-left: -10px; }
#Criticalpathlayout { height: 90px; font-size: 14px; margin-top: -15px; margin-left: -10px; }
#ColdRollinglayout { height: 50px; font-size: 14px; margin-top: -15px; margin-left: -10px; }
#HotRollinglayout { height: 70px; font-size: 14px; margin-top: -15px; margin-left: -10px; }
#Yeonjulayout { height: 135px; font-size: 14px; margin-top: -15px; margin-left: -10px; }

#selectlayout { height: 60px; margin-top: -10px; }
#chartlayout { height: 864px; }
#btnOpen, #btnSelect{ padding: 0px 4px; float: right; }
</style>
