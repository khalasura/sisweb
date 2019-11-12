<template>
<div style="overflow-x: hidden; overflow-y: hidden;">
<!-- Header !-->
    <Header></Header>

<!-- body !-->
<div style="height: 904px; display: flex; overflow: hidden;">
    <div style="width: 400px; -webkit-column-width: 200px; margin-left: 10px;">
        <div style="margin-bottom: 5px;">
            <div class="card">
                <div class="card-header">
                    <label style="margin-bottom: 0;">검색 조건</label>
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
                    <b-btn @click="queryPart" v-b-modal="'modal-classPart'" variant="info" :disabled="btndisabled" id="btnSearchPart">부분조회</b-btn>
                    <b-btn @click="handleAll" variant="success" :disabled="btndisabled" id="btnSearchAll">전체조회</b-btn>
                    
                    <b-btn @click="prevBtn" :disabled="btndisabled" id="prev">
                        <custom-icon name="chevron-left" base-class="custom-icon"></custom-icon>
                    </b-btn>
                    <b-btn @click="nextBtn" :disabled="btndisabled" id="next">
                        <custom-icon name="chevron-right" base-class="custom-icon"></custom-icon>
                    </b-btn>
                </div>
                <div class="card-body" id="coillistlayout">
                    <CoilList v-on:handleAll="handleAll"></CoilList>
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
                    <label style="margin-bottom: 0;" v-if="this.coilId == null">코일정보</label> 
                    {{line}}{{coilId}}{{date}}
                </div>
                <div class="card-body" id="infolayout">
                    <CoilInfo></CoilInfo>
                </div>
            </div>
        </div>
    </div>

    <div style="width: 325px; -webkit-column-width: 300px; margin-left: 10px;">
        <div style="margin-bottom: 5.5px;">
            <div class="card">
                <div class="card-header">
                    결함이미지
                </div>
                <div class="card-body" id="imglayout">
                    <Img1></Img1>
                </div>
            </div>
        </div>

        <div>
            <div class="card">
                <div class="card-header">
                    결함정보
                </div>
                <div class="card-body" id="defectlayout">
                    <Defect1></Defect1>
                </div>
            </div>
        </div>
    </div>
    <div style="overflow:hidden; width: 1000px; margin-left: 5px;">
        <div>
            <Chart></Chart>
        </div>
    </div>
    <div style="width: 325px; -webkit-column-width: 300px; margin-left: 10px; margin-right: 10px">
        <div style="margin-bottom: 5.5px;">
            <div class="card">
                <div class="card-header">
                    결함이미지
                </div>
                <div class="card-body" id="imglayout">
                    <Img2></Img2>
                </div>
            </div>
        </div>

        <div>
            <div class="card">
                <div class="card-header">
                    결함정보
                </div>
                <div class="card-body" id="defectlayout">
                    <Defect2></Defect2>
                </div>
            </div>
        </div>
    </div>
</div>

<Tree style="display: none;"></Tree>
<PartSearch :active="modalActive" v-on:handleCancel="handleCancel" v-on:handleOk="handleOk"></PartSearch>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

import Header from '../common/Header'
import Search from '../common/Search'
import CoilList from '../line/CoilList'
import Process from '../common/Process'
import CoilInfo from '../line/CoilInfo'
import Chart from '../line/Chart'
import Img1 from '../line/Img1'
import Img2 from '../line/Img2'
import Defect1 from '../line/Defect1'
import Defect2 from '../line/Defect2'

import Tree from '../viewer/Tree'
import PartSearch from '../line/modal/PartSearch'

export default {
    components: { customIcon, Header, Search, CoilList, Process, CoilInfo, Chart, Img1, Img2, Defect1, Defect2, Tree, PartSearch },
    beforeCreate: function () {
        if (!this.$session.exists()) {
            this.$router.push('/')
        }
    },
    data() {
        return {
            modalActive: false,
        }
    },
    methods: {
        // this.$store.state.chartLine1,2에 저장한 데이터의 hide 속성을 true로 바꿔주기 위한 로직
        queryAfter(lineItems1, line1Top, line1Bot, lineItems2, line2Top, line2Bot){
            var keepList = this.$store.state.keepList;
            keepList.forEach(g=> {
                var find = lineItems1.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
                find = lineItems2.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
                find = line1Top.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
                find = line1Bot.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
                find = line2Top.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
                find = line2Bot.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
            });

            this.$store.state.chartLine1 = lineItems1;
            this.$store.state.chartLine2 = lineItems2;
            this.$store.state.chartLine1All = lineItems1;
            this.$store.state.chartLine2All = lineItems2;
            this.$store.state.chartLine1Top = line1Top;
            this.$store.state.chartLine2Top = line2Top;
            this.$store.state.chartLine1Bot = line1Bot;
            this.$store.state.chartLine2Bot = line2Bot;

            // 이미지 데이터 초기화
            this.$store.state.defectImage1 = null;
            this.$store.state.defectImage2 = null;
        },
        // 코일목록의 '<' 버튼 클릭
        prevBtn() {
            this.$store.state.prevBtn = true;
        },
        // 코일목록의 '>' 버튼 클릭
        nextBtn() {
            this.$store.state.nextBtn = true;
        },
        // 코일목록의 '전체조회' 버튼 클릭
        handleAll() {
            this.queryAll('', true);
        },
        // 부분조회 팝업창 실행
        handlePart() {
            this.modalActive = true;
        },
        // 부분조회 팝업 하단의 Cancel 버튼 클릭
        handleCancel() {
            this.modalActive = false;
        },
        // 부분조회 팝업 하단의 Ok 버튼 클릭
        handleOk(checkClass) {
            this.queryAll(checkClass, false);
        },
        // 조회시 색상
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
        // 조회시 데이터
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
        // 데이터 예외처리
        queryCheck(cnt) {
            // =============================================================
            // 데이터 예외처리
            // =============================================================
            if(cnt <= 0){
                this.$swal({
                    type: 'info',
                    title: 'Info',
                    text: '데이터가 없습니다.'
                })
                return false;
            } else if(cnt > 20000) {
                this.$swal({
                    type: 'warning',
                    title: '데이터가 너무 많습니다.',
                    text: '부분조회 하시겠습니까?',
                    showCancelButton: true,
                    confirmButtonText: '예. 부분조회하겠습니다.',
                    cancelButtonText: '아니요',
                })
                .then((result) => {
                    if(result.value) {
                        this.queryPart();
                        this.handlePart();
                    }
                })
                return false;
            }
            return true;
        },
        // 전체조회
        queryAll: async function(checkClass, isAll) {
            // 스토어 변수 초기화
            this.$store.state.isLoading = true;
            this.$store.state.chartLine1 = [];
            this.$store.state.chartLine2 = [];

            // 데이터 바인딩 객체
            var lineItems1 = [];
            var line1Top = [];
            var line1Bot = [];
            var lineItems2 = [];
            var line2Top = [];
            var line2Bot = [];

            // Min, Max 객체
            var Line1Range = {minAll:0, minTop:0, minBot:0, maxAll:0, maxTop:0, maxBot:0};
            var Line2Range = {minAll:0, minTop:0, minBot:0, maxAll:0, maxTop:0, maxBot:0};

            // 참조형 시퀀스 증가 변수
            var line1SeqAll = {idx:0};
            var line1SeqTop = {idx:0};
            var line1SeqBot = {idx:0};
            var line2SeqAll = {idx:0};
            var line2SeqTop = {idx:0};
            var line2SeqBot = {idx:0};                        

            var param = null;
            if (checkClass == ''){
                param = {plant:this.$store.state.currentCoil.LineName, coilId:this.$store.state.currentCoil.CoilId};
            }else{
                param = {plant:this.$store.state.currentCoil.LineName, coilId:this.$store.state.currentCoil.CoilId, classes:checkClass};
            }

            await axios.get(this.$store.state.baseURL + '/api/coil/', {
                params : param
            })
            .then((response)=>{
                // =============================================================
                // viewCnt에 따른 line1, line2 결정
                // =============================================================
                var line1 = null;
                var line2 = null;
                if (response.data.viewCnt == 2)
                {
                    line1 = response.data.line1;
                    line2 = response.data.line2;
                }
                else
                {
                    line1 = response.data.line2;
                    line2 = response.data.line3;                     
                }

                // =============================================================
                // line1 데이터 바인딩
                // =============================================================
                line1.data.forEach(defect=>{
                    // 전체
                    this.bindingChartData(lineItems1, defect, line1SeqAll);
                    // 전면
                    if (defect.Side == 'TOP') {
                        this.bindingChartData(line1Top, defect, line1SeqTop);
                    // 이면
                    } else if (defect.Side == 'BOT') {
                        this.bindingChartData(line1Bot, defect, line1SeqBot);
                    }                    
                });

                // =============================================================
                // line2 데이터 바인딩
                // =============================================================
                line2.data.forEach(defect=>{
                    // 전체
                    this.bindingChartData(lineItems2, defect, line2SeqAll);
                    // 전면
                    if (defect.Side == 'TOP') {
                        this.bindingChartData(line2Top, defect, line2SeqTop);
                    // 이면
                    } else if (defect.Side == 'BOT') {
                        this.bindingChartData(line2Bot, defect, line2SeqBot);
                    }                    
                });
                
                // 쿼리 유효성 체크
                if (isAll){
                    var result = this.queryCheck(line1.cnt + line2.cnt);
                    if (result == false) return;
                }

                // 범위값 할당
                Line1Range.maxAll = line1SeqAll.idx;
                Line1Range.maxTop = line1SeqTop.idx;
                Line1Range.maxBot = line1SeqBot.idx;
                Line2Range.maxAll = line2SeqAll.idx;
                Line2Range.maxTop = line2SeqTop.idx;
                Line2Range.maxBot = line2SeqBot.idx;

                // 최대, 최소값 스토어 저장
                this.$store.state.defectRange = {line1: Line1Range, line2: Line2Range};

                // 라인정보 스토어 저장
                this.$store.state.line1 = {idx: line1.idx, width: line1.width, length: line1.length, name: line1.name, coil: line1.coil, cnt: line1.cnt};
                this.$store.state.line2 = {idx: line2.idx, width: line2.width, length: line2.length, name: line2.name, coil: line2.coil, cnt: line2.cnt};
                this.queryAfter(lineItems1, line1Top, line1Bot, lineItems2, line2Top, line2Bot);

                // btnDisable - 결함클래스 클릭 가능하게
                this.$store.state.btnDisable = false;
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })
            // 로딩 종료
            this.$store.state.isLoading = false;
        },
        // 부분조회
        queryPart: async function() {
            this.$store.state.linePartLoading = true;
            // 스토어 변수 초기화
            this.$store.state.partLine1 = [];
            this.$store.state.partLine2 = [];
            this.$store.state.partTotal = [];
            this.$store.state.Line1Text = null;
            this.$store.state.Line2Text = null;
            
            await axios.get(this.$store.state.baseURL + '/api/defect/', {
                params : {plant:this.$store.state.currentCoil.LineName, coilId:this.$store.state.currentCoil.CoilId}
            })
            .then((response)=>{
                this.$store.state.partLine1 = response.data.line1.data;
                this.$store.state.partLine2 = response.data.line2.data;
                this.$store.state.Line1Text = response.data.line1.title;
                this.$store.state.Line2Text = response.data.line2.title;

                response.data.total.forEach(t=> {
                    // 시리즈 색상,그룹명 결정
                    var s = this.getSeriesColor(t.Class);
                    // 시리즈 추가
                    this.$store.state.partTotal.push({name: t.Class, All: t.All, color: s.color, group: s.group, show:true});
                })
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })
            this.$store.state.linePartLoading = false;
        },
    },
    mounted() {
        this.$store.state.viewerActive = false;
        this.$store.state.lineActive = true;
        this.$store.state.analyzerActive = false;

        // 초기에 5가지 몇몇 데이터는 기본적으로 숨김데이터를 가지기 위함
        this.$store.state.keepList = [];
        var hideList = ['System', 'Pseudo', 'Fd', 'Un', 'Ps', 'Ongoing', 'Scratch Filter', 'Wd', 'Sy', 'Welding Line', 'Welding Notch', 'Detection Test',
        'Repeat Defect', 'H', 'M2', 'M3', 'Rename', 'F0', 'A4', 'B6 short'];
        // , 'Ongoing', 'Scratch Filter', 'Wd', 'Sy', 'Welding Line', 'Welding Notch', '도금색차', 'Detection Test', 'Repeat Defect'
        hideList.forEach(g=> this.$store.state.keepList.push({name: g}));

        axios.get(this.$store.state.baseURL + '/api/class/').then((response)=>{
            this.result = response.data;
            this.$store.state.classInfo = [];
            response.data.forEach(classes=>{
                this.$store.state.classInfo.push({name:classes.ClassName, desc:classes.ClassDescription, color:classes.Color, id: classes.ClassID, group: classes.GroupName});
            });
        })
        .catch((ex)=>{console.log("ERROR!!!: ", ex);})
    },
    computed: {
        coil1: function() {
            if(this.$store.state.line1 == null) return;
            var coil = this.$store.state.line1.coil
            var name = this.$store.state.line1.name
            return coil + '(' + name + ')'
        },
        coil2: function() {
            if(this.$store.state.line2 == null) return;
            var coil = this.$store.state.line2.coil
            var name = this.$store.state.line2.name
            return coil + '(' + name + ')'
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
    }
}
</script>

<style scoped>
.card{ margin-bottom: 5px; }
.col-sm-3{ margin-right: -35px; margin-left: -5px; max-width: 24%; flex: 0 0 24%; }
.col-sm-9{ max-width: 77.5%; flex: 0 0 78%; }
.custom-icon { width: 15px; margin-top: -3px; color: white; }
.card-header{ font-size: 18px; font-weight: bold; color:white; background-color: lightslategray; padding: 8px; }

#searchlayout{ height: 133px; margin-top: -10px; margin-bottom: 10px; }
#coillistlayout{ height: 295px; font-size: 13px; margin-top: -15px; margin-bottom: 5px; padding-left: 2px; padding-right: 2px; }
#passlinelayout{ height: 60px; margin-top: -15px; }
#infolayout{ height: 233px; font-size: 13px; }
#imglayout{ height: 526px; margin-top: -10px; width: 300px; }
#defectlayout{ -webkit-column-height: 230px; height: 299px; margin-top: -10px; }
#coilmap1layout, #coilmap2layout{ height: 858px; background-color: rgb(217, 217, 217); }

#btnSearchPart{ height: 33px; margin-right: 0px; font-size: 12px; }
#btnSearchAll{ height: 33px; margin-right: 2px; margin-right: 10px; font-size: 12px; } /*margin-left: 90px; -webkit-margin-start: 70px;*/
#prev{ height: 33px; margin-left: 0px; font-size: 12px; background-color: #343a40; border-color: #343a40; }
#next{ height: 33px; margin-left: 0px; font-size: 12px; background-color: #343a40; border-color: #343a40; }
</style>
