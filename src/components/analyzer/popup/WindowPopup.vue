<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{width, height, backgroundColor}">
        <div :id="windowId + '-' + 'header'" class="vue-window-modal-header">
            <h6>{{title}}</h6>
            <img src="@/assets/close.png" id="icon" @click="$emit('clickClose', data)">
            <img src="@/assets/mini.png" id="iconMini" @click="$emit('clickMini', data)">
            <img src="@/assets/download.png" id="iconDown" @click="downloadBtn">
        </div>
        <div class="window-body">
            <slot name="default"></slot>
            <b-card no-body>
                <line-chart ref="trend" :data="trendItems" ytitle="발생빈도" :messages="{empty: 'No data'}" :library="chartOptions" 
                            :legend="true" :curve="false" height="600px"></line-chart>
            </b-card>
        </div>
    </div>
</template>

<script>
import zoom from 'chartjs-plugin-zoom'
import saveAs from 'file-saver'
import toBlob from 'canvas-toBlob'

export default {
    name: 'vue-window-modal',
    components: { zoom, saveAs, toBlob },
    data() {
        return {
            windowId: (function(){
                const one = Math.floor((Math.random() * 1000000) + 1) + ''
                const two = Math.floor((Math.random() * 1000000) + 1) + ''
                const three = Math.floor((Math.random() * 1000000) + 1) + ''
                return  one + two + three
            })(),
            trendItems: [],
            chartOptions: {
                spanGaps: true,
                scales: {
                    xAxes: [{
                        // ticks: {
                        //     callback: function(value, index, values) {
                        //         var month = value.substr(0, 3)
                        //         var year = value.substr(4, 4)
                        //         switch (month) {
                        //             case 'Jan':
                        //                 return year + '년 1월'
                        //             case 'Feb':
                        //                 return year + '년 2월'
                        //             case 'Mar':
                        //                 return year + '년 3월'
                        //             case 'Apr':
                        //                 return year + '년 4월'
                        //             case 'May':
                        //                 return year + '년 5월'
                        //             case 'Jun':
                        //                 return year + '년 6월'
                        //             case 'Jul':
                        //                 return year + '년 7월'
                        //             case 'Aug':
                        //                 return year + '년 8월'
                        //             case 'Sep':
                        //                 return year + '년 9월'
                        //             case 'Oct':
                        //                 return year + '년 10월'
                        //             case 'Nov':
                        //                 return year + '년 11월'
                        //             case 'Dec':
                        //                 return year + '년 12월'
                        //         }
                        //     }
                        // }
                    }]
                },
                tooltips: {
                    callbacks: {
                        
                    }
                },
                zoom: {
                    enabled: true,
                    mode: 'x',
                    drag: true,
                }
            },
        }
    },
    props: {
        active: Boolean,
        title: String,
        width: {
            type: String,
            default: '1000px'
        },
        height: {
            type: String,
            default: '600px'
        },
        backgroundColor: {
            type: String,
            default: '#f2f2f2'
        },
        data: Array,
    },
    methods: {
        // 차트 다운로드
        downloadBtn() {
            // 차트에서 캔버스 속성 가져오기
            var canvas = this.$refs.trend.chart.element.lastElementChild;
            var chartName = null;

            if(this.$store.state.type2 == 0) {
                chartName = this.$store.state.title;
            } else {
                switch(this.title) {
                    case this.$store.state.trendName0:
                        chartName = this.$store.state.trendName0;
                        break;
                    case this.$store.state.trendName1:
                        chartName = this.$store.state.trendName1;
                        break;
                    case this.$store.state.trendName2:
                        chartName = this.$store.state.trendName2;
                        break;
                    case this.$store.state.trendName3:
                        chartName = this.$store.state.trendName3;
                        break;
                    case this.$store.state.trendName4:
                        chartName = this.$store.state.trendName4;
                        break;
                    case this.$store.state.trendName5:
                        chartName = this.$store.state.trendName5;
                        break;
                }
            }

            canvas.toBlob(function(blob) {
                saveAs(blob, chartName);
            });
        },
        // 차트 클릭 이벤트
        chartClick(evt) {
            if(evt.shiftKey) {
                // zoom 리셋
                this.$refs.trend.chart.chart.resetZoom();
            }
        },
        // 차트 툴팁 관련 이벤트
        tooltipCustom: function(tooltipItem, data) {
            // chart의 datetime 추출 explorer는 new Date(tooltipItem.xLabel)이 적용되지 않음. => Invalid오류발생
            // var datetime = new Date(tooltipItem.xLabel);

            // chart의 datetime 추출
            var datetime = data.labels[tooltipItem.index];

            if(this.$store.state.type2 == 0) {
                // store에 저장한 trendItems의 데이터의 datetime값과 chart의 datetime값 비교후 인덱스 추출
                var idx = this.$store.state.trendItems[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);

                // 추출한 인덱스 값으로 아이디 찾아 저장
                var coilid = '코일번호:       ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][2];
                // 추출한 인덱스 값으로 클래스이름 찾아 저장
                var classname = '결함:              ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][3];
                // 추출한 인덱스 값으로 냉간압연 찾아 저장
                var cold = '냉간압연:      ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][4];
                // 추출한 인덱스 값으로 열연 찾아 저장
                var hot = '열연:             ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][5];
                // 추출한 인덱스 값으로 연주 찾아 저장
                var yeonju = '연주:             ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][6];
                // 추출한 인덱스 값으로 검사길이 찾아 저장
                var sislength = '검사길이(M): ' + Math.round(this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][7] / 1000);
                // 추출한 인덱스 값으로 주공정 찾아 저장
                var plant = '주공정:           ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][8];

                if(this.$store.state.selectUL == 0) {
                    // 코일 결함수
                    var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                    // 길이 결함수
                    var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][9]);
                } else {
                    // 코일 결함수
                    var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][9];
                    // 길이 결함수
                    var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                }

                return [plant, coilid, classname, lengthDefect, unitlength, cold, hot, yeonju, sislength];
            } else {
                var idx = 0;
                if(this.$store.state.trendName0 == this.title)
                {
                    idx = this.$store.state.trendItems0[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);
                    // 추출한 인덱스 값으로 클래스이름 찾아 저장
                    var classname = '결함:              ' + this.$store.state.trendItems0[tooltipItem.datasetIndex].data[idx][2];
                    // 추출한 인덱스 값으로 주공정 찾아 저장
                    // var plant = '주공정:           ' + this.$store.state.trendItems0[tooltipItem.datasetIndex].data[idx][3];
                    
                    if(this.$store.state.selectUL == 0) {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems0[tooltipItem.datasetIndex].data[idx][4]);
                    } else {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems0[tooltipItem.datasetIndex].data[idx][4];
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                    }
                }
                else if(this.$store.state.trendName1 == this.title)
                {
                    idx = this.$store.state.trendItems1[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);
                    // 추출한 인덱스 값으로 클래스이름 찾아 저장
                    var classname = '결함:              ' + this.$store.state.trendItems1[tooltipItem.datasetIndex].data[idx][2];
                    
                    if(this.$store.state.selectUL == 0) {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems1[tooltipItem.datasetIndex].data[idx][4]);
                    } else {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems1[tooltipItem.datasetIndex].data[idx][4];
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                    }
                }
                else if(this.$store.state.trendName2 == this.title)
                {
                    idx = this.$store.state.trendItems2[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);
                    // 추출한 인덱스 값으로 클래스이름 찾아 저장
                    var classname = '결함:              ' + this.$store.state.trendItems2[tooltipItem.datasetIndex].data[idx][2];
                    
                    if(this.$store.state.selectUL == 0) {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems2[tooltipItem.datasetIndex].data[idx][4]);
                    } else {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems2[tooltipItem.datasetIndex].data[idx][4];
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                    }
                }
                else if(this.$store.state.trendName3 == this.title)
                {
                    idx = this.$store.state.trendItems3[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);
                    // 추출한 인덱스 값으로 클래스이름 찾아 저장
                    var classname = '결함:              ' + this.$store.state.trendItems3[tooltipItem.datasetIndex].data[idx][2];
                    
                    if(this.$store.state.selectUL == 0) {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems3[tooltipItem.datasetIndex].data[idx][4]);
                    } else {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems3[tooltipItem.datasetIndex].data[idx][4];
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                    }
                }
                else if(this.$store.state.trendName4 == this.title)
                {
                    idx = this.$store.state.trendItems4[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);
                    // 추출한 인덱스 값으로 클래스이름 찾아 저장
                    var classname = '결함:              ' + this.$store.state.trendItems4[tooltipItem.datasetIndex].data[idx][2];
                    
                    if(this.$store.state.selectUL == 0) {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems4[tooltipItem.datasetIndex].data[idx][4]);
                    } else {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems4[tooltipItem.datasetIndex].data[idx][4];
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                    }
                }
                else if(this.$store.state.trendName5 == this.title)
                {
                    idx = this.$store.state.trendItems5[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);
                    // 추출한 인덱스 값으로 클래스이름 찾아 저장
                    var classname = '결함:              ' + this.$store.state.trendItems5[tooltipItem.datasetIndex].data[idx][2];
                    
                    if(this.$store.state.selectUL == 0) {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems5[tooltipItem.datasetIndex].data[idx][4]);
                    } else {
                        // 코일 결함수
                        var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems5[tooltipItem.datasetIndex].data[idx][4];
                        // 길이 결함수
                        var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                    }
                }

                return [classname, lengthDefect, unitlength];
            }
        },
        // 데이터 바인딩
        handleChart() {
            this.$store.state.popuid++;
            this.trendItems = this.data;
        },
        // 팝업창 라이브러리 메소드
        getThisWindowAndHeaderElements() {
            return {
                window: window.document.getElementById(this.windowId),
                windowHeader: window.document.getElementById(this.windowId + '-' + 'header')
            }
        },
        dragElement(elmnt) {

            var context = this

            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            const _window = this.getThisWindowAndHeaderElements().window
            const _windowHeader = this.getThisWindowAndHeaderElements().windowHeader

            _windowHeader.onmousedown = dragMouseDown

            function dragMouseDown(e) {
                e = e || window.event;
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
                _windowHeader.style.cursor = '-webkit-grabbing'
            }

            function elementDrag(e) {
                e = e || window.event;
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:

                if (_window.offsetTop < (window.innerHeight - 35)) {
                    _window.style.top = (_window.offsetTop - pos2) + "px";
                } else context.centerWindow()
                if (_window.offsetLeft < (window.innerWidth - 35)) {
                    _window.style.left = (_window.offsetLeft - pos1) + "px";
                } else context.centerWindow()
            }

            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
                _windowHeader.style.cursor = '-webkit-grab'
            }
        },
        getHighestWindow() {
            const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
            const zIndexs = windows.map(el => Number(el.style.zIndex))
            const highest = Math.max.apply(Math, zIndexs)
            return highest
        },
        sendWindowToHighest() {
            this.getThisWindowAndHeaderElements().window.style.zIndex = this.getHighestWindow() + 1
        },
        centerWindow() {
            var myElement = this.getThisWindowAndHeaderElements().window,
                pageWidth = window.innerWidth,
                pageHeight = window.innerHeight,
                myElementWidth = myElement.offsetWidth,
                myElementHeight = myElement.offsetHeight;
            const diff = this.activeWindows() * 20
            myElement.style.top = (pageHeight / 2) - (myElementHeight / 2) + diff + "px";
            myElement.style.left = (pageWidth / 2) - (myElementWidth / 2) + diff + "px";
        },
        checkTheresIsAnyAnotherCenteredWindow() { // not being used anymore but working well...
            const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
            const centeredWindows = windows.filter(el => {
                var myElement = el,
                    pageWidth = window.innerWidth,
                    pageHeight = window.innerHeight,
                    myElementWidth = myElement.offsetWidth,
                    myElementHeight = myElement.offsetHeight;

                return el.style.top === (pageHeight / 2) - (myElementHeight / 2) + "px" &&
                        el.style.left === (pageWidth / 2) - (myElementWidth / 2) + "px"
            })
            return centeredWindows
        },
        activeWindows() {
            const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
            const openedWindows = windows.filter(el => {
                return el.style.display === 'block'
            })
            return openedWindows.length
        },
        hide() {
            this.getThisWindowAndHeaderElements().window.style.display = 'none'
        },
        show() {
            this.getThisWindowAndHeaderElements().window.style.display = 'block'
        },
    },
    watch: {
        active (newValue) {
            if (newValue) {
                this.show()
                this.sendWindowToHighest()
                this.centerWindow()
            } else {
                this.hide()
            }
        }
    },
    mounted() {
        // 차트 툴팁, 클릭
        this.chartOptions.tooltips.callbacks.label = this.tooltipCustom;
        this.chartOptions.onClick = this.chartClick;

        this.dragElement()
        this.getThisWindowAndHeaderElements().window.addEventListener('click', () => {
            this.sendWindowToHighest()
        })
        this.getThisWindowAndHeaderElements().window.style.zIndex = 1000
        if (this.active)
        {
            this.handleChart()
            this.show()
            this.sendWindowToHighest()
            this.centerWindow()
        }
    }
}

</script>

<style>
.vue-window-modal {
    position: fixed;
    background-color: #f7f7f7;
    box-shadow: 7px 7px 50px 5px rgba(0,0,0,0.13);
    border: 1px solid #8080802b;
    border-radius: 3px;
    display: none;
    max-height: 90vh;
    max-width: 90vw;
}

.vue-window-modal .vue-window-modal-header {
    background-color: steelblue;
    padding: 5px;
    padding-left: 8px;
    padding-right: 8px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: white;
    height: 40px;
    font-size: 16px;
    cursor: -webkit-grab;
    user-select: none;
    font-weight: bold;
}

.vue-window-modal .vue-window-modal-header h6 {
    display: inline-block;
    position: relative;
    top: 3px;
    left: 5px;
}

.vue-window-modal .vue-window-modal-header img {
    float: right;
    cursor: pointer;
    position: relative;
    top: 6px;
}

#popimg{ margin-left:0px; margin-top: 0px; cursor: pointer; }
#popuptable{ font-size: 14px; }
.table-responsive{ width:93%; margin-left: 14px; }
/* table.b-table>thead>tr>th{ min-width: 90px; } */

#icon{ width: 20px; }
#iconMini{ width: 20px; margin-right: 3px; }
#iconEyes{ width: 20px; margin-right: 10px; }
#iconDown{ width: 20px; margin-right: 5px; }

#detailUl {height: 188px; overflow-y: scroll; margin-left: -15px; }
</style>