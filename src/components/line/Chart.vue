<template>
<div class="row">
    <!-- 1번째 차트 -->
    <div class="col-sm-6">
        <div class="card" style="margin-right: -10px; margin-left: 4px;">
            <div class="card-header">
                <label v-if="this.$store.state.line1.name == null" style="margin-top: 4px; margin-left: 8px;">코일맵</label>
                <label v-if="this.$store.state.line1.name != null" style="font-weight: bold; margin-left: 8px; padding: 0; margin-top: 3px;">{{coil1}}</label>

                <div style="float: right; margin-right: 10px;">
                    <label v-if="this.$store.state.line1.name != null" id="alltext1" v-bind:style="{ 'color': fontcolor1 }" @click="allDisplay1">전체</label> 
                    <label v-if="this.$store.state.line1.name != null">/</label>
                    <label v-if="this.$store.state.line1.name != null" id="toptext1" v-bind:style="{ 'color': fontcolor2 }" @click="topDisplay1">전면</label> 
                    <label v-if="this.$store.state.line1.name != null">/</label>
                    <label v-if="this.$store.state.line1.name != null" id="bottext1" v-bind:style="{ 'color': fontcolor3 }" @click="botDisplay1">이면</label>
                </div>
            </div>
            <div class="card-body" style="background-color: rgb(217, 217, 217);">
                <div class="row" style="height: 50px;">
                    <div class="col-sm-12">
                        <b-btn @click="reverseBtn1" :disabled="btndisabled" id="reverse" v-bind:style="{ color: reverseColor1, 'background-color': reverseBack1 }" v-b-tooltip title="반전">
                            <custom-icon :name="icon1" base-class="custom-icon"></custom-icon>
                        </b-btn>
                        <b-button @click="Yfixed1" id="yfixbtn" v-bind:style="{ color: Ycolor1, 'background-color': Ybackcolor1 }" variant="danger">{{YbtnName1}}</b-button>
                        <b-button @click="Xfixed1" id="xfixbtn" v-bind:style="{ color: Xcolor1, 'background-color': Xbackcolor1 }" variant="primary">{{XbtnName1}}</b-button>
                        <b-btn @click="tooltipCheck1" id="tooltip" v-bind:style="{ color: tooltipColor1, 'background-color': tooltipBack1 }" variant="info">
                            {{tooltipLabel1}}
                        </b-btn>
                        <b-btn id="download" @click="downloadBtn1" :disabled="btndisabled" v-b-tooltip title="다운로드">
                            <custom-icon name="download" base-class="custom-icon"></custom-icon>
                        </b-btn>
                        <b-button id="defectclass" variant="info" :disabled="btndisabled" v-b-modal.modal-classLine1>결함 필터</b-button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-1">
                        <vue-slider ref="sliderY1" v-bind="Yslider1" v-model="Yslider1.value" @callback="Ycallback1"></vue-slider>
                    </div>
                    <div class="col-sm-11">
                        <!-- 차트 !-->
                        <scatter-chart id="chart1" v-bind:style="{height, 'margin-left': marginleft}" :data="chartData1" :messages="{empty: 'No data'}" :library="chartOptions1" :dataset="dataset" ref="chartLine1"></scatter-chart>
                        <!-- 슬라이더 !-->
                        <div id="xslider">
                            <vue-slider v-bind:style="{'margin-left': marginleft}" ref="sliderX1" v-bind="Xslider1" v-model="Xslider1.value" @callback="Xcallback1"></vue-slider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 2번째 차트 -->
    <div class="col-sm-6">
        <div class="card" style="margin-left: -10px;">
            <div class="card-header">
                <label v-if="this.$store.state.line2.name == null" style="margin-top: 4px; margin-left: 8px;">코일맵</label>
                <label v-if="this.$store.state.line2.name != null" style="font-weight: bold; margin-left: 8px; padding: 0; margin-top: 3px;">{{coil2}}</label>

                <div style="float: right; margin-right: 10px;">
                    <label v-if="this.$store.state.line2.name != null" id="alltext1" v-bind:style="{ 'color': fontcolor4 }" @click="allDisplay2">전체</label>
                    <label v-if="this.$store.state.line2.name != null">/</label>
                    <label v-if="this.$store.state.line2.name != null" id="toptext1" v-bind:style="{ 'color': fontcolor5 }" @click="topDisplay2">전면</label>
                    <label v-if="this.$store.state.line2.name != null">/</label>
                    <label v-if="this.$store.state.line2.name != null" id="bottext1" v-bind:style="{ 'color': fontcolor6 }" @click="botDisplay2">이면</label>
                </div>
            </div>
            <div class="card-body" style="background-color: rgb(217, 217, 217);">
                <div class="row" style="height: 50px;">
                    <div class="col-sm-12">
                        <b-btn @click="reverseBtn2" :disabled="btndisabled" id="reverse" v-bind:style="{ color: reverseColor2, 'background-color': reverseBack2 }" v-b-tooltip title="반전">
                            <custom-icon :name="icon2" base-class="custom-icon"></custom-icon>
                        </b-btn>
                        <b-button @click="Yfixed2" id="yfixbtn" v-bind:style="{ color: Ycolor2, 'background-color': Ybackcolor2 }" variant="danger">{{YbtnName2}}</b-button>
                        <b-button @click="Xfixed2" id="xfixbtn" v-bind:style="{ color: Xcolor2, 'background-color': Xbackcolor2 }" variant="primary">{{XbtnName2}}</b-button>
                        <b-btn @click="tooltipCheck2" id="tooltip" v-bind:style="{ color: tooltipColor2, 'background-color': tooltipBack2 }" variant="info">
                            {{tooltipLabel2}}
                        </b-btn>
                        <b-btn id="download" @click="downloadBtn2" :disabled="btndisabled" v-b-tooltip title="다운로드">
                            <custom-icon name="download" base-class="custom-icon"></custom-icon>
                        </b-btn>
                        <b-button id="defectclass" variant="info" :disabled="btndisabled" v-b-modal.modal-classLine2>결함 필터</b-button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-11">
                        <!-- 차트 !-->
                        <scatter-chart id="chart2" v-bind:style="{height, 'margin-left': marginleft}" :data="chartData2" :messages="{empty: 'No data'}" :library="chartOptions2" :dataset="dataset" ref="chartLine2"></scatter-chart>
                        <!-- 슬라이더 !-->
                        <div id="xslider1">
                            <vue-slider v-bind:style="{'margin-left': marginleft}" ref="sliderX2" v-bind="Xslider2" v-model="Xslider2.value" @callback="Xcallback2"></vue-slider>
                        </div>
                    </div>
                    <div class="col-sm-1" id="yslider">
                        <vue-slider ref="sliderY2" v-bind="Yslider2" v-model="Yslider2.value" @callback="Ycallback2"></vue-slider>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ClassLine1 v-on:OnClassLine1="ClassHideChange1"></ClassLine1>
    <ClassLine2 v-on:OnClassLine2="ClassHideChange2"></ClassLine2>
</div>
</template>

<script>
import axios from 'axios'
import vueSlider from '../vue-slider/vue-slider'
import customIcon from 'vue-icon/lib/vue-feather.esm'
import ClassLine1 from './modal/ClassLine1'
import ClassLine2 from './modal/ClassLine2'

var cp = {
    id: 'line-plugin',
    //chartIdx: 0,
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
    }, // end afterDatasetsDraw   
    afterDraw: function(chart) {
        if (lastEl.el == null) return;
        var title = chart.options.title.text;
        if (title == "chart" + lastEl.idx) {
            return;
        }

        var ctxPlugin = chart.chart.ctx;
        ctxPlugin.strokeStyle = "red";

        // 비율 계산을 위한 변수
        var line1Length = line.line1;
        var line2Length = line.line2;
        var lineRate = 0;
        var canvasRate1 = 0;
        var canvasRate2 = 0;

        // 차트1 클릭 시
        if(lastEl.idx == 1) 
        {
            // 비율
            canvasRate2 = ctxPlugin.canvas.offsetHeight / line2Length;

            // 차트2의 Y좌표 Min, Max 현재값
            var min = line.min2 * canvasRate2;
            var max = line.max2 * canvasRate2;
            // 차트2에 그려질 높이값
            var heightRate =  ctxPlugin.canvas.offsetHeight / (max-min); // var heightRate =  1;

            // 차트1 클릭한 위치를 차트2에 반영한 좌표
            var locationLength = location.y1 * (line2Length / ctxPlugin.canvas.offsetHeight);
            // 차트2 Y좌표 줌인 좌표
            var barLocation = locationLength - line.min2;
            // 캔버스에 그려질 좌표
            var canvasLocation = barLocation / (line.max2 - line.min2) * ctxPlugin.canvas.offsetHeight;
            
            // y 좌표값
            var y = 0;
            if(!reverseCheck1 && reverseCheck2) {
                y = ctxPlugin.canvas.offsetHeight - canvasLocation - 20;
            } else if(reverseCheck1 && !reverseCheck2){
                y = ctxPlugin.canvas.offsetHeight - canvasLocation - 20;
            } else {
                y = canvasLocation;
            }

            // 차트1의 값이 차트2에 포함이 되지 않으면 그리지 않는다.
            if(locationLength < line.min2 || locationLength > line.max2) return;

            // 센터 보정값
            var cPad = 30 * heightRate;
            // 보정값
            var padRate = line2Length / (line.max2 - line.min2) * heightRate;

            // 차트2에 네모박스 그리기 (y: 좌표값 - 센터보정값 - 보정값 )
            ctxPlugin.strokeRect(6, y - cPad - padRate, 325, 60 * heightRate);
        }
        // 차트2 클릭 시
        else
        {
            // 비율
            canvasRate1 = ctxPlugin.canvas.offsetHeight / line1Length;

            // reverse시 location.y1의 좌표 변경
            if((!reverseCheck1 && !reverseCheck2)) {
                location.y2 = location.y2;
            } else if(reverseCheck1 && reverseCheck2) {
                location.y2 = ctxPlugin.canvas.offsetHeight - location.y2;
            } else if(reverseCheck1 && !reverseCheck2) {
                location.y2 = location.y2;
            } else if(!reverseCheck1 && reverseCheck2) {
                location.y2 = ctxPlugin.canvas.offsetHeight - location.y2;
            }

            // 차트1의 Y좌표 Min, Max 현재값
            var min = line.min1 * canvasRate1;
            var max = line.max1 * canvasRate1;
            // 차트1에 그려질 높이값
            var heightRate =  ctxPlugin.canvas.offsetHeight / (max-min);
            
            // 차트2 클릭한 위치를 차트1에 반영한 좌표
            var locationLength = location.y2 * (line1Length / ctxPlugin.canvas.offsetHeight);
            // 차트1 Y좌표 줌인 좌표
            var barLocation = locationLength - (line1Length - line.max1);
            // 캔버스에 그려질 좌표
            var canvasLocation = barLocation / (line.max1 - line.min1) * ctxPlugin.canvas.offsetHeight;

            // y 좌표값
            var y = 0;
            if(reverseCheck1 && reverseCheck2) {
                y = ctxPlugin.canvas.offsetHeight - canvasLocation - 20;
            } else if(reverseCheck1 && !reverseCheck2) {
                y = ctxPlugin.canvas.offsetHeight - canvasLocation - 20;
            } else {
                y = canvasLocation;
            }

            // 차트2의 값이 차트1에 포함이 되지 않으면 그리지 않는다.
            var sLocation = (1 - locationLength / ctxPlugin.canvas.offsetHeight) * line1Length;
            if(sLocation < line.min1 || sLocation > line.max1) return;

            // 센터 보정값
            var cPad = 30 * heightRate;
            // 보정값
            var padRate = line1Length / (line.max1 - line.min1) * heightRate;

            // 차트1에 네모박스 그리기 (y: 좌표값 - 센터보정값 - 보정값)
            ctxPlugin.strokeRect(38, y - cPad - padRate, 322, 60 * heightRate);
        }
    }
}

//var Area = {idx:0, val:0}
var line = {line1: 0, line2: 0, min1: 0, min2: 0, max1: 0, max2: 0};
var lastEl = {idx:0, el:null};
var reverseCheck1 = false;
var reverseCheck2 = true;
var location = {y1: 0, y2: 0};

export default {
    components: { vueSlider, ClassLine1, ClassLine2, customIcon },
    data() {
        return {
            // 차트 스타일
            height: '747px',
            marginleft: '0px',
            // 차트 옵션
            chartOptions1: {
                title: {
                    display: false,
                    text: 'chart1'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 10,
                            min: 0,
                            stepSize: 500
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 1000,
                            min: 0,
                            stepSize: 500,
                            reverse: false
                        }
                    }]
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    callbacks: {
                        
                    }
                }
            },
            chartOptions2: {
                title: {
                    display: false,
                    text: 'chart2'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 10,
                            min: 0,
                            stepSize: 500
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 1000,
                            min: 0,
                            stepSize: 500,
                            reverse: true
                        },
                        position: 'right'
                    }]
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    callbacks: {

                    }
                },
            },
            // 차트 데이터 모양 및 크기
            dataset: {
                pointStyle: 'rect',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: 'transparent'
            },
            // 슬라이더
            Xslider1: {
                value: [0, 1000],
                width: "100%",
                height: 4,
                dotSize: 22,
                min: 0,
                max: 1000,
                fixed: false,
                show: true,
                lazy: true,
                useKeyboard: true,
                tooltip: 'always',
                tooltipDir: 'left',
                formatter: (v) => `${v}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                enableCross: false,
                processDragable: true,
                bgStyle: {
                    backgroundColor: '#fff',
                    boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
                },
                sliderStyle: [{
                        "backgroundColor": "white"
                    },
                    {
                        "backgroundColor": "white"
                    }
                ],
                tooltipStyle: [{
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    },
                    {
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    }
                ],
                processStyle: {
                    backgroundColor: '#3498db'
                },
                direction: "horizontal",
            },
            Xslider2: {
                value: [0, 1000],
                width: "92%",
                height: 4,
                dotSize: 22,
                min: 0,
                max: 1000,
                fixed: false,
                show: true,
                lazy: true,
                useKeyboard: true,
                tooltip: 'always',
                tooltipDir: 'right',
                formatter: (v) => `${v}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                enableCross: false,
                processDragable: true,
                bgStyle: {
                    backgroundColor: '#fff',
                    boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
                },
                sliderStyle: [{
                        "backgroundColor": "white"
                    },
                    {
                        "backgroundColor": "white"
                    }
                ],
                tooltipStyle: [{
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    },
                    {
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    }
                ],
                processStyle: {
                    backgroundColor: '#3498db'
                },
                direction: "horizontal",
            },
            Yslider1: {
                value: [0, 1000],
                width: 4,
                height: 705,
                dotSize: 22,
                min: 0,
                max: 1000,
                fixed: false,
                reverse: false,
                show: true,
                lazy: true,
                useKeyboard: true,
                tooltip: 'always',
                tooltipDir: 'bottom',
                formatter: (v) => `${v}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                enableCross: false,
                processDragable: true,
                // mergeFormatter: '{value1}M ~ {value2}M',
                bgStyle: {
                    backgroundColor: '#fff',
                    boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
                },
                sliderStyle: [{
                        "backgroundColor": "white"
                    },
                    {
                        "backgroundColor": "white"
                    }
                ],
                tooltipStyle: [{
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    },
                    {
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    }
                ],
                processStyle: {
                    backgroundColor: 'tomato'
                },
                direction: "vertical",
            },
            Yslider2: {
                value: [0, 1000],
                width: 4,
                height: 705,
                dotSize: 22,
                min: 0,
                max: 1000,
                fixed: false,
                reverse: true,
                show: true,
                lazy: true,
                useKeyboard: true,
                tooltip: 'always',
                tooltipDir: 'bottom',
                formatter: (v) => `${v}m`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                enableCross: false,
                processDragable: true,
                // mergeFormatter: '{value1}M ~ {value2}M',
                bgStyle: {
                    backgroundColor: '#fff',
                    boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
                },
                sliderStyle: [{
                        "backgroundColor": "white"
                    },
                    {
                        "backgroundColor": "white"
                    }
                ],
                tooltipStyle: [{
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    },
                    {
                        "backgroundColor": "dimgray",
                        "borderColor": "dimgray"
                    }
                ],
                processStyle: {
                    backgroundColor: 'tomato'
                },
                direction: "vertical",
            },
            // el
            oldEl1: null,
            oldEl2: null,
            elFirstcheck1: false,
            elFirstcheck2: false,
            // --------------- 1번 ----------------- //
            // y바 고정,해제를 위한 버튼 style binding
            YbtnName1: 'Y바 고정',
            Ycolor1: 'tomato',
            Ybackcolor1: 'transparent',
            Ybarfixclick1: false,
            // x바 고정,해제를 위한 버튼 style binding
            XbtnName1: 'X바 고정',
            Xcolor1: '#3498db',
            Xbackcolor1: 'transparent',
            Xbarfixclick1: false,
            // 차트 위, 아래 반전 버튼 style binding
            icon1: 'arrow-up',
            //reverseCheck1: false,
            reverseColor1: 'white',
            reverseBack1: '#343a40',
            // --------------- 2번 ----------------- //
            // y바 고정,해제를 위한 버튼 style binding
            YbtnName2: 'Y바 고정',
            Ycolor2: 'tomato',
            Ybackcolor2: 'transparent',
            Ybarfixclick2: false,
            // x바 고정,해제를 위한 버튼 style binding
            XbtnName2: 'X바 고정',
            Xcolor2: '#3498db',
            Xbackcolor2: 'transparent',
            Xbarfixclick2: false,
            // 차트 위, 아래 반전 버튼 style binding
            icon2: 'arrow-down',
            //reverseCheck2: false,
            reverseColor2: '#343a40',
            reverseBack2: 'transparent',
            // 전체, 전면, 이면 라벨 style binding
            fontcolor1: 'blue',
            fontcolor2: '',
            fontcolor3: '',
            fontcolor4: 'blue',
            fontcolor5: '',
            fontcolor6: '',
            // tooltip
            tooltipChecks1: true,
            tooltipLabel1: '툴팁 OFF',
            tooltipColor1: '#17a2b8',
            tooltipBack1: 'transparent',
            tooltipChecks2: true,
            tooltipLabel2: '툴팁 OFF',
            tooltipColor2: '#17a2b8',
            tooltipBack2: 'transparent'
        }
    },
    methods: {
        // 키보드 '↑' 클릭 - 이전or다음 결함으로 이동
        upPress() {
            if(lastEl.idx == 1) {
                // 차트에서 마지막으로 선택된 엘리먼트
                var el = this.oldEl1;            
                if (el == null) return;
                // Min, Max
                var range = this.$store.state.defectRange.line1;
                // 차트
                var ci = this.$refs.chartLine1.chart.chart;
                var ci2 = this.$refs.chartLine2.chart.chart;
                // 차트에 바인딩 되는 객체
                var all = this.$store.state.chartLine1;
                // 다음 결함 번호
                var nextNum = el.seq1 - 1;
                // 차트 선택 번호 저장
                lastEl.idx = 1;
            } else {
                // 차트에서 마지막으로 선택된 엘리먼트
                var el = this.oldEl2;            
                if (el == null) return;
                // Min, Max
                var range = this.$store.state.defectRange.line2;
                // 차트
                var ci = this.$refs.chartLine2.chart.chart;
                var ci2 = this.$refs.chartLine1.chart.chart;
                // 차트에 바인딩 되는 객체
                var all = this.$store.state.chartLine2;
                // 다음 결함 번호
                var nextNum = el.seq2 - 1;
                // 차트 선택 번호 저장
                lastEl.idx = 2;
            }
            // 바인딩 객체에서 마지막으로 선택된 결함 
            var curDefect = el.defect;
            if (curDefect == null) return;

            // 다음 결함 객체
            var nextDefect = null;

            while(nextNum >= range.minAll)
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

            if(lastEl.idx == 1) {
                // 현재 클릭한 el로 만들어주기
                this.oldEl1 = {el:nextEl, idx:idx1, defect: nextDefect, seq1: nextNum};
                this.keepTooltipLogic(ci, this.oldEl1);
            } else {
                // 현재 클릭한 el로 만들어주기
                this.oldEl2 = {el:nextEl, idx:idx1, defect: nextDefect, seq2: nextNum};
                this.keepTooltipLogic(ci, this.oldEl2);
            }

            // 캔버스 좌표 저장
            lastEl.el = nextEl;

            // 차트 디스플레이 갱신
            ci.update();
            ci2.update();

            if(lastEl.idx == 1) {
                // 이미지 가져오기
                axios.get(this.$store.state.baseURL + '/api/defect/', {
                        params: { plant: this.$store.state.line1.idx, coil: nextDefect.CoilNo, defect: nextDefect.DefectID }
                    })
                    .then((response) => {
                        this.$store.state.defectImage1 = response.data;
                        this.$store.state.coildefect1 = nextDefect;
                    })
                    .catch((ex) => {
                        console.log("ERROR!!!: ", ex);
                    })
            } else {
                // 이미지 가져오기
                axios.get(this.$store.state.baseURL + '/api/defect/', {
                        params: { plant: this.$store.state.line2.idx, coil: nextDefect.CoilNo, defect: nextDefect.DefectID }
                    })
                    .then((response) => {
                        this.$store.state.defectImage2 = response.data;
                        this.$store.state.coildefect2 = nextDefect;
                    })
                    .catch((ex) => {
                        console.log("ERROR!!!: ", ex);
                    })
            }
        },
        // 키보드 '↓' 클릭 - 이전or다음 결함으로 이동
        downPress() {
            if(lastEl.idx == 1) {
                // 차트에서 마지막으로 선택된 엘리먼트
                var el = this.oldEl1;
                if (el == null) return;
                // Min, Max
                var range = this.$store.state.defectRange.line1;
                // 차트
                var ci = this.$refs.chartLine1.chart.chart;
                var ci2 = this.$refs.chartLine2.chart.chart;
                // 차트에 바인딩 되는 객체
                var all = this.$store.state.chartLine1;
                // 다음 결함 번호
                var nextNum = el.seq1 + 1;
                // 차트 선택 번호 저장
                lastEl.idx = 1;
            } else {
                // 차트에서 마지막으로 선택된 엘리먼트
                var el = this.oldEl2;
                if (el == null) return;
                // Min, Max
                var range = this.$store.state.defectRange.line2;
                // 차트
                var ci = this.$refs.chartLine2.chart.chart;
                var ci2 = this.$refs.chartLine1.chart.chart;
                // 차트에 바인딩 되는 객체
                var all = this.$store.state.chartLine2;
                // 다음 결함 번호
                var nextNum = el.seq2 + 1;
                // 차트 선택 번호 저장
                lastEl.idx = 2;
            }
            // 바인딩 객체에서 마지막으로 선택된 결함
            var curDefect = el.defect;
            if (curDefect == null) return;

            // 다음 결함 객체
            var nextDefect = null;

            while(nextNum <= range.maxAll)
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

            if(lastEl.idx == 1) {
                // 현재 클릭한 el로 만들어주기
                this.oldEl1 = {el:nextEl, idx:idx1, defect: nextDefect, seq1: nextNum};
                this.keepTooltipLogic(ci, this.oldEl1);
            } else {
                // 현재 클릭한 el로 만들어주기
                this.oldEl2 = {el:nextEl, idx:idx1, defect: nextDefect, seq2: nextNum};
                this.keepTooltipLogic(ci, this.oldEl2);
            }

            // 캔버스 좌표 저장
            lastEl.el = nextEl;

            // 차트 디스플레이 갱신
            ci.update();
            ci2.update();

            if(lastEl.idx == 1) {
                // 이미지 가져오기
                axios.get(this.$store.state.baseURL + '/api/defect/', {
                        params: { plant: this.$store.state.line1.idx, coil: nextDefect.CoilNo, defect: nextDefect.DefectID }
                    })
                    .then((response) => {
                        this.$store.state.defectImage1 = response.data;
                        this.$store.state.coildefect1 = nextDefect;
                    })
                    .catch((ex) => {
                        console.log("ERROR!!!: ", ex);
                    })
            } else {
                // 이미지 가져오기
                axios.get(this.$store.state.baseURL + '/api/defect/', {
                        params: { plant: this.$store.state.line2.idx, coil: nextDefect.CoilNo, defect: nextDefect.DefectID }
                    })
                    .then((response) => {
                        this.$store.state.defectImage2 = response.data;
                        this.$store.state.coildefect2 = nextDefect;
                    })
                    .catch((ex) => {
                        console.log("ERROR!!!: ", ex);
                    })
            }
        },
        // reverse버튼 클릭 - 아이콘 변환, 차트 뒤집기
        reverseBtn1() {
            if(reverseCheck1) {
                this.chartOptions1.scales.yAxes[0].ticks.reverse = false;
                this.Yslider1.reverse = false;
                this.icon1 = 'arrow-up';
                reverseCheck1 = false;
                this.reverseColor1 = 'white';
                this.reverseBack1 = '#343a40';
                this.$store.state.reverseBtnClick1 = true;
                // 차트 갱신
                setTimeout(this.ClassHideChange1, 10);
            } else {
                this.chartOptions1.scales.yAxes[0].ticks.reverse = true;
                this.Yslider1.reverse = true;
                this.icon1 = 'arrow-down';
                reverseCheck1 = true;
                this.reverseColor1 = '#343a40';
                this.reverseBack1 = 'transparent';
                this.$store.state.reverseBtnClick1 = false;
                // 차트 갱신
                setTimeout(this.ClassHideChange1, 10);
            }
        },
        reverseBtn2() {
            if(reverseCheck2) {
                this.chartOptions2.scales.yAxes[0].ticks.reverse = true;
                this.Yslider2.reverse = true;
                this.icon2 = 'arrow-down';
                reverseCheck2 = false;
                this.reverseColor2 = '#343a40';
                this.reverseBack2 = 'transparent';
                this.$store.state.reverseBtnClick2 = false;
                // 차트 갱신
                setTimeout(this.ClassHideChange2, 10);
            } else {
                this.chartOptions2.scales.yAxes[0].ticks.reverse = false;
                this.Yslider2.reverse = false;
                this.icon2 = 'arrow-up';
                reverseCheck2 = true;
                this.reverseColor2 = 'white';
                this.reverseBack2 = '#343a40';
                this.$store.state.reverseBtnClick2 = true;
                // 차트 갱신
                setTimeout(this.ClassHideChange2, 10);
            }
        },
        // 툴팁OFF/툴팁ON 버튼 클릭 - 이름변환, 툴팁 내용 없음으로 변환
        tooltipCheck1() {
            this.tooltipChecks1 = !this.tooltipChecks1;

            if(this.tooltipChecks1) {
                this.tooltipLabel1 = '툴팁 OFF';
                this.tooltipColor1 = '#17a2b8';
                this.tooltipBack1 = 'transparent';
                this.chartOptions1.tooltips.backgroundColor = 'rgba(0,0,0,0.8)';
            }
            else {
                this.tooltipLabel1 = '툴팁 ON';
                this.tooltipColor1 = 'white';
                this.tooltipBack1 = '#17a2b8';
                this.chartOptions1.tooltips.backgroundColor = 'white';
            }
            setTimeout(this.ClassHideChange1, 10);
        },
        tooltipCheck2() {
            this.tooltipChecks2 = !this.tooltipChecks2;

            if(this.tooltipChecks2) {
                this.tooltipLabel2 = '툴팁 OFF';
                this.tooltipColor2 = '#17a2b8';
                this.tooltipBack2 = 'transparent';
                this.chartOptions2.tooltips.backgroundColor = 'rgba(0,0,0,0.8)';
            }
            else {
                this.tooltipLabel2 = '툴팁 ON';
                this.tooltipColor2 = 'white';
                this.tooltipBack2 = '#17a2b8';
                this.chartOptions2.tooltips.backgroundColor = 'white';
            }
            setTimeout(this.ClassHideChange2, 10);
        },
        // 다운로드 버튼 클릭 - 차트 다운로드
        downloadBtn1() {
            // 차트에서 캔버스 속성 가져오기
            var canvas = this.$refs.chartLine1.chart.element.lastElementChild;

            var chartName = this.coil1;
            canvas.toBlob(function(blob) {
                saveAs(blob, chartName + ".jpg");
            });
        },
        downloadBtn2() {
            // 차트에서 캔버스 속성 가져오기
            var canvas = this.$refs.chartLine2.chart.element.lastElementChild;

            var chartName = this.coil2;
            canvas.toBlob(function(blob) {
                saveAs(blob, chartName + ".jpg");
            });
        },
        // 차트 클릭 이벤트
        chartClick1: function(evt) {
            var ci1 = this.$refs.chartLine1.chart.chart;
            var ci2 = this.$refs.chartLine2.chart.chart;
            let element = ci1.getElementAtEvent(evt);

            if (element.length > 0) {
                var idx1 = element[0]._datasetIndex;
                var idx2 = element[0]._index;
                var el = element[0]._chart.data.datasets[idx1].data[idx2];
                var find = this.$store.state.chartLine1[idx1].data.find(g => g[0] == el.x && g[1] == el.y);
                var defect = find[2];

                // 캔버스 좌표 저장
                lastEl.idx = 1;
                lastEl.el = el;
                location.y1 = element[0]._model.y

                // 이미지 가져오기
                axios.get(this.$store.state.baseURL + '/api/defect/', {
                        params: { plant: this.$store.state.line1.idx, coil: defect.CoilNo, defect: defect.DefectID }
                    })
                    .then((response) => {
                        if(response.data == null) this.$store.state.defectImage1 = null;
                        else this.$store.state.defectImage1 = response.data;
                    })
                    .catch((ex) => {
                        console.log("ERROR!!!: ", ex);
                    })

                // 결함정보 저장
                this.$store.state.coildefect1 = defect;
                // 버튼 활성화
                this.$store.state.detailbtnclick1 = false;
                
                el.keepTooltipOpen = true;
                if(this.elFirstcheck1 == false) {
                    this.oldEl1 = { el: el, idx: idx1, defect: defect, seq1: find[3] };
                    this.elFirstcheck1 = true;
                } else {
                    if(this.oldEl1 == null) return;
                    if(this.oldEl1.el == el) return;
                    this.oldEl1.el.keepTooltipOpen = false;
                    this.oldEl1 = { el: el, idx: idx1, defect: defect, seq1: find[3] };
                }

                this.keepTooltipLogic(ci1, this.oldEl1);
                ci2.update();
            }
        },
        chartClick2: function(evt) {
            var ci1 = this.$refs.chartLine1.chart.chart;
            var ci2 = this.$refs.chartLine2.chart.chart;
            let element = ci2.getElementAtEvent(evt);

            if (element.length > 0) {
                var idx1 = element[0]._datasetIndex;
                var idx2 = element[0]._index;
                var el = element[0]._chart.data.datasets[idx1].data[idx2];
                var find = this.$store.state.chartLine2[idx1].data.find(g => g[0] == el.x && g[1] == el.y);
                var defect = find[2];

                // 캔버스 좌표 저장
                lastEl.idx = 2;
                lastEl.el = el;
                location.y2 = element[0]._model.y

                axios.get(this.$store.state.baseURL + '/api/defect/', {
                        params: { plant: this.$store.state.line2.idx, coil: defect.CoilNo, defect: defect.DefectID }
                    })
                    .then((response) => {
                        if(response.data == null) this.$store.state.defectImage2 = null;
                        else this.$store.state.defectImage2 = response.data;
                    })
                    .catch((ex) => {
                        console.log("ERROR!!!: ", ex);
                    })

                // 결함정보 저장
                this.$store.state.coildefect2 = defect;
                // 버튼 활성화
                this.$store.state.detailbtnclick2 = false;
                
                el.keepTooltipOpen = true;
                if(this.elFirstcheck2 == false) {
                    this.oldEl2 = { el: el, idx: idx1, defect: defect, seq2: find[3] };
                    this.elFirstcheck2 = true;
                } else {
                    if(this.oldEl2 == null) return;
                    if(this.oldEl2 == el) return;
                    this.oldEl2.el.keepTooltipOpen = false;
                    this.oldEl2 = { el: el, idx: idx1, defect: defect, seq2: find[3] };
                }

                this.keepTooltipLogic(ci2, this.oldEl2);
                ci1.update();
            }
        },
        // 차트 툴팁 이벤트
        chartTooltip1: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
                label += ': ';
            }
            label += tooltipItem.yLabel + 'm, ';
            label += Math.round(tooltipItem.xLabel) + 'mm';

            if(this.tooltipChecks1) {
                return label;
            } else {
                return '';
            }
        },
        chartTooltip2: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
                label += ': ';
            }
            label += tooltipItem.yLabel + 'm, ';
            label += Math.round(tooltipItem.xLabel) + 'mm';

            if(this.tooltipChecks2) {
                return label;
            } else {
                return '';
            }
        },
        // 툴팁 관련 로직
        keepTooltipLogic(ci, obj){
            if(obj == null) return;

            // 툴팁 유지 할당
            var datasets = ci.data.datasets;            
            datasets.forEach(d=>{
                d.data.forEach(el=>el.keepTooltipOpen = false);
                var find = d.data.find(g=> g.x == obj.el.x && g.y == obj.el.y);
                if (find != null){
                    if (!d.hidden){
                        find.keepTooltipOpen = true;
                    }
                }
            });
        },
        // 숨겨진 클래스 체크
        ClassHideChange1() {
            var ci = this.$refs.chartLine1.chart.chart;

            // 결함 히든 할당
            this.$store.state.chartLine1.forEach(el => {
                var find = ci.data.datasets.find(g => g.label == el.name);
                find.hidden = el.hide;
            });

            // 툴팁 유지 할당
            this.keepTooltipLogic(ci, this.oldEl1);

            ci.update();
        },
        ClassHideChange2() {
            var ci = this.$refs.chartLine2.chart.chart;

            // 결함 히든 할당
            this.$store.state.chartLine2.forEach(el => {
                var find = ci.data.datasets.find(g => g.label == el.name);
                find.hidden = el.hide;
            });

            // 툴팁 유지 할당
            this.keepTooltipLogic(ci, this.oldEl2);

            ci.update();
        },
        // X축 슬라이더바 이동 체크
        Xcallback1() {
            var val = {
                min: this.Xslider1.value[0],
                max: this.Xslider1.value[1]
            };
            this.chartOptions1.scales.xAxes[0].ticks.min = val.min;
            this.chartOptions1.scales.xAxes[0].ticks.max = val.max;
            // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
            setTimeout(this.ClassHideChange1, 10);
        },
        Xcallback2() {
            var val = {
                min: this.Xslider2.value[0],
                max: this.Xslider2.value[1]
            };
            this.chartOptions2.scales.xAxes[0].ticks.min = val.min;
            this.chartOptions2.scales.xAxes[0].ticks.max = val.max;
            // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
            setTimeout(this.ClassHideChange2, 10);
        },
        // Y축 슬라이더바 이동 체크
        Ycallback1() {
            var val = {
                min: this.Yslider1.value[0],
                max: this.Yslider1.value[1]
            };
            this.chartOptions1.scales.yAxes[0].ticks.min = val.min;
            this.chartOptions1.scales.yAxes[0].ticks.max = val.max;
            line.min1 = val.min;
            line.max1 = val.max;
            // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
            setTimeout(this.ClassHideChange1, 10);            
        },
        Ycallback2() {
            var val = {
                min: this.Yslider2.value[0],
                max: this.Yslider2.value[1]
            };
            this.chartOptions2.scales.yAxes[0].ticks.min = val.min;
            this.chartOptions2.scales.yAxes[0].ticks.max = val.max;
            line.min2 = val.min;
            line.max2 = val.max;
            // 차트 갱신 -> this.$refs.chartTop.chart.chart.data.datasets의 hidden 속성이 없어짐. 그래서 다시 그린다.
            setTimeout(this.ClassHideChange2, 10);
        },
        // y바 고정/해제 클릭
        Yfixed1() {
            if(this.Ybarfixclick1 == false)
            {
                this.Yslider1.fixed = true;
                this.Ybarfixclick1 = true;
                this.YbtnName1 = 'Y바 해제';
                this.Ycolor1= 'white';
                this.Ybackcolor1= 'tomato';
                this.Yslider1.sliderStyle[0].backgroundColor = 'tomato';
                this.Yslider1.sliderStyle[1].backgroundColor = 'tomato';

                setTimeout(this.ClassHideChange1, 10);
            }
            else
            {
                this.Yslider1.fixed = false;
                this.Ybarfixclick1 = false;
                this.YbtnName1 = 'Y바 고정';
                this.Ycolor1 = 'tomato';
                this.Ybackcolor1 = 'transparent';
                this.Yslider1.sliderStyle[0].backgroundColor = 'white';
                this.Yslider1.sliderStyle[1].backgroundColor = 'white';

                setTimeout(this.ClassHideChange1, 10);
            }
        },
        Yfixed2() {
            if(this.Ybarfixclick2 == false)
            {
                this.Yslider2.fixed = true;
                this.Ybarfixclick2 = true;
                this.YbtnName2 = 'Y바 해제';
                this.Ycolor2 = 'white';
                this.Ybackcolor2 = 'tomato';
                this.Yslider2.sliderStyle[0].backgroundColor = 'tomato';
                this.Yslider2.sliderStyle[1].backgroundColor = 'tomato';

                setTimeout(this.ClassHideChange2, 10);
            }
            else
            {
                this.Yslider2.fixed = false;
                this.Ybarfixclick2 = false;
                this.YbtnName2 = 'Y바 고정';
                this.Ycolor2 = 'tomato';
                this.Ybackcolor2 = 'transparent';
                this.Yslider2.sliderStyle[0].backgroundColor = 'white';
                this.Yslider2.sliderStyle[1].backgroundColor = 'white';

                setTimeout(this.ClassHideChange2, 10);
            }
        },
        // x바 고정/해제 클릭
        Xfixed1() {
            if(this.Xbarfixclick1 == false)
            {
                this.Xslider1.fixed = true;
                this.Xbarfixclick1 = true;
                this.XbtnName1 = 'X바 해제';
                this.Xcolor1 = 'white';
                this.Xbackcolor1 = '#3498db';
                this.Xslider1.sliderStyle[0].backgroundColor = '#3498db';
                this.Xslider1.sliderStyle[1].backgroundColor = '#3498db';

                setTimeout(this.ClassHideChange1, 10);
            }
            else
            {
                this.Xslider1.fixed = false;
                this.Xbarfixclick1 = false;
                this.XbtnName1 = 'X바 고정';
                this.Xcolor1 = '#3498db';
                this.Xbackcolor1 = 'transparent';
                this.Xslider1.sliderStyle[0].backgroundColor = 'white';
                this.Xslider1.sliderStyle[1].backgroundColor = 'white';

                setTimeout(this.ClassHideChange1, 10);
            }
        },
        Xfixed2() {
            if(this.Xbarfixclick2 == false)
            {
                this.Xslider2.fixed = true;
                this.Xbarfixclick2 = true;
                this.XbtnName2 = 'X바 해제';
                this.Xcolor2 = 'white';
                this.Xbackcolor2 = '#3498db';
                this.Xslider2.sliderStyle[0].backgroundColor = '#3498db';
                this.Xslider2.sliderStyle[1].backgroundColor = '#3498db';

                setTimeout(this.ClassHideChange2, 10);
            }
            else
            {
                this.Xslider2.fixed = false;
                this.Xbarfixclick2 = false;
                this.XbtnName2 = 'X바 고정';
                this.Xcolor2 = '#3498db';
                this.Xbackcolor2 = 'transparent';
                this.Xslider2.sliderStyle[0].backgroundColor = 'white';
                this.Xslider2.sliderStyle[1].backgroundColor = 'white';

                setTimeout(this.ClassHideChange2, 10);
            }
        },
        // 전체/전면/이면의 숨김 데이터 체크
        keepList(lineData) {
            var keepList = this.$store.state.keepList;
            keepList.forEach(g=> {
                var find = lineData.filter(c=> c.name == g.name);
                if (find.length > 0){
                    find[0].hide = true;
                }
            });
        },
        // 차트1 전체
        allDisplay1() {
            this.$store.state.chartLine1 = this.$store.state.chartLine1All;
            this.keepList(this.$store.state.chartLine1);
            this.$nextTick(() => {
                this.fontcolor1 = 'blue';
                this.fontcolor2 = '';
                this.fontcolor3 = '';
            });

            setTimeout(this.ClassHideChange1, 200);
        },
        // 차트1 전면
        topDisplay1() {
            this.$store.state.chartLine1 = this.$store.state.chartLine1Top;
            this.keepList(this.$store.state.chartLine1);
            this.$nextTick(() => {
                this.fontcolor1 = '';
                this.fontcolor2 = 'blue';
                this.fontcolor3 = '';
            });

            setTimeout(this.ClassHideChange1, 200);
        },
        // 차트1 이면
        botDisplay1() {
            this.$store.state.chartLine1 = this.$store.state.chartLine1Bot;
            this.keepList(this.$store.state.chartLine1);
            this.$nextTick(() => {
                this.fontcolor1 = '';
                this.fontcolor2 = '';
                this.fontcolor3 = 'blue';
            });

            setTimeout(this.ClassHideChange1, 200);
        },
        // 차트2 전체
        allDisplay2() {
            this.$store.state.chartLine2 = this.$store.state.chartLine2All;
            this.keepList(this.$store.state.chartLine2);
            this.$nextTick(() => {
                this.fontcolor4 = 'blue';
                this.fontcolor5 = '';
                this.fontcolor6 = '';
            });

            setTimeout(this.ClassHideChange2, 200);
        },
        // 차트2 전면
        topDisplay2() {
            this.$store.state.chartLine2 = this.$store.state.chartLine2Top;
            this.keepList(this.$store.state.chartLine2);
            this.$nextTick(() => {
                this.fontcolor4 = '';
                this.fontcolor5 = 'blue';
                this.fontcolor6 = '';
            });

            setTimeout(this.ClassHideChange2, 200);
        },
        // 차트2 이면
        botDisplay2() {
            this.$store.state.chartLine2 = this.$store.state.chartLine2Bot;
            this.keepList(this.$store.state.chartLine2);
            this.$nextTick(() => {
                this.fontcolor4 = '';
                this.fontcolor5 = '';
                this.fontcolor6 = 'blue';
            });

            setTimeout(this.ClassHideChange2, 200);
        },
    },
    computed: {
        coil1: function() {
            var coil = this.$store.state.line1.coil
            var name = this.$store.state.line1.name
            return '[' + name + ']' + coil
        },
        coil2: function() {
            var coil = this.$store.state.line2.coil
            var name = this.$store.state.line2.name
            return '[' + name + ']' + coil
        },
        chartData1: function() {
            return this.$store.state.chartLine1
        },
        chartData2: function() {
            return this.$store.state.chartLine2
        },
        // 버튼 활성화 여부
        btndisabled: function() {
            return this.$store.state.btnDisable
        },
    },
    mounted() {
        Chart.plugins.register(cp);
        this.chartOptions1.onClick = this.chartClick1;
        this.chartOptions2.onClick = this.chartClick2;
        this.chartOptions1.tooltips.callbacks.label = this.chartTooltip1;
        this.chartOptions2.tooltips.callbacks.label = this.chartTooltip2;
    },
    watch: {
        chartData1: function(val) {
            if (val.length == 0) return;
            // 차트, 슬라이더 너비와 길이에 따라 업데이트
            var x = Math.round(this.$store.state.line1.width);
            var y = Math.round(this.$store.state.line1.length / 1000);
            line.line1 = y;
            line.max1 = y;
            this.Xslider1.max = x;
            this.Yslider1.max = y;
            this.Xslider1.value = [0, x];
            this.Yslider1.value = [0, y];
            this.chartOptions1.scales.xAxes[0].ticks.max = x;
            this.chartOptions1.scales.xAxes[0].ticks.min = 0;
            this.chartOptions1.scales.yAxes[0].ticks.max = y;
            this.chartOptions1.scales.yAxes[0].ticks.min = 0;

            // y바 고정,해제를 위한 버튼 style binding 초기화
            this.YbtnName1 = 'Y바 고정';
            this.Ycolor1 = 'tomato';
            this.Ybackcolor1 = 'transparent';
            this.Ybarfixclick1 = false;
            // x바 고정,해제를 위한 버튼 style binding 초기화
            this.XbtnName1 = 'X바 고정';
            this.Xcolor1 = '#3498db';
            this.Xbackcolor1 = 'transparent';
            this.Xbarfixclick1 = false;
            // 차트 위, 아래 반전 버튼 style binding 초기화
            this.chartOptions1.scales.yAxes[0].ticks.reverse = false;
            this.Yslider1.reverse = false;
            this.icon1 = 'arrow-up';
            reverseCheck1 = false;
            this.reverseColor1 = 'white';
            this.reverseBack1 = '#343a40';
            this.$store.state.reverseBtnClick1 = true;
            // 전체, 전면, 이면 선택 초기화
            this.fontcolor1 = 'blue';
            this.fontcolor2 = '';
            this.fontcolor3 = '';
            // el 초기화
            this.oldEl1 = null;
            this.elFirstcheck1 = false;

            // tooltip 초기화
            this.tooltipChecks1 = true;
            this.tooltipLabel1 = '툴팁 OFF';
            this.tooltipColor1 = '#17a2b8';
            this.tooltipBack1 = 'transparent';
            this.chartOptions1.tooltips.backgroundColor = 'rgba(0,0,0,0.8)';

            // 이미지 버튼 비활성화
            this.$store.state.detailbtnclick1 = true;
            
            // 차트 네모박스 초기화
            lastEl.idx = 0;
            lastEl.el = null;
            if(typeof(this.$refs.chartLine1.chart.chart) == 'undefined') return;
            // var ci1 = this.$refs.chartLine1.chart.chart;
            // ci1.update();

            // 숨김 클래스 체크
            setTimeout(this.ClassHideChange1, 10);
        },
        chartData2: function(val) {
            if (val.length == 0) return;
            // 차트, 슬라이더 너비와 길이에 따라 업데이트
            var x = Math.round(this.$store.state.line2.width);
            var y = Math.round(this.$store.state.line2.length / 1000);
            
            line.line2 = y;
            line.max2 = y;
            this.Xslider2.max = x;
            this.Yslider2.max = y;
            this.Xslider2.value = [0, x];
            this.Yslider2.value = [0, y];
            this.chartOptions2.scales.xAxes[0].ticks.max = x;
            this.chartOptions2.scales.xAxes[0].ticks.min = 0;
            this.chartOptions2.scales.yAxes[0].ticks.max = y;
            this.chartOptions2.scales.yAxes[0].ticks.min = 0;

            // y바 고정,해제를 위한 버튼 style binding
            this.YbtnName2 = 'Y바 고정';
            this.Ycolor2 = 'tomato';
            this.Ybackcolor2 = 'transparent';
            this.Ybarfixclick2 = false;
            // x바 고정,해제를 위한 버튼 style binding
            this.XbtnName2 = 'X바 고정';
            this.Xcolor2 = '#3498db';
            this.Xbackcolor2 = 'transparent';
            this.Xbarfixclick2 = false;
            // 차트 위, 아래 반전 버튼 style binding
            this.chartOptions2.scales.yAxes[0].ticks.reverse = true;
            this.Yslider2.reverse = true;
            this.icon2 = 'arrow-down';
            reverseCheck2 = false;
            this.reverseColor2 = '#343a40';
            this.reverseBack2 = 'transparent';
            this.$store.state.reverseBtnClick2 = false;
            // 전체, 전면, 이면 선택 초기화
            this.fontcolor4 = 'blue';
            this.fontcolor5 = '';
            this.fontcolor6 = '';
            // el 초기화
            this.oldEl2 = null;
            this.elFirstcheck2 = false;

            // tooltip 초기화
            this.tooltipChecks2 = true;
            this.tooltipLabel2 = '툴팁 OFF';
            this.tooltipColor2 = '#17a2b8';
            this.tooltipBack2 = 'transparent';
            this.chartOptions2.tooltips.backgroundColor = 'rgba(0,0,0,0.8)';

            // 이미지 버튼 비활성화
            this.$store.state.detailbtnclick2 = true;

            // 차트 네모박스 초기화
            lastEl.idx = 0;
            lastEl.el = null;
            if(typeof(this.$refs.chartLine2.chart.chart) == 'undefined') return;
            // var ci2 = this.$refs.chartLine2.chart.chart;
            // ci2.update();

            // 숨김 클래스 체크
            setTimeout(this.ClassHideChange2, 10);
        },
    },
    created: function() {
        window.addEventListener('keydown', (e) => {
            if(lastEl.idx == 1) {
                if(e.keyCode == '38') { // 키보드 위
                    if(reverseCheck1) this.upPress();
                    else this.downPress();
                } else if(e.keyCode == '40') { // 키보드 아래
                    if(reverseCheck1) this.downPress();
                    else this.upPress();
                }
            } else {
                if(e.keyCode == '38') { // 키보드 위
                    if(!reverseCheck2) this.upPress();
                    else this.downPress();
                } else if(e.keyCode == '40') { // 키보드 아래
                    if(!reverseCheck2) this.downPress();
                    else this.upPress();
                }
            }
        })
    }
}
</script>

<style scoped>
label{ margin-bottom: 4px; }
button{ font-size: 12px;}
.custom-icon { width: 12px; margin-top: -3px; }
.card-header{ font-size: 18px; font-weight: bold; color:white; background-color: lightslategray; padding: 4px; }

#xslider { margin-left: 30px; margin-top: -5px; }
#xslider1 { margin-left: -5px; margin-top: -5px; }
#yslider{ margin-left: -19px; }

#alltext1{ margin-top: 4px; margin-left: 10px; cursor: pointer; }
#toptext1{ margin-top: 4px; margin-left: 0px; cursor: pointer; }
#bottext1{ margin-top: 4px; margin-left: 0px; cursor: pointer; }

#yfixbtn{ border: 1px solid tomato; padding-left: 10px; padding-right: 10px; }
#xfixbtn{ border: 1px solid #3498db; padding-left: 10px; padding-right: 10px; }
#download{ height: 32px; }
#defectclass{ border: 1px solid #28a745; background-color: #28a745; padding-left: 10px; padding-right: 10px; font-size: 12px; margin-left: 10px; } /* margin-left: 45%;*/
#reverse{ height: 32px; border: 1px solid #343a40; padding-left: 10px; padding-right: 10px; margin-right: 7px; }
#tooltip{ height: 32px; margin-right: 10px; border: 1px solid #17a2b8; padding-left: 10px; padding-right: 10px; }
</style>
