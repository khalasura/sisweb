<template>
<div>
    <b-form-group>
        <b-form-radio-group id="radios1" v-model="fillcheck" :options="options" name="radioOpenions">
        </b-form-radio-group>
    </b-form-group>

    <!-- 생산계상일 -->
    <div v-if="fillcheck == 1">
        <!-- selectbox !-->
        <label id="selected">공정:&nbsp;&nbsp;</label>
        <b-form-select v-model="startOption" :options="startop" id="comboForm"></b-form-select>
        <!-- datepicker !-->
        <br>
        <label id="datelabel">&nbsp;&nbsp;&nbsp;생산일:&nbsp;&nbsp;</label>
        <date-picker v-model="times" :lang="langs" format="MM-DD" range confirm id="picker"></date-picker>
        <b-button class="btn btn-default" id="checkBtn" @click="StartSearch" variant="success"> <custom-icon name="search" base-class="custom-icon"></custom-icon> 검색</b-button>
    </div>

    <!-- 검사일 -->
    <div v-if="fillcheck == 2">
        <!-- selectbox !-->
        <label id="selected">공정:&nbsp;&nbsp;</label>
        <b-form-select v-model="comboOption" :options="gongjungop" id="comboForm"></b-form-select>
        <!-- datepicker !-->
        <br>
        <label id="datelabel">&nbsp;&nbsp;&nbsp;검사일:&nbsp;&nbsp;</label>
        <date-picker v-model="time1" :lang="lang" format="MM-DD" range confirm id="picker"></date-picker>
        <b-button class="btn btn-default" id="checkBtn" @click="DateSearch" variant="success"> <custom-icon name="search" base-class="custom-icon"></custom-icon> 검색</b-button>
    </div>

    <!-- 번호 -->
    <div v-if="fillcheck == 3">
        <!-- selectbox !-->
        <label id="selected">구분:&nbsp;&nbsp;</label>
        <b-form-select v-model="selectedpath" :options="coilop" id="coilsearch"></b-form-select>
        <br>
        <label id="datelabel">&nbsp;&nbsp;&nbsp;번호:&nbsp;&nbsp;</label> <b-form-input type="text" v-model="textInput" :placeholder="holder" id="textbox" @keyup.enter.native="onEnter"/>
        <b-button class="btn btn-default" id="checkBtn" @click="CoilNoSearch" variant="success"> <custom-icon name="search" base-class="custom-icon"></custom-icon> 검색</b-button>
    </div>
</div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { DatePicker, customIcon },
    data() {
        return {
            // 라디오박스
            fillcheck: 1,
            options: [
                { text: '생산계상일', value: 1 },
                { text: '검사일', value: 2 },
                { text: '번호', value: 3 },
            ],
            // 생산계상일
            startOption: 0,
            startop: [
                { text: '1CGL', value: 0 },
                { text: '2CGL', value: 1 },
                { text: '3CGL', value: 2 },
                { text: 'CAL', value: 3 },
                { text: 'EGL', value: 4 },
                { text: 'PL', value: 5 },
            ],
            // 생산계상일 달력
            times: '',
            langs: {
                days: ['일', '월', '화', '수', '목', '금', '토'],
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                pickers: ['7일 후', '30일 후', '7일 이전', '30일 이전'],
                placeholder: {
                    dateRange: '날짜(생산일)를 선택'
                }
            },
            // 검사일
            comboOption: 0,
            gongjungop: [
                { text: '1CGL', value: 0 },
                { text: '2CGL', value: 1 },
                { text: '3CGL', value: 2 },
                { text: 'CAL', value: 3 },
                { text: 'EGL', value: 4 },
                { text: 'PL', value: 5 },
            ],
            // 검사일 달력
            time1: '',
            lang: {
                days: ['일', '월', '화', '수', '목', '금', '토'],
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                pickers: ['7일 후', '30일 후', '7일 이전', '30일 이전'],
                placeholder: {
                    dateRange: '날짜(검사일)를 선택'
                }
            },
            // 번호
            selectedpath: 1,
            coilop: [
                { text: '열연', value: 0 },
                { text: '냉연', value: 1 },
                { text: '제강/연주', value: 2 },
            ],
            holder: '코일명 검색',
            textInput: '',
        }
    },
    methods: {
        // 생산계상일 검색시 유효성 검사 및 데이터 받기
        StartSearch() {
            if(this.startOption != null && this.times != '') {
                // 날짜 범위 한달로 지정 (너무많은 데이터를 코일목록에 표출시 느려짐.. 이를 방지하기 위해)
                var dateRange = (this.times[1].getTime() - this.times[0].getTime()) / 1000 / 60 / 60 / 24 // 초, 분, 시간, 일
                if(dateRange > 31) {
                    this.$swal({
                        type: 'warning',
                        title: 'Warning',
                        text: '날짜 선택 범위를 한달이내로 지정하세요'
                    })
                    return;
                }

                var firstYear = this.times[0].getFullYear()
                var firstMonth = this.times[0].getMonth()+1
                var firstDate = this.times[0].getDate()
    
                var secoundYear = this.times[1].getFullYear()
                var secoundMonth = this.times[1].getMonth()+1
                var secoundDate = this.times[1].getDate()

    
                if(parseInt(firstMonth) < 10) {
                    firstMonth = '0' + firstMonth
                }
                if(parseInt(secoundMonth) < 10) {
                    secoundMonth = '0' + secoundMonth
                }
    
                var firstdate = firstYear + "-" + firstMonth + "-" + firstDate
                var secounddate = secoundYear + "-" + secoundMonth + "-" + secoundDate
    
                axios.get(this.$store.state.baseURL + '/api/coil', {params:{plant: this.startOption, date1: firstdate, date2: secounddate}}).then((response) => {
                    if(response.data.length == 0) {
                        this.$swal({
                            type: 'info',
                            title: 'Info',
                            text: '데이터가 없습니다.'
                        })
                    }
                    
                    this.excelData(response.data);
                    this.$store.state.gridrow = response.data;
                })
            } else {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '입력되지 않은 정보가 있습니다.'
                })
            }
        },
        // 검사일 검색시 유효성 검사 및 데이터 받기
        DateSearch() {
            if(this.comboOption != null && this.time1 != '') {
                // 날짜 범위 한달로 지정 (너무많은 데이터를 코일목록에 표출시 느려짐.. 이를 방지하기 위해)
                var dateRange = (this.time1[1].getTime() - this.time1[0].getTime()) / 1000 / 60 / 60 / 24 // 초, 분, 시간, 일
                if(dateRange > 31) {
                    this.$swal({
                        type: 'warning',
                        title: 'Warning',
                        text: '날짜 선택 범위를 한달이내로 지정하세요'
                    })
                    return;
                }

                var firstYear = this.time1[0].getFullYear()
                var firstMonth = this.time1[0].getMonth()+1
                var firstDate = this.time1[0].getDate()
    
                var secoundYear = this.time1[1].getFullYear()
                var secoundMonth = this.time1[1].getMonth()+1
                var secoundDate = this.time1[1].getDate()

    
                if(parseInt(firstMonth) < 10) {
                    firstMonth = '0' + firstMonth
                }
                if(parseInt(secoundMonth) < 10) {
                    secoundMonth = '0' + secoundMonth
                }
    
                var firstdate = firstYear + "-" + firstMonth + "-" + firstDate
                var secounddate = secoundYear + "-" + secoundMonth + "-" + secoundDate
    
                axios.get(this.$store.state.baseURL + '/api/coil', {params:{plant: this.comboOption, from: firstdate, to: secounddate}}).then((response) => {
                    if(response.data.length == 0) {
                        this.$swal({
                            type: 'info',
                            title: 'Info',
                            text: '데이터가 없습니다.'
                        })
                    }
                    
                    this.excelData(response.data);
                    this.$store.state.gridrow = response.data;
                })
            } else {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '입력되지 않은 정보가 있습니다.'
                })
            }
        },
        // 번호 검색시 유효성 검사
        CoilNoSearch(){
            if(this.textInput != '') {
                // 입력 유효성 검사
                switch(this.selectedpath)
                {                    
                    // 열연/냉연
                    case 0:
                    case 1:
                        if(this.textInput.length < 5) {
                            return this.$swal({
                                type: 'info',
                                title: 'Info',
                                text: '최소 5자리까지 입력하세요.'
                            })
                        }
                        else
                            this.CoilQuery();
                        break;                    
                    // 제강/연주(히트번호)
                    default:
                        if(this.textInput.length < 6) {
                            return this.$swal({
                                type: 'info',
                                title: 'Info',
                                text: '최소 6자리까지 입력하세요.'
                            })
                        }
                        else
                            this.HeatQuery();
                        break;
                }
            } else {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '입력되지 않은 정보가 있습니다.'
                })
            }
        },
        // 번호 검색시 열연,냉연 데이터 받기
        CoilQuery(){
            // isCold - 0:열연, 1:냉연
            axios.get(this.$store.state.baseURL + '/api/coil', {params:{isCold: this.selectedpath, coilId: this.textInput}}).then((response) => {
                if(response.data == null) {
                    this.$swal({
                        type: 'info',
                        title: 'Info',
                        text: '데이터가 없습니다.'
                    })
                }
                
                this.excelData(response.data);
                this.$store.state.gridrow = response.data;
            })
        },
        // 번호 검색시 제강/연주 데이터 받기
        HeatQuery(){
            axios.get(this.$store.state.baseURL + '/api/coil', {params:{heat2: this.textInput}}).then((response) => {
                if(response.data == null) {
                    this.$swal({
                        type: 'info',
                        title: 'Info',
                        text: '데이터가 없습니다.'
                    })
                }
                
                this.excelData(response.data);
                this.$store.state.gridrow = response.data;
            })
        },
        // 클래스 데이터 받기
        ClassQuery(){
            axios.get(this.$store.state.baseURL + '/api/class/').then((response)=>{
                this.result = response.data;
                this.$store.state.classInfo = [];
                response.data.forEach(classes=>{
                    this.$store.state.classInfo.push({name:classes.ClassName, desc:classes.ClassDescription, color:classes.Color, group:classes.GroupName});
                });
            })
            .catch((ex)=>{console.log("ERROR!!!: ", ex);})
        },
        // 번호 검색시 enter키로 검색가능하도록
        onEnter() {
            this.CoilNoSearch();
        },
        // 엑셀 데이터 저장
        excelData(data) {
            // excel data 초기화
            this.$store.state.excelList = [];

            // formatting 변수
            var startFormat = null;
            var endFormat = null;
            var line = null;

            // excel data 저장
            data.forEach(g=> {
                startFormat = g.StartTime.replace('T', ' ').substr(5, 19);
                endFormat = g.EndTime.replace('T', ' ').substr(5, 19);
                line = g.LineName;

                switch(line)
                {
                    case 0:
                        line = '1CGL';
                        break;
                    case 1:
                        line = '2CGL';
                        break;
                    case 2:
                        line = '3CGL';
                        break;
                    case 3:
                        line = 'CAL';
                        break;
                    case 4:
                        line = 'EGL';
                        break;
                    case 5:
                        line = 'PL';
                        break;
                    default:
                        line = 'UNKNOWN';
                        break;
                }

                this.$store.state.excelList.push({'코일명': g.CoilId, '구분': g.InspectionName_gb, '총결함': g.TotalDefectCount, '레시피': g.Recipe, '강종': g.MQC,
                '길이(m)': Math.round(g.SISCoilLength / 1000), '폭(mm)': Math.round(g.SISCoilWidth), '검사순서': g.CoilNo, '검사시작': startFormat, 
                '검사종료': endFormat, '통과공정': g.ACT_PAS_PROC, '생산계상일': g.PDN_APT_DD, '전면결함': g.FrontDefectCount, '이면결함': g.BackDefectCount, 
                '두께': g.CoilThickness, '공정명': line});
            });
            // excel download버튼 활성화
            this.$store.state.excelDisable = false;
        }
    },
    mounted(){
        this.ClassQuery();
    },
    watch: {
        selectedpath: function(val) {
            switch(val)
            {
                case 0:
                    return this.holder = '코일명 검색'
                case 1:
                    return this.holder = '코일명 검색'
                case 2:
                    return this.holder = 'Heat 번호 검색'
                default:
                    return;
            }
        }
    }
}
</script>

<style scoped>
.form-group{ margin-bottom: 7px; }

#coilsearch{ display: inline-block; width: 54%; height: 35px; }
#comboForm{ display: inline-block; width: 53%; height: 35px; margin-bottom: 5px; margin-left: 14px; }
.mx-input{ height: 36px; }

#picker{ width: 53%; height: 36px; margin-left: 0px; } /* width: 58% */
#selected{ margin-left: 13px; font-weight: bold; font-size: 15px; }
#datelabel{ font-weight: bold; font-size: 15px; margin-left: 0px; }

#checkBtn{ font-size: 12px; color: white; height: 33px; margin-top: -4px; }
.custom-icon { width: 12px; margin-top: -3px; }

#textbox{ width: 54.5%; height: 36px; margin-top: 4px; font-size: 14px; display: inline; }
</style>
