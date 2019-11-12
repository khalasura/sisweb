import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
Vue.use(axios)

export default new Vuex.Store({
    state: {
        // baseURL
        //baseURL: 'http://siss.hyundai-steel.com:91',
        baseURL: 'http://localhost:91',

        // header 활성화
        viewerActive: false,
        lineActive: false,
        analyzerActive: false,

        ////////////////////////////////////////Viewer///////////////////////////////////////
        // 차트 클래스 데이터
        classInfo: [],
        // 차트 데이터
        chartTOP: [],
        chartBOT: [],
        // 차트 옵션
        chartOptionsTOP: {
            layout: {
                padding: { left: 50, right: 5, top: 5, bottom: 2 }
            },
            scales: {
                xAxes: [{
                    ticks: { beginAtZero: true, max: 10, min: 0, stepSize: 500 }
                }],
                yAxes: [{
                    ticks: { beginAtZero: true, max: 1000, min: 0, stepSize: 500, reverse: true }
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.yLabel + 'm, ';
                        label += Math.round(tooltipItem.xLabel) + 'mm';
                        return label;
                    }
                }
            }
        },
        chartOptionsBOT: {
            layout: {
                padding: { left: 50, right: 5, top: 5, bottom: 2 }
            },
            scales: {
                xAxes: [{
                    ticks: { beginAtZero: true, max: 10, min: 0, stepSize: 500 }
                }],
                yAxes: [{
                    ticks: { beginAtZero: true, max: 1000, min: 0, stepSize: 500, reverse: true },
                    position: 'right'
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.yLabel + 'm, ';
                        label += Math.round(tooltipItem.xLabel) + 'mm';
                        return label;
                    }
                }
            }
        },
        // 슬라이더 옵션
        YsliderTOP: {
            value: [0, 1000],
            width: 4,
            height: 700,
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
            enableCross: true,
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
        XsliderTOP: {
            value: [0, 1000],
            width: "97%",
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
            formatter: (v) => `${v}mm`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
        YsliderBOT: {
            value: [0, 1000],
            width: 4,
            height: 700,
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
        XsliderBOT: {
            value: [0, 1000],
            width: '97%',
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
            formatter: (v) => `${v}mm`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
        // 전체조회, 부분조회 눌렀을 경우 차트의 이름 변환
        chartName: null,

        // 코일결함 데이터, 결함이미지
        coildefect: [],
        defectImage: null,
        // 코일 썸네일 이미지
        coilImage: null,
        // 결함이미지 '상세보기'버튼 disable = false로 바꾸기 위함
        detailbtnclick: true,

        // 전면, 이면 차트 '결함클래스'버튼 disable = false로 바꾸기 위함
        classclick: true,

        // 그리드 데이터
        gridrow: [],
        // 그리드 클릭시 클릭된 row 데이터
        clickrow: [],
        // 그리드 클릭시 '결함조회'버튼 disable = false로 바꾸기 위함
        clickcheck: true,

        // 부분조회시 class와 ySlider 값
        partchart: [],
        // CoilList에서 선택된 row의 전체 class정보 필터 후 남은 데이터
        rowClassData: [],
        // CoilList에서 선택된 row의 전체 class정보 전체
        rowClassAll: [],

        // 차트 로딩 변수
        isLoading: false,
        linePartLoading: false,
        // slider 사용시 데이터 많을 경우가 있을 수 있기 때문에 이를 방지하기 위함
        topSlider: null,
        botSlider: null,
        // 클릭시 tooltip 유지를 위함(팝업창)
        clickEl: null,
        topChart: null,
        botChart: null,
        // 트리뷰 코일목록
        treeItem: [],
        // 클릭시 tooltip 유지를 위함(main창)
        oldElTop: [],
        oldElBot: [],
        winList: [],
        // 트리뷰에서 선택된 노드
        clickNode: null,
        // 트리뷰에서 참고할 코일 목록
        treeCoils: [],
        // 선택된 코일
        currentCoil: [],
        // 코일목록의 next, previous
        prevBtn: false,
        nextBtn: false,
        // 차트 결함필터에서 설정유지한 class이름 저장
        keepList: [],
        // 결함 번호 Min, Max
        defectRange: null,
        // 결함필터 checkbox 선택 알림
        Topchecked: false,
        Botchecked: false,
        // excel 다운로드
        excelClass: [],
        excelList: [],
        // excel 버튼 disable
        excelDisable: true,
        // CoilExplain.vue의 버튼 disable
        explainDisable: true,
        // 통과공정 표시 데이터
        yeonjuName: null,
        hotName: null,
        coldName: null,
        // tooltip
        tooltipCheckTop: true,
        tooltipCheckBot: true,

        ////////////////////////////////////////Line//////////////////////////////////////////
        // 차트 데이터
        chartLine1: [],
        chartLine2: [],
        chartLine1All: [],
        chartLine1Top: [],
        chartLine1Bot: [],
        chartLine2All: [],
        chartLine2Top: [],
        chartLine2Bot: [],
        // 선택한 공정(숫자로 표시된)
        viewCnt: null,
        // 라인이름, 코일이름, 총결함
        line1: { idx: null, width: null, length: null, name: null, coil: null, cnt: null },
        line2: { idx: null, width: null, length: null, name: null, coil: null, cnt: null },
        // btn disabled
        btnDisable: true,
        detailbtnclick1: true,
        detailbtnclick2: true,
        // img src
        defectImage1: null,
        defectImage2: null,
        // defcet정보 저장
        coildefect1: [],
        coildefect2: [],
        // 부분조회
        partLine1: [],
        partLine2: [],
        partTotal: [],
        // 부분조회 타이틀
        Line1Text: null,
        Line2Text: null,
        reverseBtnClick1: true,
        reverseBtnClick2: false,

        ////////////////////////////////////////Analyzer//////////////////////////////////////
        // trend type구분
        trendType: 0,
        // Analyzer Software의 선택 값
        defectItem: [],
        criticalpathItem: [],
        coldrollingItem: [],
        hotrollingItem: [],
        yeonjuItem: [],
        // Analyzer Software의 차트 값
        trendItems: [],
        // Analyzer Software의 팝업 차트 값
        type2Items: [],
        trendItems0: [],
        trendItems1: [],
        trendItems2: [],
        trendItems3: [],
        trendItems4: [],
        trendItems5: [],
        // Analyzer Software의 팝업 차트이름
        trendName0: null,
        trendName1: null,
        trendName2: null,
        trendName3: null,
        trendName4: null,
        trendName5: null,
        // Analyzer Software의 검색버튼 누르면 차트의 새창보기, 접기, 펼치기 버튼 활성화를 위한 변수
        btndisable: true,
        popdisable: true,
        // Analyzer Software의 title
        title: null,
        // Analyzer Software의 새창보기시 필요한 고유값
        uid: 0,
        popuid: 0,
        // 조회 layout안의 코일선택인지 단위길이 선택인지 체크 - 코일: 0, 단위길이: 1
        selectUL: 0,
        excelData: [],
        // 펼치기/접기, 전체선택/전체해제 버튼
        btnOpen: true,
        btnSelected1: true,
        btnSelected2: true,
        btnSelected3: true,
        btnSelected4: true,
        // type2
        type2: 0
    },
    mutations: {
        // 결함정보
        setDefectInfo: function(state, payload) {
            state.coildefect = payload;
        },
        // 툴팁 관련 로직
        keepTooltipLogic(state, payload) {
            // ci, obj
            var ci = payload.ci;
            var obj = payload.obj;
            // 툴팁 유지 할당
            var datasets = ci.data.datasets;
            datasets.forEach(d => {
                d.data.forEach(el => el.keepTooltipOpen = false);
                var find = d.data.find(g => g.x == obj.x && g.y == obj.y);
                if (find != null) {
                    if (!d.hidden) {
                        find.keepTooltipOpen = true;
                    }
                }
            });

            // 상세보기 팝업 띄운 툴팁은 유지
            state.winList.forEach(g => {
                g.el.keepTooltipOpen = true;
            });
        },
    },
    actions: {
        // 결함 좌표 클릭시 결함정보, 이미지 표시를 위한 action
        getDefectImage: function(store) {
            store.state.chartOptionsTOP.onClick = function(evt) {
                let element = this.getElementAtEvent(evt);

                if (element.length > 0) {
                    var idx1 = element[0]._datasetIndex;
                    var idx2 = element[0]._index;
                    var el = element[0]._chart.data.datasets[idx1].data[idx2];
                    var find = store.state.chartTOP[idx1].data.find(g => g[0] == el.x && g[1] == el.y);
                    var defect = find[2];
                    store.state.clickEl = { el: el, idx: idx1, defect: defect, seqTop: find[3], side: 'top' };

                    // 현재 클릭한 결함 툴팁 활성화
                    el.keepTooltipOpen = true;

                    // 이전 클릭한 툴팁 비활성화
                    var flag = store.state.winList.filter(g => g.active && g.el == store.state.oldElTop).length > 0;
                    if (!flag)
                        store.state.oldElTop.keepTooltipOpen = false;

                    // 현재 클릭 결함을 이전 클릭 결함에 할당
                    if (el != store.state.oldElTop) {
                        store.state.oldElTop = el;
                    }

                    // 반대편 차트의 이전 클릭 결함  툴팁 비활성화
                    flag = store.state.winList.filter(g => g.active && g.el == store.state.oldElBot).length > 0;
                    if (!flag)
                        store.state.oldElBot.keepTooltipOpen = false;

                    // 시부럴 버그
                    el.keepTooltipOpen = true;

                    // 차트 디스플레이 갱신
                    store.commit("keepTooltipLogic", { ci: store.state.topChart.chart.chart, obj: el });
                    store.commit("keepTooltipLogic", { ci: store.state.botChart.chart.chart, obj: el });
                    store.state.topChart.chart.chart.update();
                    store.state.botChart.chart.chart.update();

                    axios.get(store.state.baseURL + '/api/defect/', {
                            params: { plant: store.state.currentCoil.LineName, coil: defect.CoilNo, defect: defect.DefectID }
                        })
                        .then((response) => {
                            store.state.defectImage = response.data;
                            setTimeout(function() { store.commit("setDefectInfo", defect); }, 10);
                        })
                        .catch((ex) => {
                            console.log("ERROR!!!: ", ex);
                        })
                }
                store.state.detailbtnclick = false
            };

            store.state.chartOptionsBOT.onClick = function(evt) {
                let element = this.getElementAtEvent(evt);

                if (element.length > 0) {
                    var idx1 = element[0]._datasetIndex;
                    var idx2 = element[0]._index;
                    var el = element[0]._chart.data.datasets[idx1].data[idx2];
                    var find = store.state.chartBOT[idx1].data.find(g => g[0] == el.x && g[1] == el.y);
                    var defect = find[2];
                    store.state.clickEl = { el: el, idx: idx1, defect: defect, seqBot: find[3], side: 'bot' };

                    // 현재 클릭한 결함 툴팁 활성화
                    el.keepTooltipOpen = true;

                    // 이전 클릭한 툴팁 비활성화
                    var flag = store.state.winList.filter(g => g.active && g.el == store.state.oldElBot).length > 0;
                    if (!flag)
                        store.state.oldElBot.keepTooltipOpen = false;

                    // 현재 클릭 결함을 이전 클릭 결함에 할당
                    if (el != store.state.oldElBot) {
                        store.state.oldElBot = el;
                    }

                    // 반대편 차트의 이전 클릭 결함  툴팁 비활성화
                    flag = store.state.winList.filter(g => g.active && g.el == store.state.oldElTop).length > 0;
                    if (!flag)
                        store.state.oldElTop.keepTooltipOpen = false;

                    // 시부럴 버그
                    el.keepTooltipOpen = true;

                    // 차트 디스플레이 갱신
                    store.commit("keepTooltipLogic", { ci: store.state.topChart.chart.chart, obj: el });
                    store.commit("keepTooltipLogic", { ci: store.state.botChart.chart.chart, obj: el });
                    store.state.topChart.chart.chart.update();
                    store.state.botChart.chart.chart.update();

                    axios.get(store.state.baseURL + '/api/defect/', {
                            params: { plant: store.state.currentCoil.LineName, coil: defect.CoilNo, defect: defect.DefectID }
                        })
                        .then((response) => {
                            store.state.defectImage = response.data;
                            setTimeout(function() { store.commit("setDefectInfo", defect); }, 10);
                        })
                        .catch((ex) => {
                            console.log("ERROR!!!: ", ex);
                        })
                        //store.state.coildefect = defect;
                }
                store.state.detailbtnclick = false
            };
        },
        // 결함 툴팁 관련 action
        getTooltip: function(store) {
            store.state.chartOptionsTOP.tooltips.callbacks.label = function(tooltipItem, data) {
                if (store.state.tooltipCheckTop) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += tooltipItem.yLabel + 'm, ';
                    label += Math.round(tooltipItem.xLabel) + 'mm';
                    return label;
                } else {
                    return '';
                }
            };

            store.state.chartOptionsBOT.tooltips.callbacks.label = function(tooltipItem, data) {
                if (store.state.tooltipCheckBot) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += tooltipItem.yLabel + 'm, ';
                    label += Math.round(tooltipItem.xLabel) + 'mm';
                    return label;
                } else {
                    return '';
                }
            };
        }
    }
})