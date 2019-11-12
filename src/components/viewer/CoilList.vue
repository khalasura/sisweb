<template>
<div>
    <div id="table" ref="table" style="border: 1px solid #999;"></div>

    <loading :active.sync="isLoading" loader="dots" color="#0099ff" background-color="black"></loading>
    <div>
        <b-btn @click="download" :disabled="btndisabled" v-b-tooltip title="다운로드" style="padding: 0px; padding-left: 7px; padding-right: 7px; float: left; height: 23px; margin-top: 3px;"> 
            <custom-icon name="file-text" base-class="custom-icon" style="width: 10px; margin-top: -6px; color: white;"></custom-icon>
        </b-btn>
        <label id="labelDiv">{{totalRows}}개 검색됨</label>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

// 테이블
var Tabulator = require('tabulator-tables');
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// 로딩 컴포넌트
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
// 엑셀
import XLSX from 'xlsx'

const items = []

export default {
    components: { customIcon, Loading, XLSX },
    data () {
        return {
            modalActive:false,
            fields: [
                { field: 'CoilId', title: '코일명', frozen:false, headerFilter:"input", headerFilterPlaceholder:"filter.." },
                { field: 'InspectionName_gb', title: '구분', align:"right"},
                { field: 'TotalDefectCount', title: '총결함', align:"right", formatter: "money", formatterParams: { thousand :",", precision:false } },
                { field: 'Recipe', title: '레시피', headerFilter:"input", headerFilterPlaceholder:"filter.." },
                { field: 'MQC', title: '강종', headerFilter:"input", headerFilterPlaceholder:"filter.." },
                { field: 'SISCoilLength', title: '길이(m)', align:"right", formatter: function(cell, f, r) {
                    return Math.round(cell.getValue() / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }},
                { field: 'SISCoilWidth', title: '폭(mm)', align:"right", formatter: function(cell, f, r) {
                    return Math.round(cell.getValue()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }},
                { field: 'CoilNo', title: '검사순서', align:"right" },
                { field: 'StartTime', title: '검사시작', dir:"asc", formatter: function(cell, f, r) {
                    return cell.getValue().replace('T', ' ').substr(0, 19)
                }},
                { field: 'EndTime', title: '검사종료', formatter: function(cell, f, r) {
                    return cell.getValue().replace('T', ' ').substr(0, 19)
                }},
                { field: 'PDN_APT_DD', title: '생산계상일' },
                { field: 'ACT_PAS_PROC', title: '통과공정' },
                { field: 'FrontDefectCount', title: '전면결함', align:"right", formatter: "money", formatterParams: { thousand :",", precision:false  }  },
                { field: 'BackDefectCount', title: '이면결함', align:"right", formatter: "money", formatterParams: { thousand :",", precision:false  } },
                { field: 'CoilThickness', title: '두께', align:"right" },
                { field: 'LineName', title: '공정명', formatter: function(cell, f, r) { 
                    var val = cell.getValue();
                    switch(val)
                    {
                        case 0:
                            return '1CGL';
                        case 1:
                            return '2CGL';
                        case 2:
                            return '3CGL';
                        case 3:
                            return 'CAL';
                        case 4:
                            return 'EGL';
                        case 5:
                            return 'PL';
                        default:
                            return 'UNKNOWN';
                    }
                }},
            ],
            tabulator: null,
            oldRow: null,
        }
    },
    methods: {
        // 부분조회 버튼 클릭 - emit으로 상위vue인 Viewer.vue로 넘기는 역할
        partdata(){
            this.$store.state.chartName = this.$store.state.currentCoil;
            this.$emit('partdata');
        },
        // 전체조회 버튼 클릭 - emit으로 상위vue인 Viewer.vue로 넘기는 역할
        handleAll(){
            // 최소 실행시 선 클릭시 걸리는 버그
            if(this.$store.state.clickrow.length == 0) return;
            this.$store.state.chartName = this.$store.state.currentCoil;
            this.$emit('handleAll');
        },
        // 그리드의 row 클릭이벤트
        rowClick(e, row){
            this.rowDisplay(row);
        },
        // 그리드의 row 클릭시 화면 style 변경 및 데이터(통과공정, 상세정보) 저장
        rowDisplay(row) {
            var item = row.getData();
            if (this.oldRow == null)
            {
                // 코일목록 조회버튼 비활성화
                this.$store.state.clickcheck = true;                
                this.oldRow = row;
                row.getElement().style.fontWeight = "bold";
                row.select();
            }
            else
            {
                if (this.oldRow.getData().CoilNo != item.CoilNo)
                {
                    // 코일목록 조회버튼 비활성화
                    this.$store.state.clickcheck = true;                    
                    this.oldRow.getElement().style.fontWeight = "normal";
                    this.oldRow.deselect();
                    this.oldRow = row;
                    row.getElement().style.fontWeight = "bold";
                    row.select();
                }
                else
                {
                    return;
                }
            }

            // row 네비게이션
            row.scrollTo();

            // 트리뷰 컴포넌트 Watch에 감지되는 변수
            this.$store.state.clickrow = item;
            // 코일 상세 목록에 표현 할 변수
            this.$store.state.currentCoil = item;
            // 코일상세보기 안의 버튼 활성화
            this.$store.state.explainDisable = false;

            // 부분조회 데이터 & 결함 클래스별 결함수 데이터 가져오기
            this.partdata();
        },
        // 엑셀 데이터 다운로드
        download() {
            var item = XLSX.utils.json_to_sheet(this.$store.state.excelList);
            var wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, item);
            XLSX.writeFile(wb, 'CoilList.xlsx');
        }
    },
    computed: {
        items: function() {
            return this.$store.state.gridrow
        },
        totalRows: function() {
            return this.$store.state.gridrow.length
        },
        isLoading: function() {
            return this.$store.state.isLoading
        },
        node: function(){
            return this.$store.state.clickNode
        },
        prev: function() {
            return this.$store.state.prevBtn
        },        
        next: function() {
            return this.$store.state.nextBtn
        },
        btndisabled: function() {
            return this.$store.state.excelDisable
        }
    },
    watch: {
        items: function(newData) {
            this.tabulator.replaceData(newData);
        },
        node: function(val){
            if(val == null) return;            
            var coilNo = val.data.no;
            var rows = this.tabulator.searchRows("CoilId", "=",coilNo);            
            if (rows.length > 0)
            {
                var row = rows[0];                
                if (this.oldRow == null)
                {
                    this.oldRow = row;
                    row.getElement().style.fontWeight = "bold"
                    row.select();
                    row.scrollTo();
                }
                else
                {   
                    // 코일목록 조회버튼 활성화
                    this.$store.state.clickcheck = false;

                    var data1 = this.oldRow.getData();
                    var data2 = row.getData();
                    if (data1.CoilNo == data2.CoilNo) return;
                    this.oldRow.getElement().style.fontWeight = "normal";  
                    this.oldRow.deselect();              
                    this.oldRow = row;
                    row.getElement().style.fontWeight = "bold"; 
                    row.select();
                    row.scrollTo();
                }                
            }
            else
            {           
                if (this.oldRow != null)
                {
                    this.oldRow.getElement().style.fontWeight = "normal"; 
                    this.oldRow.deselect(); 
                    this.oldRow = null;
                }     
                              
            }            
        },
        prev: function(val) {
            if (!val) return;            
            var position = this.tabulator.getRowPosition(this.oldRow, true);
            var newPos = (position - 1) < 0 ? 0 : (position - 1);
            if (position == newPos)
            {
                this.$store.state.prevBtn = false;
                return;                
            } 
            var row = this.tabulator.getRowFromPosition(newPos, true);
            if (row != null)
            {
                this.rowDisplay(row);
                this.handleAll();
                this.$store.state.prevBtn = false;
            }
        },        
        next: function(val) {
            if (!val) return;
            var position = this.tabulator.getRowPosition(this.oldRow, true);
            var newPos = (position + 1) >= this.totalRows ? this.totalRows-1 : (position + 1);
            if (position == newPos)
            {
                this.$store.state.nextBtn = false;
                return;                
            } 
            var row = this.tabulator.getRowFromPosition(newPos, true);
            if (row != null)
            {
                this.rowDisplay(row);
                this.handleAll();
                this.$store.state.nextBtn = false;                
            }            
        },
    },
    created: function() {
        this.$store.dispatch('getDefectImage');
        this.$store.dispatch('getTooltip');
    },
    mounted: function() {
        this.tabulator = new Tabulator(this.$refs.table, {
            data: this.items, //link data to table
            columns: this.fields, //define table columns
            height: 230,
            rowClick:this.rowClick,
            rowDblClick: this.handleAll,
            // 2019-04-09 최원영 수정
            // 마지막 list 더블클릭시 다른 list가 선택되는 문제 해결
            // scrollToRowPosition: "nearest",
            scrollToRowIfVisible: false,
        });
    }
}
</script>

<style scoped>
div{ font-size: 12px; }
input{ padding: 0px; }

.col-md-3{ margin-left: 95px; -webkit-margin-start: 85px; }
.input-group{ width: 180px; }

.custom-icon { width: 12px; margin-top: -3px; }

#labelDiv{ float: right; margin-top: 4px; font-size: 14px; color: dimgray; }
</style>
