<template>
<div>
    <div class="col-sm-12" style="padding-right: 0; padding-left: 0;">
        <div class="card">
            <div class="card-header">
                X축 항목(날짜 or 시간)
            </div>
            <div class="card-body" id="Periodlayout">
                <div class="pretty p-default p-round">
                    <input type="radio" name="radio0" value="1" v-model="radioFill">
                    <div class="state p-primary-o">
                        <label>생산계상일</label>
                    </div>
                </div><br>

                <div class="pretty p-default p-round">
                    <input type="radio" name="radio0" value="0" v-model="radioFill">
                    <div class="state p-primary-o">
                        <label>검사완료일시</label>
                    </div>
                </div><br><br>
                <date-picker v-model="time1" :lang="lang" format="MM-DD" range confirm id="picker"></date-picker>
            </div>
        </div>
    </div>
    <div class="col-sm-12" style="padding-right: 0; padding-left: 0;">
        <div class="card">
            <div class="card-header">
                Y축 항목
            </div>
            <div class="card-body" id="Searchlayout">
                <b-form-select v-model="type2selected" :options="type2Op" id="type2"></b-form-select>
                <br>

                <div class="pretty p-default p-round">
                    <input type="radio" name="radio1" value="0" v-model="selected">
                    <div class="state p-primary-o">
                        <label>코일</label>
                    </div>
                </div><br>

                <div class="pretty p-default p-round">
                    <input type="radio" name="radio1" value="1" v-model="selected">
                    <div class="state p-primary-o">
                        <label>단위길이(M)</label>
                    </div>
                </div>
                <b-form-input lazy-formatter @change="numChange" type="number" v-model="textInput" id="textbox" :disabled="textdisabled"/><br>

                <b-button class="btn btn-default" id="checkBtn" @click="search" variant="success">검색</b-button>
            </div>
        </div>
    </div>
    
    <loading :active.sync="isLoading" loader="dots" color="#0099ff" background-color="black" :is-full-page="true"></loading>
</div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import customIcon from 'vue-icon/lib/vue-feather.esm'
import axios from 'axios'

// 로딩 컴포넌트
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
    components: { DatePicker, customIcon, Loading },
    data() {
        return {
            time1: '',
            lang: {
                days: ['일', '월', '화', '수', '목', '금', '토'],
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                pickers: ['7일 후', '30일 후', '7일 이전', '30일 이전'],
                placeholder: {
                    dateRange: '날짜를 선택하세요.'
                }
            },
            textInput: 100,
            selected: 0,
            radioFill: 1,
            type2selected: 0,
            type2Op: [
                { text: '코일기준', value: 0 },
                { text: '일일기준', value: 1 }
            ],
            textdisabled: true
        }
    },
    computed: {
        defect: function() {
            return this.$store.state.defectItem;
        },
        path: function() {
            return this.$store.state.criticalpathItem;
        },
        cold: function() {
            return this.$store.state.coldrollingItem;
        },
        hot: function() {
            return this.$store.state.hotrollingItem;
        },
        yeonju: function() {
            return this.$store.state.yeonjuItem;
        },
        isLoading: function() {
            return this.$store.state.isLoading
        },
    },
    methods: {
        // Y축항목의 검색 버튼 클릭
        search() {
            // 예외처리
            if(this.$store.state.trendType == null) {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '트렌드가 선택되지 않았습니다. 확인해주세요.'
                })
                return;
            }

            // 예외처리 - 최소 하나이상 선택해야할 항목들 체크
            if (this.defect.length == 0 || this.time1 == '') {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '선택되지 않은 항목이 있습니다. 확인해주세요.'
                })
                return;
            }

            // 예외처리 - 특정빈도별 최소 하나 이상 선택해야할 항목들 체크
            if(this.$store.state.trendType == 1 && this.path.length == 0) {
                this.$swal({
                    type: 'warning',
                    title: 'warning',
                    text: '주공정별 트렌드 - 주공정 한개 이상 선택'
                })
                return;
            }
            if(this.$store.state.trendType == 2 && this.cold.length == 0) {
                this.$swal({
                    type: 'warning',
                    title: 'warning',
                    text: '냉간압연별 트렌드 - 냉간압연 한개 이상 선택'
                })
                return;
            }
            if(this.$store.state.trendType == 3 && this.hot.length == 0) {
                this.$swal({
                    type: 'warning',
                    title: 'warning',
                    text: '열연별 트렌드 - 열연 한개 이상 선택'
                })
                return;
            }
            if(this.$store.state.trendType == 4 && this.yeonju.length == 0) {
                this.$swal({
                    type: 'warning',
                    title: 'warning',
                    text: '연주별 트렌드 - 연주 한개 이상 선택'
                })
                return;
            }

            // 기간 범위 지정
            var dateRange = (this.time1[1].getTime() - this.time1[0].getTime()) / 1000 / 60 / 60 / 24 // 초, 분, 시간, 일
            if (dateRange > 31) {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '날짜 선택 범위를 한달이내로 지정하세요'
                })
                return;
            }

            // 버튼별 axios 데이터 this.$store.state.treeItems에 저장
            this.getTrend();
        },
        // 단위길이 textbox의 숫자 제한
        numChange() {
            this.selected = 1;
            
            if (this.textInput < 100) this.textInput = 100;
            else if(this.textInput > 1000) this.textInput = 1000;
        },
        // 주공정 format
        plantToIdx(name) {
            switch (name) {
                case "1CGL":
                    return 0;
                case "2CGL":
                    return 1;
                case "3CGL":
                    return 2;
                case "CAL":
                    return 3;
                case "EGL":
                    return 4;
                case "PL":
                    return 5;
            }
        },
        // 냉간압연 format
        coldToIdx(name) {
            switch (name) {
                case "순천":
                    return 0;
                case "1냉연":
                    return 1;
                case "2냉연":
                    return 2;
            }
        },
        // 열연 format
        hotToIdx(name) {
            switch (name) {
                case "1열연":
                    return 0;
                case "2열연":
                    return 1;
                case "박판":
                    return 2;
                case "외부소재":
                    return 3;
            }
        },
        // 연주 format
        yeonjuToIdx(name) {
            switch (name) {
                case "CCM1(1연주)":
                    return 0;
                case "CCM2(1연주)":
                    return 1;
                case "CCM3(1연주)":
                    return 2;
                case "CCM4(2연주)":
                    return 3;
                case "CCM5(2연주)":
                    return 4;
            }
        },
        // 데이터 바인딩
        bindingChartData(coil, items, dateTime, itemName) {
            var unitLength = coil.Count / (coil.SISCoilLength / (1000 * this.textInput));
            
            if (items.findIndex(g => g.name == itemName) < 0) {
                // 조회div의 코일을 선택했을경우
                if(this.selected == 0) {
                    items.push({
                        name: itemName,
                        data: [[dateTime, coil.Count, coil.CoilID, coil.ClassName, coil.PLNT_GP, coil.HR_PLNT_GP, coil.CC_MC_CD, 
                                coil.SISCoilLength, coil.LineName, unitLength]],
                        hide: false,
                        id: this.$store.state.uid
                    });
                } else { // 조회div의 단위길이를 선택했을경우
                    items.push({
                        name: itemName,
                        data: [[dateTime, unitLength, coil.CoilID, coil.ClassName, coil.PLNT_GP, coil.HR_PLNT_GP, coil.CC_MC_CD, 
                                coil.SISCoilLength, coil.LineName, coil.Count]],
                        hide: false,
                        id: this.$store.state.uid
                    });
                }
            } else {
                var series = items.find(g => g.name == itemName);
                if(this.selected == 0) {
                    series.data = series.data.concat([[dateTime, coil.Count, coil.CoilID, coil.ClassName, coil.PLNT_GP, 
                                                        coil.HR_PLNT_GP, coil.CC_MC_CD, coil.SISCoilLength, coil.LineName, unitLength]]);
                } else {
                    series.data = series.data.concat([[dateTime, unitLength, coil.CoilID, coil.ClassName, coil.PLNT_GP, 
                                                        coil.HR_PLNT_GP, coil.CC_MC_CD, coil.SISCoilLength, coil.LineName, coil.Count]]);
                }
            }
        },
        // 조건에 맞는 트렌드 데이터 저장
        getTrend: async function() {
            // 로딩중
            this.$store.state.isLoading = true;

            var firstYear = this.time1[0].getFullYear();
            var firstMonth = this.time1[0].getMonth() + 1;
            var firstDate = this.time1[0].getDate();

            var secoundYear = this.time1[1].getFullYear();
            var secoundMonth = this.time1[1].getMonth() + 1;
            var secoundDate = this.time1[1].getDate();
            if (parseInt(firstMonth) < 10) {
                firstMonth = '0' + firstMonth;
            }
            if (parseInt(secoundMonth) < 10) {
                secoundMonth = '0' + secoundMonth;
            }

            // 클래스
            var classnameList = this.$store.state.defectItem;
            var classname = "";
            classnameList.forEach(g=>{
                var text = g.name;
                classname += text + ",";
            });
            classname = classname.substr(0, classname.length-1);

            // 주공정
            var plantList = this.$store.state.criticalpathItem;
            var plant = "";
            if(typeof(plantList) == 'string') {
                var idx = this.plantToIdx(plantList);
                plant = idx;
            } else {
                plantList.forEach(g=>{
                    var idx = this.plantToIdx(g);
                    plant += idx + ",";
                });
                plant = plant.substr(0, plant.length-1);
            }

            // 냉간압연
            var coldList = this.$store.state.coldrollingItem;
            var cold = "";
            if(typeof(coldList) == 'string') {
                var idx = this.coldToIdx(coldList);
                cold = idx;
            } else {
                coldList.forEach(g=>{
                    var idx = this.coldToIdx(g);
                    cold += idx + ",";
                });
                cold = cold.substr(0, cold.length-1);
            }

            // 열연
            var hotList = this.$store.state.hotrollingItem;
            var hot = "";
            if(typeof(hotList) == 'string') {
                var idx = this.hotToIdx(hotList);
                hot = idx;
            } else {
                hotList.forEach(g=>{
                    var idx = this.hotToIdx(g);
                    hot += idx + ",";
                });
                hot = hot.substr(0, hot.length-1);
            }

            // 연주
            var yeonjuList = this.$store.state.yeonjuItem;
            var yeonju = "";
            if(typeof(yeonjuList) == 'string') {
                var idx = this.yeonjuToIdx(yeonjuList);
                yeonju = idx;
            } else {
                yeonjuList.forEach(g=>{
                    var idx = this.yeonjuToIdx(g);
                    yeonju += idx + ",";
                });
                yeonju = yeonju.substr(0, yeonju.length-1);
            }

            // len
            var len = 0;
            if(this.selected == 0) {
                len = 0;
            } else {
                len = this.textInput
            }

            // 시작일자
            var firstdate = firstYear + "-" + firstMonth + "-" + firstDate;
            // 종료일자
            var secounddate = secoundYear + "-" + secoundMonth + "-" + secoundDate;
            var items = [];
            this.$store.state.title = null;
            this.$store.state.trendItems = null;
            await axios.get(this.$store.state.baseURL + '/api/trend/', {
                    params: {
                        trend: this.$store.state.trendType,
                        classname: classname,
                        plant: plant,
                        cold: cold,
                        hot: hot,
                        cc: yeonju,
                        from: firstdate,
                        to: secounddate,
                        type1: this.radioFill,
                        type2: this.type2selected,
                        len: len
                    }
                })
                .then((response) => {
                    // 주공정 변환
                    var plantString = '';
                    if(typeof(plantList) == 'string') {
                        var idx = plantList;
                        plantString = idx;
                    } else {
                        plantList.forEach(g=>{
                            var idx = g;
                            plantString += idx + ",";
                        });
                        plantString = plantString.substr(0, plantString.length-1);
                    }

                    if(plantString == '') {
                        plantString = '1CGL, 2CGL, 3CGL, CAL, EGL, PL';
                    }

                    // 냉간압연 변환
                    var coldString = '';
                    if(typeof(coldList) == 'string') {
                        var idx = coldList;
                        coldString = idx;
                    } else {
                        coldList.forEach(g=>{
                            var idx = g;
                            coldString += idx + ",";
                        });
                        coldString = coldString.substr(0, coldString.length-1);
                    }

                    // 열연 변환
                    var hotString = '';
                    if(typeof(hotList) == 'string') {
                        var idx = hotList;
                        hotString = idx;
                    } else {
                        hotList.forEach(g=>{
                            var idx = g;
                            hotString += idx + ",";
                        });
                        hotString = hotString.substr(0, hotString.length-1);
                    }

                    // 연주 변환
                    var yeonjuString = '';
                    if(typeof(yeonjuList) == 'string') {
                        var idx = yeonjuList;
                        yeonjuString = idx;
                    } else {
                        yeonjuList.forEach(g=>{
                            var idx = g;
                            yeonjuString += idx + ",";
                        });
                        yeonjuString = yeonjuString.substr(0, yeonjuString.length-1);
                    }

                    var data = response.data;
                    // this.$store.state.uid++;

                    if(this.type2selected == 0) { // Y축항목 코일기준
                        this.$store.state.uid++;
                        data.forEach(coil => {
                            var dateTime = new Date(coil.EndTime);
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.bindingChartData(coil, items, dateTime, coil.LineName);
                                    this.$store.state.title = '결함 지정 주공정별 결함 빈도(' + classname + ')';
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.bindingChartData(coil, items, dateTime, coil.PLNT_GP);
                                    this.$store.state.title = '결함 지정 냉간압연별 결함 빈도(' + classname + ')';
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.bindingChartData(coil, items, dateTime, coil.HR_PLNT_GP);
                                    this.$store.state.title = '결함 지정 열연별 결함 빈도(' + classname + ')';
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.bindingChartData(coil, items, dateTime, coil.CC_MC_CD);
                                    this.$store.state.title = '결함 지정 연주별 결함 빈도(' + classname + ')';
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.bindingChartData(coil, items, dateTime, coil.ClassName);
                                    this.$store.state.title = '결함별 빈도(' + plantString + ')';
                                    break;
                            }
                        });

                        // trend data 저장
                        this.$store.state.trendItems = items;

                        // 시간 formatting 변수
                        var timeFormat;
                        var scarfingFormat;
                        // 검사구분 formatting 변수
                        var inspectionFormat;
                        // 엑셀 데이터 저장 변수 초기화
                        this.$store.state.excelData = [];

                        // 전체 데이터(excel)
                        response.data.forEach(g => {
                            timeFormat = g.EndTime.replace('T', ' ').substr(5, 19);
                            scarfingFormat = g.SCARF_WRK_DT.replace('T', ' ').substr(5, 19);

                            // 3CGL의 경우 '-'(언더바)가 없다. 다른 공정은 '-'(언더바)가 있음.
                            // if(g.InspectionName.indexOf('-') != -1) {
                            //     inspectionFormat = g.InspectionName.charAt(g.InspectionName.length - 1);
                            // } else {
                            //     inspectionFormat = g.InspectionName;
                            // }

                            // 3CGL 경우는 inspectionName 그대로.. 나머지 경우 ex) AK91245_NQG-0 → 0으로 표시 (마지막 -로 구분)
                            if(g.LineName != '3CGL') {
                                inspectionFormat = g.InspectionName.charAt(g.InspectionName.length - 1);
                            } else {
                                inspectionFormat = g.InspectionName;
                            }

                            this.$store.state.excelData.push({'코일번호': g.CoilID, '주공정': g.LineName, '검사일': timeFormat, '결함': g.ClassName, '결함수': g.Count, 
                            '냉간압연': g.PLNT_GP, '열연': g.HR_PLNT_GP, '연주': g.CC_MC_CD, '제강': g.SLMK_PLNT_GP, '검사길이': Math.round(g.SISCoilLength), '검사구분': inspectionFormat,
                            '레시피': g.Recipe, '강종': g.MQC, '총결함': g.TotalDefectCount, '전면결함': g.FrontDefectCount, '이면결함': g.BackDefectCount,
                            'Roll단위명': g.ROLL_UNIT_NAME , 'Roll단위내순서': g.ROLL_UNIT_IN_SEQ, '압연작업계상일자': g.MILL_WRK_HDS_DD, '두께': g.COIL_T,
                            '폭': g.COIL_W, 'SRT_가열로추출소재온도': g.REFUR_EXT_MATL_TMP, '주편번호': g.MSLAB_NO, '주편두께': g.MSLAB_T, '주편폭': g.MSLAB_W,
                            '출강목표기호': g.SPEC_HEATOUT_AIM, 'Scarfing여부': g.SCARFING_YN, 'Scarfing작업일시': scarfingFormat, '주편특성코드': g.MSLAB_ASGN_GP,
                            '지시주편손질방법': g.WO_MSLAB_RPR_MTD, '주편전단계상일자': g.MSLAB_FS_HDS_DD, 'Scarfing장소': g.SCARF_LOC, '총 재로 시간': g.TOT_INFUR_HR,
                            '주조최대속도': g.CS_MAX_SPD, '주조최소속도': g.CS_MIN_SPD, '주조평균속도': g.CS_AVG_SPD, '연주EMS사용여부': g.EMS_USE_YN,
                            'Cast번호': g.CAST_NO, 'Cast내Heat수': g.CAST_IN_HEAT_QNTY, 'Cast내Heat순위': g.CAST_HEAT_SEQ, '동일Tundish내주조순서': g.SAME_TD_CS_SEQ,
                            'MoldFlux코드': g.MD_FLX_CD, 'EMS패턴': g.EMS_PATN, '소강성분C실적치': g.C_WRSLT, '소강성분Si실적치': g.SI_WRSLT, '소강성분Mn실적치': g.MN_WRSLT,
                            '소강성분P실적치': g.P_WRSLT, '소강성분S실적치': g.S_WRSLT, '소강성분N실적치': g.N_WRSLT, '전로번호': g.FF_NO, '주문품명': g.PRDN_CD,
                            '주문용도': g.USG_CD, '주문 두께': g.ORD_THK, '주문 폭': g.ORD_WTH, '도금량 전면': g.GW_FRN,'생산계상일':g.PDN_APT_DD,'PCM열연 코일 번호': g.RPV_RMTL_NO});
                        })

                        // 차트의 새창보기, 접기, 펼치기 버튼 활성화
                        this.$store.state.btndisable = false;
                        this.$store.state.popdisable = false;
                    } else { // Y축항목 일일기준
                        var type2Item = [];
                        for(var i = 0; i < data.length; i++) {
                            items = [];
                            var data0 = data[i].Data[0];
                            var data1 = data[i].Data[1];
                            var data2 = data[i].Data[2];
                            this.$store.state.uid++;

                            data0.Val.forEach(g => {
                                var dateTime = new Date(g.Date);
                                var idx = items.findIndex(s => s.name == data0.Series);
                                if(idx < 0) {
                                    if(this.selected == 0) {
                                        items.push({
                                            name: data0.Series,
                                            data: [[dateTime, g.Count, g.ClassName, g.Name, g.CountLen]],
                                            hide: false,
                                            id: this.$store.state.uid
                                        });
                                    } else {
                                        items.push({
                                            name: data0.Series,
                                            data: [[dateTime, g.CountLen, g.ClassName, g.Name, g.Count]],
                                            hide: false,
                                            id: this.$store.state.uid
                                        });
                                    }
                                } else {
                                    var series = items.find(g => g.name == data0.Series);
                                    if(this.selected == 0) {
                                        series.data = series.data.concat([[dateTime, g.Count, g.ClassName, g.Name, g.CountLen]]);
                                    } else {
                                        series.data = series.data.concat([[dateTime, g.CountLen, g.ClassName, g.Name, g.Count]]);
                                    }
                                }
                            })
                            data1.Val.forEach(g => {
                                var dateTime = new Date(g.Date);
                                var idx = items.findIndex(s => s.name == data1.Series);
                                if(idx < 0) {
                                    if(this.selected == 0) {
                                        items.push({
                                            name: data1.Series,
                                            data: [[dateTime, g.Count, g.ClassName, g.Name, g.CountLen]],
                                            hide: false,
                                            id: this.$store.state.uid
                                        });
                                    } else {
                                        items.push({
                                            name: data1.Series,
                                            data: [[dateTime, g.CountLen, g.ClassName, g.Name, g.Count]],
                                            hide: false,
                                            id: this.$store.state.uid
                                        });
                                    }
                                } else {
                                    var series = items.find(g => g.name == data1.Series);
                                    if(this.selected == 0) {
                                        series.data = series.data.concat([[dateTime, g.Count, g.ClassName, g.Name, g.CountLen]]);
                                    } else {
                                        series.data = series.data.concat([[dateTime, g.CountLen, g.ClassName, g.Name, g.Count]]);
                                    }
                                }
                            })
                            data2.Val.forEach(g => {
                                var dateTime = new Date(g.Date);
                                var idx = items.findIndex(s => s.name == data2.Series);
                                if(idx < 0) {
                                    if(this.selected == 0) {
                                        items.push({
                                            name: data2.Series,
                                            data: [[dateTime, g.Count, g.ClassName, g.Name, g.CountLen]],
                                            hide: false,
                                            id: this.$store.state.uid
                                        });
                                    } else {
                                        items.push({
                                            name: data2.Series,
                                            data: [[dateTime, g.CountLen, g.ClassName, g.Name, g.Count]],
                                            hide: false,
                                            id: this.$store.state.uid
                                        });
                                    }
                                } else {
                                    var series = items.find(g => g.name == data2.Series);
                                    if(this.selected == 0) {
                                        series.data = series.data.concat([[dateTime, g.Count, g.ClassName, g.Name, g.CountLen]]);
                                    } else {
                                        series.data = series.data.concat([[dateTime, g.CountLen, g.ClassName, g.Name, g.Count]]);
                                    }
                                }
                            })

                            type2Item[i] = items;
                        }

                        // 화면에 뿌려질 차트 데이터
                        this.$store.state.trendItems = [];
                        // this.$store.state.trendItems = type2Item[0];
                        // switch(this.$store.state.trendType) {
                        //     // 결함 지정 주공정별 결함빈도
                        //     case 1:
                        //         this.$store.state.title = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                        //         break;
                        //     // 결함 지정 냉간압연별 결함빈도
                        //     case 2:
                        //         this.$store.state.title = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                        //         break;
                        //     // 결함 지정 열연별 결함빈도
                        //     case 3:
                        //         this.$store.state.title = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                        //         break;
                        //     // 결함 지정 연주별 결함빈도
                        //     case 4:
                        //         this.$store.state.title = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                        //         break;
                        //     // 결함별 빈도
                        //     case 5:
                        //         this.$store.state.title = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                        //         break;
                        // }
                        
                        // 팝업으로 가져갈 차트 데이터
                        this.$store.state.type2Items = type2Item;
                        // 초기화
                        this.$store.state.trendItems0 = [];
                        this.$store.state.trendItems1 = [];
                        this.$store.state.trendItems2 = [];
                        this.$store.state.trendItems3 = [];
                        this.$store.state.trendItems4 = [];
                        this.$store.state.trendItems5 = [];
                        this.$store.state.trendName0 = null;
                        this.$store.state.trendName1 = null;
                        this.$store.state.trendName2 = null;
                        this.$store.state.trendName3 = null;
                        this.$store.state.trendName4 = null;
                        this.$store.state.trendName5 = null;

                        if(type2Item.length == 1) {
                            this.$store.state.trendItems0 = type2Item[0];
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.$store.state.trendName0 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.$store.state.trendName0 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.$store.state.trendName0 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.$store.state.trendName0 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.$store.state.trendName0 = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                                    break;
                            }
                        }
                        else if(type2Item.length == 2) {
                            this.$store.state.trendItems0 = type2Item[0];
                            this.$store.state.trendItems1 = type2Item[1];
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.$store.state.trendName0 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.$store.state.trendName0 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.$store.state.trendName0 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.$store.state.trendName0 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.$store.state.trendName0 = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함별 빈도(' + plantString + ') - ' + type2Item[1][0].data[0][3];
                                    break;
                            }
                        }
                        else if(type2Item.length == 3) {
                            this.$store.state.trendItems0 = type2Item[0];
                            this.$store.state.trendItems1 = type2Item[1];
                            this.$store.state.trendItems2 = type2Item[2];
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.$store.state.trendName0 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.$store.state.trendName0 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.$store.state.trendName0 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.$store.state.trendName0 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.$store.state.trendName0 = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함별 빈도(' + plantString + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함별 빈도(' + plantString + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                            }
                        }
                        else if(type2Item.length == 4) {
                            this.$store.state.trendItems0 = type2Item[0];
                            this.$store.state.trendItems1 = type2Item[1];
                            this.$store.state.trendItems2 = type2Item[2];
                            this.$store.state.trendItems3 = type2Item[3];
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.$store.state.trendName0 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.$store.state.trendName0 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.$store.state.trendName0 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.$store.state.trendName0 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.$store.state.trendName0 = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함별 빈도(' + plantString + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함별 빈도(' + plantString + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함별 빈도(' + plantString + ') - ' + type2Item[3][0].data[0][3];
                                    break;
                            }
                        }
                        else if(type2Item.length == 5) {
                            this.$store.state.trendItems0 = type2Item[0];
                            this.$store.state.trendItems1 = type2Item[1];
                            this.$store.state.trendItems2 = type2Item[2];
                            this.$store.state.trendItems3 = type2Item[3];
                            this.$store.state.trendItems4 = type2Item[4];
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.$store.state.trendName0 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    this.$store.state.trendName4 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[4][0].data[0][3];
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.$store.state.trendName0 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.$store.state.trendName0 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.$store.state.trendName0 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    this.$store.state.trendName4 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[4][0].data[0][3];
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.$store.state.trendName0 = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함별 빈도(' + plantString + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함별 빈도(' + plantString + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함별 빈도(' + plantString + ') - ' + type2Item[3][0].data[0][3];
                                    this.$store.state.trendName4 = '결함별 빈도(' + plantString + ') - ' + type2Item[4][0].data[0][3];
                                    break;
                            }
                        }
                        else if(type2Item.length == 6) {
                            this.$store.state.trendItems0 = type2Item[0];
                            this.$store.state.trendItems1 = type2Item[1];
                            this.$store.state.trendItems2 = type2Item[2];
                            this.$store.state.trendItems3 = type2Item[3];
                            this.$store.state.trendItems4 = type2Item[4];
                            this.$store.state.trendItems5 = type2Item[5];
                            switch(this.$store.state.trendType) {
                                // 결함 지정 주공정별 결함빈도
                                case 1:
                                    this.$store.state.trendName0 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    this.$store.state.trendName4 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[4][0].data[0][3];
                                    this.$store.state.trendName5 = '결함 지정 주공정별 결함 빈도(' + classname + ') - ' + type2Item[5][0].data[0][3];
                                    break;
                                // 결함 지정 냉간압연별 결함빈도
                                case 2:
                                    this.$store.state.trendName0 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 냉간압연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    break;
                                // 결함 지정 열연별 결함빈도
                                case 3:
                                    this.$store.state.trendName0 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 열연별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    break;
                                // 결함 지정 연주별 결함빈도
                                case 4:
                                    this.$store.state.trendName0 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[3][0].data[0][3];
                                    this.$store.state.trendName4 = '결함 지정 연주별 결함 빈도(' + classname + ') - ' + type2Item[4][0].data[0][3];
                                    break;
                                // 결함별 빈도
                                case 5:
                                    this.$store.state.trendName0 = '결함별 빈도(' + plantString + ') - ' + type2Item[0][0].data[0][3];
                                    this.$store.state.trendName1 = '결함별 빈도(' + plantString + ') - ' + type2Item[1][0].data[0][3];
                                    this.$store.state.trendName2 = '결함별 빈도(' + plantString + ') - ' + type2Item[2][0].data[0][3];
                                    this.$store.state.trendName3 = '결함별 빈도(' + plantString + ') - ' + type2Item[3][0].data[0][3];
                                    this.$store.state.trendName4 = '결함별 빈도(' + plantString + ') - ' + type2Item[4][0].data[0][3];
                                    this.$store.state.trendName5 = '결함별 빈도(' + plantString + ') - ' + type2Item[5][0].data[0][3];
                                    break;
                            }
                        }

                        // 시간 formatting 변수
                        var timeFormat;
                        var scarfingFormat;
                        // 검사구분 formatting 변수
                        var inspectionFormat;
                        // 엑셀 데이터 저장 변수 초기화
                        this.$store.state.excelData = [];

                        // 전체 데이터(excel)
                        response.data.forEach(g => {
                            timeFormat = g.EndTime.replace('T', ' ').substr(5, 19);
                            scarfingFormat = g.SCARF_WRK_DT.replace('T', ' ').substr(5, 19);

                            // 3CGL의 경우 '-'(언더바)가 없다. 다른 공정은 '-'(언더바)가 있음.
                            // if(g.InspectionName.indexOf('-') != -1) {
                            //     inspectionFormat = g.InspectionName.charAt(g.InspectionName.length - 1);
                            // } else {
                            //     inspectionFormat = g.InspectionName;
                            // }

                            // 3CGL 경우는 inspectionName 그대로.. 나머지 경우 ex) AK91245_NQG-0 → 0으로 표시 (마지막 -로 구분)
                            if(g.LineName != '3CGL') {
                                inspectionFormat = g.InspectionName.charAt(g.InspectionName.length - 1);
                            } else {
                                inspectionFormat = g.InspectionName;
                            }

                            this.$store.state.excelData.push({'코일번호': g.CoilID, '주공정': g.LineName, '검사일': timeFormat, '결함': g.ClassName, '결함수': g.Count, 
                            '냉간압연': g.PLNT_GP, '열연': g.HR_PLNT_GP, '연주': g.CC_MC_CD, '제강': g.SLMK_PLNT_GP, '검사길이': Math.round(g.SISCoilLength), '검사구분': inspectionFormat,
                            '레시피': g.Recipe, '강종': g.MQC, '총결함': g.TotalDefectCount, '전면결함': g.FrontDefectCount, '이면결함': g.BackDefectCount,
                            'Roll단위명': g.ROLL_UNIT_NAME , 'Roll단위내순서': g.ROLL_UNIT_IN_SEQ, '압연작업계상일자': g.MILL_WRK_HDS_DD, '두께': g.COIL_T,
                            '폭': g.COIL_W, 'SRT_가열로추출소재온도': g.REFUR_EXT_MATL_TMP, '주편번호': g.MSLAB_NO, '주편두께': g.MSLAB_T, '주편폭': g.MSLAB_W,
                            '출강목표기호': g.SPEC_HEATOUT_AIM, 'Scarfing여부': g.SCARFING_YN, 'Scarfing작업일시': scarfingFormat, '주편특성코드': g.MSLAB_ASGN_GP,
                            '지시주편손질방법': g.WO_MSLAB_RPR_MTD, '주편전단계상일자': g.MSLAB_FS_HDS_DD, 'Scarfing장소': g.SCARF_LOC, '총 재로 시간': g.TOT_INFUR_HR,
                            '주조최대속도': g.CS_MAX_SPD, '주조최소속도': g.CS_MIN_SPD, '주조평균속도': g.CS_AVG_SPD, '연주EMS사용여부': g.EMS_USE_YN,
                            'Cast번호': g.CAST_NO, 'Cast내Heat수': g.CAST_IN_HEAT_QNTY, 'Cast내Heat순위': g.CAST_HEAT_SEQ, '동일Tundish내주조순서': g.SAME_TD_CS_SEQ,
                            'MoldFlux코드': g.MD_FLX_CD, 'EMS패턴': g.EMS_PATN, '소강성분C실적치': g.C_WRSLT, '소강성분Si실적치': g.SI_WRSLT, '소강성분Mn실적치': g.MN_WRSLT,
                            '소강성분P실적치': g.P_WRSLT, '소강성분S실적치': g.S_WRSLT, '소강성분N실적치': g.N_WRSLT, '전로번호': g.FF_NO, '주문품명': g.PRDN_CD,
                            '주문용도': g.USG_CD, '주문 두께': g.ORD_THK, '주문 폭': g.ORD_WTH, '도금량 전면': g.GW_FRN,'생산계상일':g.PDN_APT_DD,'PCM열연 코일 번호': g.RPV_RMTL_NO});
                        })

                        // 차트의 새창보기 버튼 비활성화
                        this.$store.state.popdisable = true;
                        // 차트의 접기, 펼치기 버튼 활성화
                        this.$store.state.btndisable = false;
                    }
                })
                .catch((ex) => {
                    console.log("ERROR!!!: ", ex);
                })

            // 로딩 종료
            this.$store.state.isLoading = false;
        }
    },
    watch: {
        selected: function(val) {
            this.$store.state.selectUL = val;

            if(val == 1) this.textdisabled = false;
            else this.textdisabled = true;
        },
        type2selected: function(val) {
            this.$store.state.type2 = val;
        }
    }
}
</script>

<style scoped>
.card-header { font-weight: bold; color: white; background-color: lightslategray; padding: 6px; }
.card { margin-bottom: 5px; }
.custom-icon { width: 15px; height: 15px; margin-top: 4px; color: white; float: right; cursor: pointer; }

#Periodlayout { height: 128px; font-size: 14px; margin-top: -15px; margin-left: -10px; }
#Searchlayout { height: 160px; font-size: 14px; margin-top: -15px; margin-left: -10px; }

#picker { width: 105%; height: 36px; margin-left: 0px; }
#textbox{ width: 42%; margin-left: 105px; margin-top: -25px; height: 30px; }
#checkBtn { font-size: 13px; color: white; height: 33px; float: right; margin-top: -10px; }
#type2{ font-size: 14px; height: 33px; margin-bottom: 10px; }
</style>
