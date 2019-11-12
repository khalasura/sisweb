<template>
<div>
<!-- Header !-->
    <Header></Header>

<!-- body !-->
<Split style="height: 904px; display: flex; overflow: hidden;" @onDrag="onDrag">
    <div style="width: 580px; -webkit-column-width: 200px; margin-left: 10px;" v-bind:style="{display}">
        <div style="margin-bottom: 5px;">
            <div class="card">
                <div class="card-header">
                    <label style="margin-bottom: 0; -webkit-margin-start: 5px; margin-top: 3px;">검색 조건</label>
                    <b-btn @click="layout" style="float: right; font-size: 12px; height: 32px; width: 35px; background-color: #343a40; border-color: #343a40;" v-b-tooltip title="모계도">
                        <custom-icon name="refresh-ccw" base-class="custom-icon" style="margin-left: -2.5px;"></custom-icon>
                    </b-btn>
                </div>
                <div class="card-body" id="searchlayout">
                    <Search></Search>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 5px;">
            <div class="card">
                <div class="card-header">
                    코일목록
                    <b-btn v-b-modal="'modal-part'" variant="info" :disabled="btndisabled" id="btnSearch">부분조회</b-btn>
                    <b-btn @click="handleAll" variant="success" :disabled="btndisabled" id="btnSearchAll">전체조회</b-btn>
                    
                    <b-btn @click="prevBtn" :disabled="btndisabled" id="prev">
                        <custom-icon name="chevron-left" base-class="custom-icon"></custom-icon>
                    </b-btn>
                    <b-btn @click="nextBtn" :disabled="btndisabled" id="next">
                        <custom-icon name="chevron-right" base-class="custom-icon"></custom-icon>
                    </b-btn>
                </div>
                <div class="card-body" id="coillistlayout">
                    <CoilList v-on:handleAll="handleAll" v-on:partdata="partdata"></CoilList>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 4px;">
            <div class="card">
                <div class="card-header">
                    통과공정
                </div>
                <div class="card-body" id="passlinelayout">
                    <Process></Process>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 5.5px;">
            <div class="card">
                <div class="card-header" style="font-size: 19px;">
                    <label style="margin-bottom: 0;" v-if="this.coilId == null">상세정보</label>
                    {{line}}{{coilId}}{{date}}
                </div>
                <div class="card-body" id="explainlayout">
                    <CoilExplain></CoilExplain>
                </div>
            </div>
        </div>
    </div>

    <div style="width: 580px; -webkit-column-width: 200px; margin-left: 10px;" v-bind:style="{ 'display': treevisible }">
        <div>
            <div class="card">
                <div class="card-header">
                    <label style="margin-bottom: 0; -webkit-margin-start: 5px; margin-top: 3px;">모계도</label>
                    <b-btn @click="layout" style="float: right; font-size: 12px; height: 32px; width: 35px; background-color: #343a40; border-color: #343a40;" v-b-tooltip title="검색조건">
                        <custom-icon name="refresh-ccw" base-class="custom-icon" style="margin-left: -2.5px;"></custom-icon>
                    </b-btn>
                </div>
                <div class="card-body" id="treelayout">
                    <Tree v-on:handleAll="handleAll" v-on:handlePart="handlePart" v-on:partdata="partdata"></Tree>
                </div>
            </div>
        </div>
    </div>

    <SplitArea :size="40" :minSize="0" style="overflow:hidden; width: 500px; margin-left: 10px; margin-right: 5px;">
        <div>
            <div class="card">
                <div class="card-header">
                    <label style="margin-bottom: 0;" v-if="this.chartName == null">코일맵_전면</label>
                    <label style="margin-bottom: 0; font-size: 19px;" v-else>{{chartName}}_전면</label>
                </div>
                <div class="card-body" id="coilmapfrontlayout">
                    <ChartTOP></ChartTOP>
                </div>
            </div>
        </div>
    </SplitArea>
    <SplitArea :size="40" :minSize="0" style="overflow:hidden; width: 500px; margin-left: 5px;">
        <div>
            <div class="card">
                <div class="card-header">
                    <label style="margin-bottom: 0;" v-if="this.chartName == null">코일맵_이면</label>
                    <label style="margin-bottom: 0; font-size: 19px;" v-else>{{chartName}}_이면</label>
                </div>
                <div class="card-body" id="coilmapbacklayout">
                    <ChartBOT></ChartBOT>
                </div>
            </div>
        </div>
    </SplitArea>
    <div style="width: 550px; margin-left: 10px; margin-right: 10px">
        <div style="margin-bottom: 5.5px;">
            <div class="card">
                <div class="card-header">
                    결함이미지
                </div>
                <div class="card-body" id="defectimglayout">
                    <DefectImg></DefectImg>
                </div>
            </div>
        </div>

        <div>
            <div class="card">
                <div class="card-header">
                    결함정보
                </div>
                <div class="card-body" id="defectinfolayout">
                    <DefectInfo></DefectInfo>
                </div>
            </div>
        </div>        
    </div>
    <div style="width: 350px; margin-right: 10px">
        <div>
            <div class="card">
                <div class="card-header">
                    결함필터
                </div>
                <div class="card-body" id="filterlayout">
                    <DefectFilter></DefectFilter>
                </div>
            </div>
        </div>
    </div>
</Split>

<PartSearch style="font-size: 13px;" v-on:handleCancel="handleCancel" v-on:handleOk="handleOk" :active="modalActive"></PartSearch>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

import Header from '../common/Header'
import Search from '../common/Search'
import Process from '../common/Process'
import Tree from '../viewer/Tree'
import ChartTOP from '../viewer/ChartTOP'
import ChartBOT from '../viewer/ChartBOT'
import CoilList from '../viewer/CoilList'
import CoilExplain from '../viewer/CoilExplain'
import DefectInfo from '../viewer/DefectInfo'
import DefectImg from '../viewer/DefectImg'
import DefectFilter from '../viewer/DefectFilter'

import PartSearch from '../viewer/modal/PartSearch'

// 차트 툴팁 플러그인
var keepTooltipOpenPlugin = {
    id: 'my-plugin',
    beforeRender: function(chart) {
        // We are looking for bubble which owns "keepTooltipOpen" parameter.
        var datasets = chart.data.datasets;
        chart.pluginTooltips = [];
        for (var i = 0; i < datasets.length; i++) {
            for (var j = 0; j < datasets[i].data.length; j++) {
                if (datasets[i].data[j].keepTooltipOpen && !chart.getDatasetMeta(i).hidden) {
                    //When we find one, we are pushing all informations to create the tooltip.
                    chart.pluginTooltips.push(new Chart.Tooltip({
                        _chart: chart.chart,
                        _chartInstance: chart,
                        _data: chart.data,
                        _options: chart.options.tooltips,
                        _active: [chart.getDatasetMeta(i).data[j]]
                    }, chart));
                }
            }
        }
    }, // end beforeRender

    afterDatasetsDraw: function(chart, easing) {
        // Draw tooltips
        Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
            tooltip.initialize();
            tooltip.update();
            tooltip.pivot();
            tooltip.transition(easing).draw();
        });
    } // end afterDatasetsDraw   
}

export default {
    components: { customIcon, Header, Search, Tree, CoilList, ChartTOP, ChartBOT, CoilExplain, Process, DefectInfo, DefectImg, PartSearch, DefectFilter },
    data() {
        return {
            modalActive: false,
            layoutChange: false,
            display: 'inline',
            treevisible: 'none'
        }
    },
    methods: {
        // 모계도로 화면 전환
        layout() {
            this.layoutChange = !this.layoutChange;

            if(this.layoutChange) {
                this.display = 'none';
                this.treevisible = 'inline';
            } else {
                this.display = 'inline';
                this.treevisible = 'none';
            }
        },
        // this.$store.state.chartTOP에 저장한 데이터의 hide 속성을 true로 바꿔주기 위한 로직
        queryAfter(topItems, botItems){
            var keepList = this.$store.state.keepList;
            keepList.forEach(g=> {
                var find = topItems.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
                find = botItems.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
            });

            // top, bot 데이터 이름에 따라 정렬
            topItems.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            botItems.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

            this.$store.state.chartTOP = topItems;
            this.$store.state.chartBOT = botItems;
        },
        // 차트(전면, 이면) 드래그시 슬라이더바 refresh
        onDrag: function(size) {
            this.$store.state.topSlider.refresh();
            this.$store.state.botSlider.refresh();
        },
        // 코일목록의 '<' 버튼 클릭
        prevBtn() {
            this.$store.state.prevBtn = true;
        },
        // 코일목록의 '>' 버튼 클릭
        nextBtn() {
            this.$store.state.nextBtn = true;
        },
        // 코일목록의 '전체조회' 버튼 클릭시 유효성 검사
        handleAll() {
            if(this.$store.state.currentCoil.TotalDefectCount <= 0){
                this.$swal({
                    type: 'info',
                    title: 'Info',
                    text: '데이터가 없습니다.'
                })
            } else if(this.$store.state.currentCoil.TotalDefectCount > 10000) {
                this.$swal({
                    type: 'warning',
                    title: '데이터가 너무 많습니다.',
                    text: '그래도 전체조회 하시겠습니까?',
                    showCancelButton: true,
                    confirmButtonText: '예',
                    cancelButtonText: '아니요. 부분조회하겠습니다.',
                })
                .then((result) => {
                    if(result.value) {           
                        this.queryAll();
                    } 
                    else {
                        this.handlePart();
                    }
                })
            } else {
                this.queryAll();
            }
        },
        // 전체조회 데이터 받기
        queryAll: async function() {
            this.$store.state.isLoading = true;
            this.$store.state.chartTOP = [];
            this.$store.state.chartBOT = [];
            var topItems = [];
            var botItems = [];
            var topRange = {min:1, max:0};
            var botRange = {min:1, max:0};
            var seqTop = 0;
            var seqBot = 0;
            await axios.get(this.$store.state.baseURL + '/api/defect/', {
                params : {plant:this.$store.state.currentCoil.LineName, coil:this.$store.state.currentCoil.CoilNo}
            })
            .then((response)=>{
                response.data.forEach(defect=>{
                    var x = Math.round(defect.DistanceLeftEdge);
                    var y = (defect.DistanceFromStart / 1000).toFixed(1);
                    if(defect.Side == 'TOP')
                    {
                        if (topItems.findIndex(g=>g.name==defect.Class) < 0 )
                        {
                            var find = this.$store.state.classInfo.find(g=> g.name == defect.Class);
                            var a = 'gray';
                            var g = '기타';
                            if (find != null) {
                                a = find.color;
                                g = find.group;
                            }
                            topItems.push({name: defect.Class, data: [[x, y, defect, seqTop]], color:a, hide: false, group: g});
                        }
                        else
                        {
                            var series = topItems.find(g=>g.name == defect.Class);
                            series.data = series.data.concat([[x, y, defect, seqTop]]);
                        }
                        // 최소값 찾기
                        if (defect.DefectNumber < topRange.min)
                            topRange.min = defect.DefectNumber;
                        // 최대값 찾기
                        if (defect.DefectNumber > topRange.max)
                            topRange.max = defect.DefectNumber;     
                        seqTop++;
                    }
                    else if(defect.Side == 'BOT')
                    {
                        if (botItems.findIndex(g=>g.name==defect.Class) < 0 )
                        {
                            var find = this.$store.state.classInfo.find(g=> g.name == defect.Class);
                            var a = 'gray';
                            var g = '기타';
                            if (find != null) {
                                a = find.color;
                                g = find.group;
                            }
                            botItems.push({name: defect.Class, data: [[x, y, defect, seqBot]], color:a, hide: false, group: g});
                        }
                        else
                        {
                            var series = botItems.find(g=>g.name == defect.Class);
                            series.data = series.data.concat([[x, y, defect, seqBot]]);
                        }
                        // 최소값 찾기
                        if (defect.DefectNumber < botRange.min)
                            botRange.min = defect.DefectNumber;
                        // 최대값 찾기
                        if (defect.DefectNumber > botRange.max)
                            botRange.max = defect.DefectNumber;   
                        seqBot++;
                    }
                });
                this.$store.state.defectRange = {top: topRange, bot: botRange};
                this.queryAfter(topItems, botItems);
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })
            this.axesInit();
        },
        // 차트, 슬라이더(전면, 이면) 초기화
        axesInit() {
            // X축-코일전면
            this.$store.state.chartOptionsTOP.scales.xAxes[0].ticks.max = Math.round(this.$store.state.currentCoil.SISCoilWidth)
            this.$store.state.chartOptionsTOP.scales.xAxes[0].ticks.min = 0
            this.$store.state.XsliderTOP.max = Math.round(this.$store.state.currentCoil.SISCoilWidth)
            this.$store.state.XsliderTOP.min = 0
            this.$store.state.XsliderTOP.value = [0, Math.round(this.$store.state.currentCoil.SISCoilWidth)];
            // Y축-코일전면
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.max = Math.round(this.$store.state.currentCoil.SISCoilLength / 1000)
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.min = 0
            this.$store.state.YsliderTOP.max = Math.round(this.$store.state.currentCoil.SISCoilLength / 1000)
            this.$store.state.YsliderTOP.min = 0
            this.$store.state.YsliderTOP.value = [0, Math.round(this.$store.state.currentCoil.SISCoilLength / 1000)];

            // X축-코일이면
            this.$store.state.chartOptionsBOT.scales.xAxes[0].ticks.max = Math.round(this.$store.state.currentCoil.SISCoilWidth)
            this.$store.state.chartOptionsBOT.scales.xAxes[0].ticks.min = 0
            this.$store.state.XsliderBOT.max = Math.round(this.$store.state.currentCoil.SISCoilWidth)
            this.$store.state.XsliderBOT.min = 0
            this.$store.state.XsliderBOT.value = [0, Math.round(this.$store.state.currentCoil.SISCoilWidth)];
            // Y축-코일이면
            this.$store.state.chartOptionsBOT.scales.yAxes[0].ticks.max = Math.round(this.$store.state.currentCoil.SISCoilLength / 1000)
            this.$store.state.chartOptionsBOT.scales.yAxes[0].ticks.min = 0
            this.$store.state.YsliderBOT.max = Math.round(this.$store.state.currentCoil.SISCoilLength / 1000)
            this.$store.state.XsliderBOT.min = 0
            this.$store.state.YsliderBOT.value = [0, Math.round(this.$store.state.currentCoil.SISCoilLength / 1000)];

            // classclick - 결함클래스 클릭 가능하게
            this.$store.state.classclick = false

            // 로딩 종료
            this.$store.state.isLoading = false;
        },
        // 부분조회 클릭
        handlePart(){
            this.modalActive = true;
        },
        // 부분조회 팝업 하단의 Cancel 버튼 클릭
        handleCancel(){
            this.modalActive = false;
        },
        // 부분조회 팝업 하단의 Ok 버튼 클릭
        handleOk(){
            this.modalActive = false;
        },
        // 부분조회 데이터 받기
        partdata() {
            this.$store.state.partchart = [];
            this.$store.state.rowClassData = [];
            this.$store.state.rowClassAll = [];
            this.$store.state.excelClass = [];
            
            // 클래스별 결함 수 통계 데이터 가져오기
            axios.get(this.$store.state.baseURL + '/api/defect/', {
                params : {plant:this.$store.state.currentCoil.LineName, coil:this.$store.state.currentCoil.CoilNo ,from:"0", to:Math.round(this.$store.state.currentCoil.SISCoilLength), flag:0}
            })
            .then((response)=>{
                response.data.forEach(defect=>{
                    // 색상 찾기
                    var find = this.$store.state.classInfo.find(g => g.name == defect.Class);
                    var a = 'gray';
                    if (find != null) {
                        a = find.color;
                    }

                    // 부분조회 데이터 목록
                    this.$store.state.partchart.push({class:defect.Class, top:defect.TopCnt, bot:defect.BotCnt, show:true, total: defect.TopCnt + defect.BotCnt, color: a});
                    // 결함 클래스별 결함수 목록 전체
                    this.$store.state.rowClassAll.push({class:defect.Class, top:defect.TopCnt, bot:defect.BotCnt, download:true, total: defect.TopCnt + defect.BotCnt});
                    // 결함 클래스별 결함수 목록 필터 후
                    this.$store.state.rowClassData.push({class:defect.Class, top:defect.TopCnt, bot:defect.BotCnt, download:true, total: defect.TopCnt + defect.BotCnt});
                    // excel data 저장 변수
                    this.$store.state.excelClass.push({'클래스':defect.Class, '전면':defect.TopCnt, '이면':defect.BotCnt, '총결함': defect.TopCnt + defect.BotCnt});
                });
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })
            // 썸네일 이미지 가져오기
            this.getThumbnailImg();
        },
        // 썸네일 이미지 받기
        getThumbnailImg(){
            // 클래스별 결함 수 통계 데이터 가져오기
            axios.get(this.$store.state.baseURL + '/api/coil/', {
                params : {plant:this.$store.state.currentCoil.LineName, coilNo:this.$store.state.currentCoil.CoilNo}
            })
            .then((response)=>{
                this.$store.state.coilImage = response.data;
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })            
        }
    },
    computed: {
        chartName: function() {
            if(this.$store.state.chartName == null) return;

            var line = null;

            if(this.$store.state.chartName.LineName == null) {
                return;
            } else {
                switch(this.$store.state.chartName.LineName)
                {
                    case 0:
                        line = '[1CGL]';
                        break;
                    case 1:
                        line = '[2CGL]';
                        break;
                    case 2:
                        line = '[3CGL]';
                        break;
                    case 3:
                        line = '[CAL]';
                        break;
                    case 4:
                        line = '[EGL]';
                        break;
                    case 5:
                        line = '[PL]';
                        break;
                    default:
                        line = '[UNKNOWN]';
                        break;
                }
            }

            return line  + this.$store.state.chartName.CoilId;
        },
        coilId: function() {
            return this.$store.state.currentCoil.CoilId
        },
        line: function() {
            if(this.$store.state.currentCoil.LineName == null) {
                return;
            } else {
                switch(this.$store.state.currentCoil.LineName)
                {
                    case 0:
                        return '[1CGL]';
                    case 1:
                        return '[2CGL]';
                    case 2:
                        return '[3CGL]';
                    case 3:
                        return '[CAL]';
                    case 4:
                        return '[EGL]';
                    case 5:
                        return '[PL]';
                    default:
                        return '[UNKNOWN]';
                }
            }
        },
        date: function() {
            if(this.$store.state.currentCoil.EndTime == null) {
                return;
            } else {
                return '_(' + this.$store.state.currentCoil.EndTime.replace('T', ' ').substr(0, 10) + ')'
            }
        },
        // 버튼 활성화 여부
        btndisabled: function() {
            return this.$store.state.clickcheck
        },
    },
    beforeCreate: function () {
        if (!this.$session.exists()) {
            this.$router.push('/')
        }
    },    
    mounted() {
        Chart.plugins.register(keepTooltipOpenPlugin);
        this.$store.state.viewerActive = true;
        this.$store.state.lineActive = false;
        this.$store.state.analyzerActive = false;
        // 초기에 5가지 몇몇 데이터는 기본적으로 숨김데이터를 가지기 위함
        this.$store.state.keepList = [];
        var hideList = ['System', 'Pseudo', 'Fd', 'Un', 'Ps', 'Ongoing', 'Scratch Filter', 'Wd', 'Sy', 'Welding Line', 'Welding Notch', 'Detection Test',
        'Repeat Defect', 'H', 'M2', 'M3', 'Rename', 'F0', 'A4', 'B6 short'];
        // , 'Ongoing', 'Scratch Filter', 'Wd', 'Sy', 'Welding Line', 'Welding Notch', '도금색차', 'Detection Test', 'Repeat Defect'
        hideList.forEach(g=> this.$store.state.keepList.push({name: g}));
    }
}
</script>

<style scoped>
/* 해상도 문제 해결 방법 */
/* @media screen and (min-width: 800px) and (max-width: 1200px) {
    #searchlayout { background-color: green; color: red; }
} */
.col-sm-3{ margin-left: -15px; flex: 0 0 22%; }
.col-sm-2{ margin-right: -15px; max-width: 19.666667%; flex: 0 0 19.666667%; }
.col-sm-12{ margin-bottom: 5px; }

.custom-icon { width: 15px; margin-top: -3px; color: white; }
.card-header{ font-size: 18px; font-weight: bold; color:white; background-color: lightslategray; padding: 8px; }

.TreeNavigation{ margin-top: -15px; }

#searchlayout{ height: 130px; margin-top: -10px; margin-bottom: 10px; }
#coillistlayout{ height: 274px; font-size: 13px; margin-top: -15px; margin-bottom: 5px; padding-left: 2px; padding-right: 2px; }
#passlinelayout{ height: 60px; margin-top: -15px; }
#treelayout{ height: 852px; -webkit-column-height: 853px; overflow: auto; font-size: 13px; }
#coilmapfrontlayout, #coilmapbacklayout{ height: 858px; background-color: rgb(217, 217, 217); }
#explainlayout{ -webkit-column-height: 275px; height: 274px; margin-top: -10px; margin-bottom: -10px; }
#defectimglayout{ height: 516px; margin-top: -10px; } 
#defectinfolayout{ height: 309px; margin-top: -10px; }
#filterlayout{ height: 857px; width: 200px; padding: 9px; }

#iconEye{ width: 20px; margin-left: 180px; margin-top: 0; margin-bottom: 0; }

#btnSearch{ height: 33px; margin-left: 0px; font-size: 12px; }
#btnSearchAll{ height: 33px; margin-left: 2px; margin-right: 10px; font-size: 12px; }
#prev{ height: 33px; font-size: 12px; background-color: #343a40; border-color: #343a40; }
#next{ height: 33px; font-size: 12px; background-color: #343a40; border-color: #343a40; }
</style>
