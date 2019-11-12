<template>
<div>
    <b-button id="popopen" variant="success" :disabled="popdisabled" @click="newwindowclick">새창보기</b-button>
    <b-button id="collapse" variant="info" :disabled="btndisabled" @click="allclose">접기</b-button>
    <b-button id="detail" variant="info" @click="allopen" :disabled="btndisabled">
        펼치기
        <b-badge variant="light">
        {{badgeNum}} <span class="sr-only">unread messages</span>
        </b-badge>
    </b-button>
    
    <b-button id="download" @click="downloadBtn" :disabled="popdisabled" v-b-tooltip title="차트 다운로드">
        <custom-icon name="download" base-class="custom-icon"></custom-icon>
    </b-button>
    <b-button id="excel" @click="downloadExcel" :disabled="popdisabled" v-b-tooltip title="엑셀 다운로드">
        <custom-icon name="file-text" base-class="custom-icon"></custom-icon>
    </b-button>
    <line-chart ref="trend" :data="trendItems" ytitle="발생빈도" v-bind:style="{ height, width }"
    :messages="{empty: 'No data'}" :library="chartOptions" :legend="true" :curve="false"
    ></line-chart>

    <windowModal 
    v-for="w in this.winList"
    :key="w.id"
    :active="w.active"
    :title="w.title"
    :data="w.data"
    v-on:clickClose="winclose"
    v-on:clickMini="winmini"
    />
</div>
</template>

<script>
import windowModal from './popup/WindowPopup'
import zoom from 'chartjs-plugin-zoom'
import customIcon from 'vue-icon/lib/vue-feather.esm'
import saveAs from 'file-saver'
import toBlob from 'canvas-toBlob'
import XLSX from 'xlsx'

export default {
    components: { windowModal, zoom, customIcon, saveAs, toBlob, XLSX },
    data() {
        return {
            winList: [],
            width: '',
            height: '800px',
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
    computed: {
        badgeNum: function() {
            return this.winList.filter(g=>!g.active).length
        },
        btndisabled: function() {
            return this.$store.state.btndisable
        },
        popdisabled: function() {
            return this.$store.state.popdisable
        },
        trendItems: function() {
            return this.$store.state.trendItems;
        },
        type2Items: function() {
            return this.$store.state.type2Items;
        }
    },
    methods: {
        // 차트 클릭 이벤트
        chartClick: function(evt){
            if(evt.ctrlKey) {
                // zoom 리셋
                this.$refs.trend.chart.chart.resetZoom();
            }
        },
        // 엑셀 데이터 다운로드
        downloadExcel() {
            var item = XLSX.utils.json_to_sheet(this.$store.state.excelData);
            var wb = XLSX.utils.book_new();

            var chartName = this.$store.state.title;
            var sheetName = 'trend 분석';
            XLSX.utils.book_append_sheet(wb, item, sheetName);
            XLSX.writeFile(wb, chartName + '.xlsx');
        },
        // 차트 다운로드
        downloadBtn() {
            // 차트에서 캔버스 속성 가져오기
            var canvas = this.$refs.trend.chart.element.lastElementChild;

            var chartName = this.$store.state.title;
            canvas.toBlob(function(blob) {
                saveAs(blob, chartName);
            });
        },
        // 차트 툴팁 관련 이벤트
        tooltipCustom: function(tooltipItem, data) {
            // chart의 datetime 추출 explorer는 new Date(tooltipItem.xLabel)이 적용되지 않음. => Invalid오류발생
            // var datetime = new Date(tooltipItem.xLabel);

            // chart의 datetime 추출
            var datetime = data.labels[tooltipItem.index];
            // store에 저장한 trendItems의 데이터의 datetime값과 chart의 datetime값 비교후 인덱스 추출
            var idx = this.$store.state.trendItems[tooltipItem.datasetIndex].data.findIndex(g=> g[0].toString() == datetime);

            if(this.$store.state.type2 == 0) {
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
                // 추출한 인덱스 값으로 클래스이름 찾아 저장
                var classname = '결함:              ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][2];
                // 추출한 인덱스 값으로 주공정 찾아 저장
                var plant = '주공정:           ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][3];
                
                if(this.$store.state.selectUL == 0) {
                    // 코일 결함수
                    var lengthDefect = '코일 결함수:  ' + tooltipItem.yLabel;
                    // 길이 결함수
                    var unitlength = '길이 결함수:  ' + Math.round(this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][4]);
                } else {
                    // 코일 결함수
                    var lengthDefect = '코일 결함수:  ' + this.$store.state.trendItems[tooltipItem.datasetIndex].data[idx][4];
                    // 길이 결함수
                    var unitlength = '길이 결함수:  ' + Math.round(tooltipItem.yLabel);
                }
                
                return [plant, classname, lengthDefect, unitlength];
            }
        },
        // '새창보기' 버튼 클릭
        newwindowclick() {
            var find = this.winList.findIndex(g=> g.id == this.$store.state.uid);
            if(find >= 0) return;

            this.winList.push({
                id: this.$store.state.uid,
                active: true,
                title: this.$store.state.title,
                data: this.trendItems,
            });
            this.$store.state.winList = this.winList;
        },
        // 팝업창의 'x' 버튼 클릭
        winclose(item) {
            var idx = this.winList.findIndex(g=>g.id == item[0].id);
            this.winList[idx].active = false;
            this.winList.splice(idx,1);
        },
        // 팝업창의 '_' 버튼 클릭
        winmini(item) {
            var idx = this.winList.findIndex(g=>g.id == item[0].id);
            this.winList[idx].active = false;
        },
        // '펼치기' 버튼 클릭
        allopen() {
            this.winList.forEach(g=>{
                g.active = true;
            });
        },
        // '접기' 버튼 클릭
        allclose() {
            this.winList.forEach(g=>{
                g.active = false;
            });
        },
    },
    mounted() {
        this.chartOptions.tooltips.callbacks.label = this.tooltipCustom;
        this.chartOptions.onClick = this.chartClick;
    },
    watch: {
        type2Items: function(val) {
            if(val == null) return;

            if(val.length == 1)
            {
                this.winList.push({
                    id: this.$store.state.uid,
                    active: true,
                    title: this.$store.state.trendName0,
                    data: this.$store.state.trendItems0,
                });
            }
            else if(val.length == 2)
            {
                this.winList.push({
                    id: this.$store.state.uid - 1,
                    active: true,
                    title: this.$store.state.trendName0,
                    data: this.$store.state.trendItems0,
                });
                this.winList.push({
                    id: this.$store.state.uid,
                    active: true,
                    title: this.$store.state.trendName1,
                    data: this.$store.state.trendItems1,
                });
            }
            else if(val.length == 3)
            {
                this.winList.push({
                    id: this.$store.state.uid - 2,
                    active: true,
                    title: this.$store.state.trendName0,
                    data: this.$store.state.trendItems0,
                });
                this.winList.push({
                    id: this.$store.state.uid - 1,
                    active: true,
                    title: this.$store.state.trendName1,
                    data: this.$store.state.trendItems1,
                });
                this.winList.push({
                    id: this.$store.state.uid,
                    active: true,
                    title: this.$store.state.trendName2,
                    data: this.$store.state.trendItems2,
                });
            }
            else if(val.length == 4)
            {
                this.winList.push({
                    id: this.$store.state.uid - 3,
                    active: true,
                    title: this.$store.state.trendName0,
                    data: this.$store.state.trendItems0,
                });
                this.winList.push({
                    id: this.$store.state.uid - 2,
                    active: true,
                    title: this.$store.state.trendName1,
                    data: this.$store.state.trendItems1,
                });
                this.winList.push({
                    id: this.$store.state.uid - 1,
                    active: true,
                    title: this.$store.state.trendName2,
                    data: this.$store.state.trendItems2,
                });
                this.winList.push({
                    id: this.$store.state.uid,
                    active: true,
                    title: this.$store.state.trendName3,
                    data: this.$store.state.trendItems3,
                });
            }
            else if(val.length == 5)
            {
                this.winList.push({
                    id: this.$store.state.uid - 4,
                    active: true,
                    title: this.$store.state.trendName0,
                    data: this.$store.state.trendItems0,
                });
                this.winList.push({
                    id: this.$store.state.uid - 3,
                    active: true,
                    title: this.$store.state.trendName1,
                    data: this.$store.state.trendItems1,
                });
                this.winList.push({
                    id: this.$store.state.uid - 2,
                    active: true,
                    title: this.$store.state.trendName2,
                    data: this.$store.state.trendItems2,
                });
                this.winList.push({
                    id: this.$store.state.uid - 1,
                    active: true,
                    title: this.$store.state.trendName3,
                    data: this.$store.state.trendItems3,
                });
                this.winList.push({
                    id: this.$store.state.uid,
                    active: true,
                    title: this.$store.state.trendName4,
                    data: this.$store.state.trendItems4,
                });
            }
            else if(val.length == 6)
            {
                this.winList.push({
                    id: this.$store.state.uid - 5,
                    active: true,
                    title: this.$store.state.trendName0,
                    data: this.$store.state.trendItems0,
                });
                this.winList.push({
                    id: this.$store.state.uid - 4,
                    active: true,
                    title: this.$store.state.trendName1,
                    data: this.$store.state.trendItems1,
                });
                this.winList.push({
                    id: this.$store.state.uid - 3,
                    active: true,
                    title: this.$store.state.trendName2,
                    data: this.$store.state.trendItems2,
                });
                this.winList.push({
                    id: this.$store.state.uid - 2,
                    active: true,
                    title: this.$store.state.trendName3,
                    data: this.$store.state.trendItems3,
                });
                this.winList.push({
                    id: this.$store.state.uid - 1,
                    active: true,
                    title: this.$store.state.trendName4,
                    data: this.$store.state.trendItems4,
                });
                this.winList.push({
                    id: this.$store.state.uid,
                    active: true,
                    title: this.$store.state.trendName5,
                    data: this.$store.state.trendItems5,
                });
            }

            this.$store.state.winList = this.winList;
        }
    }
}
</script>

<style scoped>
#detail{ font-size: 12px; }
#collapse{ font-size: 12px; width: 70px; }
#popopen{ font-size: 12px; margin-left: 1030px; }

.custom-icon { width: 15px; margin-top: -10px; }
#download{ height: 32px; margin-left: 10px; }
#excel{ height: 32px; }
</style>
