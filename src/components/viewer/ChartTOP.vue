<template>
<div>
    <b-btn @click="reverseBtn" :disabled="btndisabled" id="reverse" v-bind:style="{ color: reverseColor, 'background-color': reverseBack }" v-b-tooltip title="반전">
        <custom-icon :name="icon" base-class="custom-icon"></custom-icon>
    </b-btn>

    <b-button @click="Yfixed" id="yfixbtn" v-bind:style="{ color: Ycolor, 'background-color': Ybackcolor }" variant="danger">{{YbtnName}}</b-button>
    <b-button @click="Xfixed" id="xfixbtn" v-bind:style="{ color: Xcolor, 'background-color': Xbackcolor }" variant="primary">{{XbtnName}}</b-button>
    <b-btn @click="tooltipCheck" id="tooltip" v-bind:style="{ color: tooltipColor, 'background-color': tooltipBack }" variant="info">
        {{tooltipLabel}}
    </b-btn>

    <b-btn id="download" @click="downloadBtn" :disabled="btndisabled" v-b-tooltip title="다운로드">
        <custom-icon name="download" base-class="custom-icon"></custom-icon>
    </b-btn>

    <!-- <b-button id="defectclass" variant="info" :disabled="btndisabled" v-b-modal.modal-classTOP>결함 필터</b-button> -->
    <br><br>

    <div class="row">
        <div class="col-sm-1" id="yslider">
            <vue-slider ref="sliderY" v-bind="Yslider" v-model="Yslider.value" @callback="Ycallback"></vue-slider>
        </div>
        <div class="col-sm-11" id="chartposition">
            <!-- 차트 !-->
            <scatter-chart :data="chartData" v-bind:style="{ height, width, 'margin-left': marginleft }"
            :messages="{empty: 'No data'}" :library="chartOptions" :dataset="dataset" ref="chartTop"
            ></scatter-chart>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-11" id="xslider">
            <vue-slider ref="sliderX" v-bind="Xslider" v-model="Xslider.value" @callback="Xcallback"></vue-slider>
        </div>
    </div>
    <!-- <ClassTOP v-on:OnClassTop="ClassHideChange"></ClassTOP> -->
</div>
</template>

<script>
import axios from 'axios'
import vueSlider from '../vue-slider/vue-slider'
// import vueSlider from 'vue-slider-component'
import customIcon from 'vue-icon/lib/vue-feather.esm'
import saveAs from 'file-saver'
import toBlob from 'canvas-toBlob'
// import ClassTOP from './modal/ClassTOP'

export default {
    components: { customIcon, saveAs, toBlob, vueSlider },
    data() {
        return {
            // y바 고정,해제를 위한 버튼 style binding
            YbtnName: 'Y바 고정',
            Ycolor: 'tomato',
            Ybackcolor: 'transparent',
            Ybarfixclick: false,
            // x바 고정,해제를 위한 버튼 style binding
            XbtnName: 'X바 고정',
            Xcolor: '#3498db',
            Xbackcolor: 'transparent',
            Xbarfixclick: false,
            // 차트데이터, 옵션
            height: '750px',
            width: '120%',
            marginleft: '-10px',
            dataset: {
                pointStyle: 'rect',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(217, 217, 217)',
                //pointHoverBackgroundColor: '#fff'
            },
            icon: 'arrow-down',
            reverseCheck: false,
            reverseColor: '#343a40',
            reverseBack: 'transparent',
            tooltipLabel: '툴팁 OFF',
            tooltipColor: '#17a2b8',
            tooltipBack: 'transparent'
        }
    },
    methods: {
        // 키보드 '↑' 클릭 - 이전or다음 결함으로 이동
        upPress() {
            // 차트에서 마지막으로 선택된 엘리먼트
            var el = this.$store.state.clickEl;            
            if (el == null) return;  
            // top 이 아니면 리턴
            if (el.side != 'top') return;
            // Min, Max
            var range = this.$store.state.defectRange.top;
            // 차트
            var ci = this.$refs.chartTop.chart.chart;
            // 차트에 바인딩 되는 객체       
            var all = this.$store.state.chartTOP;
            // 바인딩 객체에서 마지막으로 선택된 결함 
            var curDefect = el.defect;
            if (curDefect == null) return;

            // 다음 결함 번호
            var nextNum = el.seqTop - 1;
            // 다음 결함 객체
            var nextDefect = null;

            while(nextNum >= range.min)
            {
                // 다음 결함 객체 찾기
                var find = null;
                for(var i = 0; i < all.length; i++) {
                    find =  all[i].data.find(g => g[3] == nextNum);
                    if(all[i].hide == false) 
                    {
                        if (find != null)
                        {
                            nextDefect = find[2];
                            break;
                        }
                    }
                }
                if (nextDefect == null) {
                    nextNum--;
                }
                else{
                    break;
                };
            }

            if (nextDefect == null) return;

            // 다음 결함 객체에 해당하는 차트 시리즈 인덱스 찾기
            var idx1 = ci.data.datasets.findIndex(g=> g.label == nextDefect.Class);
            if (idx1 < 0) return;
            // 다음 결함 객체에 해당하는 차트 EL 찾기
            var nextEl = ci.data.datasets[idx1].data.find(g=> g.x == find[0] && g.y == find[1]);
            if (nextEl == null) return;

            // 이전 결함 객체 툴팁 비활성화
            el.el.keepTooltipOpen = false;
            // 다음 결함 객체 툴팁 활성화
            nextEl.keepTooltipOpen = true;

            // 현재 클릭한 el로 만들어주기
            this.$store.state.clickEl = {el:nextEl, idx:idx1, defect: nextDefect, seqTop: nextNum, side: 'top'};
            this.$store.state.oldElTop = nextEl;

            this.keepTooltipLogic(ci, this.$store.state.oldElTop);

            // 차트 디스플레이 갱신
            ci.update();

            // 이미지 가져오기
            axios.get(this.$store.state.baseURL + '/api/defect/', {
                    params: { plant: this.$store.state.currentCoil.LineName, coil: nextDefect.CoilNo, defect: nextDefect.DefectID }
                })
                .then((response) => {
                    this.$store.state.defectImage = response.data;
                    this.$store.state.coildefect = nextDefect;
                })
                .catch((ex) => {
                    console.log("ERROR!!!: ", ex);
                })
        },
        // 키보드 '↓' 클릭 - 이전or다음 결함으로 이동
        downPress() {
            // 차트에서 마지막으로 선택된 엘리먼트
            var el = this.$store.state.clickEl;
            if (el == null) return;
            // top 이 아니면 리턴
            if (el.side != 'top') return;
            // Min, Max
            var range = this.$store.state.defectRange.top;
            // 차트
            var ci = this.$refs.chartTop.chart.chart;
            // 차트에 바인딩 되는 객체
            var all = this.$store.state.chartTOP;
            // 바인딩 객체에서 마지막으로 선택된 결함
            var curDefect = el.defect;
            if (curDefect == null) return;

            // 다음 결함 번호
            var nextNum = el.seqTop + 1;
            // 다음 결함 객체
            var nextDefect = null;

            while(nextNum <= range.max)
            {
                // 다음 결함 객체 찾기
                var find = null;
                for(var i = 0; i < all.length; i++) {
                    find =  all[i].data.find(g => g[3] == nextNum);
                    if(all[i].hide == false) 
                    {
                        if (find != null)
                        {
                            nextDefect = find[2];
                            break;
                        }
                    }
                }
                if (nextDefect == null) {
                    nextNum++;
                }
                else{
                    break;
                };
            }

            if (nextDefect == null) return;

            // 다음 결함 객체에 해당하는 차트 시리즈 인덱스 찾기
            var idx1 = ci.data.datasets.findIndex(g=> g.label == nextDefect.Class);
            if (idx1 < 0) return;
            // 다음 결함 객체에 해당하는 차트 EL 찾기
            var nextEl = ci.data.datasets[idx1].data.find(g=> g.x == find[0] && g.y == find[1]);
            if (nextEl == null) return;

            // 이전 결함 객체 툴팁 비활성화
            el.el.keepTooltipOpen = false;
            // 다음 결함 객체 툴팁 활성화
            nextEl.keepTooltipOpen = true;

            // 현재 클릭한 el로 만들어주기
            this.$store.state.clickEl = {el:nextEl, idx:idx1, defect: nextDefect, seqTop: nextNum, side: 'top'};
            this.$store.state.oldElTop = nextEl;

            this.keepTooltipLogic(ci, this.$store.state.oldElTop);

            // 차트 디스플레이 갱신
            ci.update();

            // 슬라이더 자동 움직임(약간의 수정필요.. tooltip + 더해지는 value값)
            // if(nextEl.y > this.$store.state.YsliderTOP.value[1]) {
            //     this.$store.state.YsliderTOP.value = [this.$store.state.YsliderTOP.value[0] + 200, this.$store.state.YsliderTOP.value[1] + 200];
            //     this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.min += 200;
            //     this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.max += 200;
            // }

            // 이미지 가져오기
            axios.get(this.$store.state.baseURL + '/api/defect/', {
                    params: { plant: this.$store.state.currentCoil.LineName, coil: nextDefect.CoilNo, defect: nextDefect.DefectID }
                })
                .then((response) => {
                    this.$store.state.defectImage = response.data;
                    this.$store.state.coildefect = nextDefect;
                })
                .catch((ex) => {
                    console.log("ERROR!!!: ", ex);
                })
        },
        // reverse버튼 클릭 - 아이콘 변환, 차트 뒤집기
        reverseBtn() {
            if(this.reverseCheck) {
                this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.reverse = true;
                this.$store.state.YsliderTOP.reverse = true;
                this.icon = 'arrow-down';
                this.reverseCheck = false;
                this.reverseColor = '#343a40';
                this.reverseBack = 'transparent';
                // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
                setTimeout(this.ClassHideChange, 10);
            } else {
                this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.reverse = false;
                this.$store.state.YsliderTOP.reverse = false;
                this.icon = 'arrow-up';
                this.reverseCheck = true;
                this.reverseColor = 'white';
                this.reverseBack = '#343a40';
                // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
                setTimeout(this.ClassHideChange, 10);
            }
        },
        // 다운로드 버튼 클릭 - 차트 다운로드
        downloadBtn() {
            // 차트에서 캔버스 속성 가져오기
            var canvas = this.$refs.chartTop.chart.element.lastElementChild;

            var chartName = this.$store.state.chartName.CoilId;
            canvas.toBlob(function(blob) {
                saveAs(blob, chartName + "_전면.jpg");
            });
        },
        // 툴팁 관련 로직
        keepTooltipLogic(ci, obj){
            // 툴팁 유지 할당
            var datasets = ci.data.datasets;
            datasets.forEach(d=>{
                d.data.forEach(el=>el.keepTooltipOpen = false);
                var find = d.data.find(g=> g.x == obj.x && g.y == obj.y);
                if (find != null){
                    if (!d.hidden){
                        find.keepTooltipOpen = true;
                    }
                }
            });

            // 상세보기 팝업 띄운 툴팁은 유지
            this.$store.state.winList.forEach(win => {
                //g.el.keepTooltipOpen = true;
                if (win.active) {
                    datasets.forEach(d=>{
                        var find = d.data.find(g=> win.el.x == g.x && win.el.y == g.y);
                        if (find != null){
                            if (!d.hidden){
                                find.keepTooltipOpen = true;
                            }
                        }                    
                    });
                }
            });
        },
        // 숨겨진 클래스 체크
        ClassHideChange() {
            var ci = this.$refs.chartTop.chart.chart;
            this.$store.state.chartTOP.forEach(el => {
                var find = ci.data.datasets.find(g=>g.label == el.name);
                find.hidden = el.hide;
            });
            
            if(this.$store.state.clickEl != null) {
                // 툴팁 유지 할당
                this.keepTooltipLogic(ci, this.$store.state.clickEl.el);
            }
            
            ci.update();
            this.$store.state.Topchecked = false;
        },
        // Y축 슬라이더바 이동 체크
        Ycallback () {
            var val = {min:this.$store.state.YsliderTOP.value[0], max:this.$store.state.YsliderTOP.value[1]};
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.min = val.min;
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.max = val.max;
            // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
            setTimeout(this.ClassHideChange, 10);
        },
        // X축 슬라이더바 이동 체크
        Xcallback() {
            var val = {min:this.$store.state.XsliderTOP.value[0], max:this.$store.state.XsliderTOP.value[1]};
            this.$store.state.chartOptionsTOP.scales.xAxes[0].ticks.min = val.min;
            this.$store.state.chartOptionsTOP.scales.xAxes[0].ticks.max = val.max;
            // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
            setTimeout(this.ClassHideChange, 10);
        },
        // y바 고정/해제 클릭
        Yfixed() {
            if(this.Ybarfixclick == false)
            {
                this.$store.state.YsliderTOP.fixed = true;
                this.Ybarfixclick = true;
                this.YbtnName = 'Y바 해제';
                this.Ycolor= 'white';
                this.Ybackcolor= 'tomato';
                this.$store.state.YsliderTOP.sliderStyle[0].backgroundColor = 'tomato';
                this.$store.state.YsliderTOP.sliderStyle[1].backgroundColor = 'tomato';

                setTimeout(this.ClassHideChange, 10);
            }
            else
            {
                this.$store.state.YsliderTOP.fixed = false;
                this.Ybarfixclick = false;
                this.YbtnName = 'Y바 고정';
                this.Ycolor= 'tomato';
                this.Ybackcolor= 'transparent';
                this.$store.state.YsliderTOP.sliderStyle[0].backgroundColor = 'white';
                this.$store.state.YsliderTOP.sliderStyle[1].backgroundColor = 'white';

                setTimeout(this.ClassHideChange, 10);
            }
        },
        // x바 고정/해제 클릭
        Xfixed() {
            if(this.Xbarfixclick == false)
            {
                this.$store.state.XsliderTOP.fixed = true;
                this.Xbarfixclick = true;
                this.XbtnName = 'X바 해제';
                this.Xcolor= 'white';
                this.Xbackcolor= '#3498db';
                this.$store.state.XsliderTOP.sliderStyle[0].backgroundColor = '#3498db';
                this.$store.state.XsliderTOP.sliderStyle[1].backgroundColor = '#3498db';

                setTimeout(this.ClassHideChange, 10);
            }
            else
            {
                this.$store.state.XsliderTOP.fixed = false;
                this.Xbarfixclick = false;
                this.XbtnName = 'X바 고정';
                this.Xcolor= '#3498db';
                this.Xbackcolor= 'transparent';
                this.$store.state.XsliderTOP.sliderStyle[0].backgroundColor = 'white';
                this.$store.state.XsliderTOP.sliderStyle[1].backgroundColor = 'white';

                setTimeout(this.ClassHideChange, 10);
            }
        },
        // 툴팁OFF/툴팁ON 버튼 클릭 - 이름변환, 툴팁 내용 없음으로 변환
        tooltipCheck() {
            this.$store.state.tooltipCheckTop = !this.$store.state.tooltipCheckTop;

            if(this.$store.state.tooltipCheckTop) {
                this.tooltipLabel = '툴팁 OFF';
                this.tooltipColor = '#17a2b8';
                this.tooltipBack = 'transparent';
                this.$store.state.chartOptionsTOP.tooltips.backgroundColor = 'rgba(0,0,0,0.8)';
            }
            else {
                this.tooltipLabel = '툴팁 ON';
                this.tooltipColor = 'white';
                this.tooltipBack = '#17a2b8';
                this.$store.state.chartOptionsTOP.tooltips.backgroundColor = 'white';
            }
            setTimeout(this.ClassHideChange, 10);
        }
    },
    computed: {
        chartData: function() {
            return this.$store.state.chartTOP
        },
        chartOptions: function() {
            return this.$store.state.chartOptionsTOP
        },
        Xslider: function() {
            return this.$store.state.XsliderTOP
        },
        Yslider: function() {
            return this.$store.state.YsliderTOP
        },
        btndisabled: function() {
            return this.$store.state.classclick
        },
        filterCheck: function() {
            return this.$store.state.Topchecked
        }
    },   
    mounted(){        
        this.$store.state.topSlider = this.$refs.sliderX;
        this.$store.state.topChart = this.$refs.chartTop;
    },
    watch: {
        chartData: function(val) {
            if (val.length == 0) return;

            // var ci = this.$refs.chartTop.chart.chart;
            // var idx = ci.data.datasets.findIndex(g=> g.label == 'I1');
            // if(idx == null) return;
            // ci.data.datasets[idx].pointStyle = 'triangle';
            // var t = ci.data.datasets[idx].pointStyle;

            // reverse 버튼 초기화
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.reverse = true;
            this.$store.state.YsliderTOP.reverse = true;
            this.icon = 'arrow-down';
            this.reverseCheck = false;
            this.reverseColor = '#343a40';
            this.reverseBack = 'transparent';
            // Y바 고정 버튼 초기화
            this.$store.state.YsliderTOP.fixed = false;
            this.Ybarfixclick = false;
            this.YbtnName = 'Y바 고정';
            this.Ycolor= 'tomato';
            this.Ybackcolor= 'transparent';
            this.$store.state.YsliderTOP.sliderStyle[0].backgroundColor = 'white';
            this.$store.state.YsliderTOP.sliderStyle[1].backgroundColor = 'white';
            // X바 고정 버튼 초기화
            this.$store.state.XsliderTOP.fixed = false;
            this.Xbarfixclick = false;
            this.XbtnName = 'X바 고정';
            this.Xcolor= '#3498db';
            this.Xbackcolor= 'transparent';
            this.$store.state.XsliderTOP.sliderStyle[0].backgroundColor = 'white';
            this.$store.state.XsliderTOP.sliderStyle[1].backgroundColor = 'white';

            // 이미지 데이터 초기화
            this.$store.state.defectImage = null;
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.min = 0;
            this.$store.state.YsliderTOP.min = 0;
            this.$store.state.YsliderTOP.max = 1000;
            this.$store.state.XsliderTOP.min = 0;
            this.$store.state.XsliderTOP.max = 1000;

            // tooltip 초기화
            this.$store.state.tooltipCheckTop = true;
            this.tooltipLabel = '툴팁 OFF';
            this.tooltipColor = '#17a2b8';
            this.tooltipBack = 'transparent';
            this.$store.state.chartOptionsTOP.tooltips.backgroundColor = 'rgba(0,0,0,0.8)';

            setTimeout(this.ClassHideChange, 10);
        },
        filterCheck: function() {
            setTimeout(this.ClassHideChange, 10);
        }
    },
    created: function() {
        window.addEventListener('keydown', (e) => {
            if(e.key == 'u') {
                this.Yfixed()
            } else if(e.key == 'i') {
                this.Xfixed()
            } else if(e.keyCode == '38') { // 키보드 위
                if(!this.reverseCheck) {
                    this.upPress();
                } else {
                    this.downPress();
                }
            } else if(e.keyCode == '40') { // 키보드 아래
                if(!this.reverseCheck) {
                    this.downPress();
                } else {
                    this.upPress();
                }
            }
        })
    }
}
</script>

<style scoped>
button{ font-size: 12px;}
input{ width: 7%; height: 33px; text-align: center; }

.form-control{ display:inline-block; width: 7%; }
.btn{ border: 0; margin-top: -10px;}
.custom-icon { width: 12px; margin-top: -3px; }
.col-sm-1{ flex: 0 0 18.333333%; }

#yslider{ margin-left: 0px; margin-top: -2px; }
#xslider{ margin-left: 13%; }
#chartposition{ margin-left: -50px; }

#yfixbtn{ border: 1px solid tomato; }
#xfixbtn{ border: 1px solid #3498db; margin-right: 10px; }
#download{ height: 32px; margin-right: 10px; }
#defectclass{ border: 1px solid #17a2b8; background-color: #17a2b8; } /* margin-left: 45%;*/

#reverse{ height: 32px; margin-right: 10px; border: 1px solid #343a40; }
#tooltip{ height: 32px; margin-right: 10px; border: 1px solid #17a2b8; }
</style>
