<template>
<div>
    <b-tabs v-on:input="tabChange" style="margin-top: -3px;">
        <b-tab title="코일정보" active>
            <table class="table table-bordered table-hover" style="margin-top: 3px; text-align: center; font-size: 14px; font-family: Arial;">
                <thead>
                    <tr style="background-color: rgb(246, 248, 251);">
                        <th style="padding: 5px; margin: 0; width: 88px;">품명</th>
                        <th style="padding: 5px; margin: 0;">용도</th>
                        <th style="padding: 5px; margin: 0; width: 98px;">강종</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 5px; margin: 0;">{{PRDN_CD}}</td>
                        <td style="padding: 5px; margin: 0;">{{USG_CD}}</td>
                        <td style="padding: 5px; margin: 0;">{{MQC}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered table-hover" style="margin-top: -10px; text-align: center; font-size: 14px; font-family: Arial;">
                <thead>
                    <tr style="background-color: rgb(246, 248, 251);">
                        <th style="padding: 5px; margin: 0;">길이(모재)</th>
                        <th style="padding: 5px; margin: 0;">주문 폭</th>
                        <th style="padding: 5px; margin: 0;">주문 두께</th>
                        <th style="padding: 5px; margin: 0;">주문 도금량</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 5px; margin: 0;">{{PAR_COIL_ACT_LTH}}</td>
                        <td style="padding: 5px; margin: 0;">{{ORD_WTH}}</td>
                        <td style="padding: 5px; margin: 0;">{{ORD_THK}}</td>
                        <td style="padding: 5px; margin: 0;">{{GW_FRN}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered table-hover" style="margin-top: -10px; text-align: center; font-family: Arial;">
                <thead>
                    <tr style="background-color: rgb(246, 248, 251);">
                        <th style="padding: 5px; margin: 0;">고객사</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 5px; margin: 0;">{{CUS_NM}}</td>
                    </tr>
                </tbody>
            </table>
        </b-tab>
        <b-tab title="결함 클래스별 결함수"> <!-- style="width: 334px;" !-->
            <div id="table" ref="table2" style="border: 1px solid #999; margin-top: 3px; overflow: auto;"></div>
            <div id="labelDiv">
                <b-btn variant="info" :disabled="btndisabled" v-b-tooltip title="팝업" v-b-modal.modal-classCount style="margin-right: 5px;"> 
                    <custom-icon name="copy" base-class="custom-icon"></custom-icon>
                </b-btn>
                <b-btn @click="download" :disabled="btndisabled" v-b-tooltip title="다운로드"> 
                    <custom-icon name="file-text" base-class="custom-icon"></custom-icon>
                </b-btn>
                <label id="secondLabel">전면: {{topcount}}개, 이면: {{botcount}}개, 총 결함: {{count}}개</label>
            </div>
        </b-tab>
    </b-tabs>

    <ClassCount></ClassCount>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'
// 테이블
var Tabulator = require('tabulator-tables');
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// 엑셀
import XLSX from 'xlsx'

import ClassCount from './modal/ClassCount'

export default {
    components: { customIcon, XLSX, ClassCount },
    data() {
        return {
            fieldClass: [
                { field: 'class', title: '클래스', headerFilter:"input", width: 83, align:"left" },
                { field: 'top', title: '전면', width: 70, align:"right" },
                { field: 'bot', title: '이면', width: 70, align:"right" },
                { field: 'total', title: '총결함', width: 70, align:"right" },
            ],
            tabulator: null,
        }
    },
    methods:{
        // tab메뉴 클릭시 클릭된 tab의 화면으로 전환
        tabChange(tab){
            if (tab != 1) return;            
            setTimeout(() => { 
                this.tabulator.setSort("class", "asc");
            }, 100)
        },
        // 코일정보의 용도 항목 format
        isNumber: function(s) {
            s += ''; // 문자열로 변환
            s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
            if (s == '' || isNaN(s)) return false;
            return true;
        },
        // excel 다운로드
        download() {
            // this.tabulator.download("csv", this.coilId + ".csv");

            var item = XLSX.utils.json_to_sheet(this.$store.state.excelClass);
            var wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, item, this.coilId);
            XLSX.writeFile(wb, this.coilId + '.xlsx');
        }
    },
    computed: {
        PRDN_CD: function() {
            if(this.$store.state.currentCoil.PRDN_CD == null) {
                return '　'
            } else {
                switch(this.$store.state.currentCoil.PRDN_CD)
                {
                    case 'CC':
                        return 'CR';
                    case 'GG':
                        return 'GA';
                    case 'GI':
                        return 'GI';
                    case 'GN':
                        return 'EG';
                    case 'GE':
                        return 'EG';                           
                    case 'CP':
                        return 'PO';
                    case 'CF':
                        return 'FH';
                    default:
                        if (this.$store.state.currentCoil.PRDN_CD.substr(0,1) == 'L')
                            return 'Color'
                        else
                            return '기타';
                }
            }
        },
        USG_CD: function() {
            if(this.$store.state.currentCoil.USG_CD == null) {
                return '　'
            } else {
                switch(this.$store.state.currentCoil.USG_CD)
                {
                    case 'X02':
                        return this.$store.state.currentCoil.USG_CD + '_더미재';
                    case 'AB0':
                        return this.$store.state.currentCoil.USG_CD + '_외판';
                    case 'EE5S':
                        return this.$store.state.currentCoil.USG_CD + '_외판';
                    default:
                        var head = this.$store.state.currentCoil.USG_CD.substr(0,2);
                        if (head == 'AA'|| head == 'BA')
                            return this.$store.state.currentCoil.USG_CD + '_외판'
                        else
                        {
                            if (head.substr(0,1) == 'A' && this.isNumber(head.substr(1,1)))
                                return this.$store.state.currentCoil.USG_CD + '_외판'
                            else
                                return this.$store.state.currentCoil.USG_CD + '_일반';
                        }                                    
                }
            }
        },
        MQC: function() {
            if(this.$store.state.currentCoil.MQC == null) {
                return '　'
            } else {
                return this.$store.state.currentCoil.MQC
            }
        },
        PAR_COIL_ACT_LTH: function() {
            if(this.$store.state.currentCoil.PAR_COIL_ACT_LTH == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.currentCoil.PAR_COIL_ACT_LTH).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        ORD_WTH: function() {
            if(this.$store.state.currentCoil.ORD_WTH == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.currentCoil.ORD_WTH).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        ORD_THK: function() {
            if(this.$store.state.currentCoil.ORD_THK == null) {
                return '　'
            } else {
                return this.$store.state.currentCoil.ORD_THK.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        GW_FRN: function() {
            if(this.$store.state.currentCoil.GW_FRN == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.currentCoil.GW_FRN).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        CUS_NM: function() {
            if(this.$store.state.currentCoil.CUS_NM == null) {
                return '　'
            } else {
                return this.$store.state.currentCoil.CUS_NM
            }
        },
        itemClass: function() {
            return this.$store.state.rowClassData
        },
        count: function() {
            var count = 0
            for(var i = 0; i < this.$store.state.rowClassData.length; i++) {
                count += this.$store.state.rowClassData[i].total
            }
            return count
        },
        topcount: function() {
            var topcount = 0
            for(var i = 0; i < this.$store.state.rowClassData.length; i++) {
                topcount += this.$store.state.rowClassData[i].top
            }
            return topcount
        },
        botcount: function() {
            var botcount = 0
            for(var i = 0; i < this.$store.state.rowClassData.length; i++) {
                botcount += this.$store.state.rowClassData[i].bot
            }
            return botcount
        },
        coilId: function() {
            return this.$store.state.currentCoil.CoilId
        },
        btndisabled: function() {
            return this.$store.state.explainDisable
        }
    },
    watch: {
        itemClass: function(newData) {
            if (newData == null) return;
            this.tabulator.replaceData(newData);
        },
    },
    mounted: function() {
        this.tabulator = new Tabulator(this.$refs.table2, {
            data: this.itemClass, //link data to table
            columns: this.fieldClass, //define table columns
            height: 170,
        });
    }
}
</script>

<style scoped>
div{ font-size: 12px; }
button{ padding: 0px; padding-left: 7px; padding-right: 7px; float: left; height: 23px; }
.custom-icon { width: 10px; margin-top: -6px; color: white; }

#title{ font-weight: bold; color: blue; margin-left: 5px; }
#data{ margin-left: 6px; }

#labelDiv{ margin-top: 3px; }
#secondLabel{ font-size: 12px; float: right; margin-top: 4px; }
</style>
