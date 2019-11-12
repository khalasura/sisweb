<template>
<div>    
    <b-modal ref="partModal" id="modal-part" centered title="부분조회 설정" header-bg-variant="dark" cancel-variant="danger"
            header-text-variant="light" @ok="handleOk" @cancel="$emit('handleCancel')" size="lg">
        <b-container fluid id="container">
            <div class="col-sm-4" style="border-right: 1px solid lightgray;">
                <label id="firstLabel">전체 이미지</label>
                <canvas ref="device" width="180" height="350">
                    <img ref="image"/>
                </canvas>
            </div>
            <div class="col-sm-8">
                <div class="row" id="coillenthlayout">
                    <div class="col-sm-12">
                        <label id="firstLabel">코일길이</label>
                        <!-- 위치지정을 위한 slider -->
                        <div>
                            <form @submit.stop.prevent="handleSubmit">
                                <label>시작점:</label> <b-form-input lazy-formatter @change="stxChange" type="number" placeholder="시작점을 설정하세요." v-model="stxLen" id="startinput"/> m
                                <label id="endtext">끝점:</label> <b-form-input lazy-formatter @change="endChange"  type="number" placeholder="끝점을 설정하세요." v-model="endLen" id="endinput"/> m
                                <b-button id="checkbtn" @click="checkclass" variant="success"><custom-icon name="search" base-class="custom-icon"></custom-icon>갯수조회</b-button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <label id="firstLabel">클래스별 결함 갯수</label>
                        <!-- 전,이면 class 갯수 및 선택을 위한 table -->
                        <table class="table table-bordered table-hover" style="margin-top: 3px; margin-bottom: -2px; text-align: center;">
                            <thead>
                                <tr style="background-color: rgb(246, 248, 251);">
                                    <th style="padding: 5px; margin: 0; width: 91px;">클래스명</th>
                                    <th style="padding: 5px; margin: 0; width: 91px;">전면 결함수</th>
                                    <th style="padding: 5px; margin: 0; width: 91px;">이면 결함수</th>
                                    <th style="padding: 5px; margin: 0; width: 107px;">선택</th>
                                </tr>
                            </thead>
                        </table>
                        <div id="table">
                            <b-table hover small bordered fixed
                                :items="item"
                                :fields="fields"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                            >

                            <template slot="checkbox" slot-scope="row">
                                <b-form-checkbox v-model="row.item.show">
                                    <label v-if="row.item.show == true">show</label>
                                    <label v-else>hide</label>
                                </b-form-checkbox>
                            </template>

                            <template slot="classes" slot-scope="row">
                                <label :style="{ color: row.item.color }">■</label> &nbsp;
                                <label>{{row.item.class}}</label>
                            </template>

                            </b-table>
                        </div>
                        <label id="textdisplay">{{totalRows}}개 클래스 / 전면: {{topcount}}개, 이면: {{botcount}}개, 총 결함: {{count}}개</label>
                        <br>
                        <label id="partLabel">그룹: </label>
                        <b-form-select v-model="classModel" :options="classOp" id="coilsearch"></b-form-select>
                        <b-button id="partselectbtn" variant="warning" @click="partSelect">선택</b-button>
                        <b-button id="partdeselectbtn" variant="warning" @click="partDeselect">해제</b-button>

                        <b-button id="selectbtn" variant="info" @click="allSelect">전체선택</b-button>
                        <b-button id="deselectbtn" variant="info" @click="allDeselect">전체해제</b-button>
                    </div>
                </div>
            </div>
        </b-container>
    </b-modal>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { customIcon },
    data() {
        return {
            stxLen: 0,
            endLen: 0,
            //endposition: '', display: 'none' position: 'absolute'
            fields: [
                { key: 'classes', label: '클래스명', thStyle: { display: 'none', width: '98px' } },
                { key: 'top', label: '전면 결함수', thStyle: { display: 'none', width: '96px' } },
                { key: 'bot', label: '이면 결함수', thStyle: { display: 'none', width: '96px' } },
                { key: 'checkbox', label: '선택', thStyle: { display: 'none', width: '98px' } }
            ],
            sortBy: null,
            sortDesc: false,
            showclass: 'show',
            clickcheck: false,
            classModel: '',
            handle: null, 
            offset: null,
            mouseHit: '',
            tick:1,
        }
    },
    props: {
        active: Boolean,
        //endLen: Number,
    },
    methods: {
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
        // 상태박스(노란네모박스)의 시작 길이
        stxChange(){
            // 유효성 검사
            if (this.mouseHit != '') return;
            if (this.stxLen < 0) this.stxLen = 0;
            if (this.stxLen >= this.endLen) this.stxLen = this.endLen - 1;
            // Y좌표 높이 산출
            var y = Math.round(this.stxLen / this.tick);
            var h = Math.round((this.endLen - this.stxLen) / this.tick)
            this.handle.pos.y = y;
            this.handle.dim.h = h;
            this.draw();
        },
        // 상태박스(노란네모박스)의 끝 길이
        endChange(){
            // 유효성 검사
            if (this.mouseHit != '') return;
            if (this.endLen <= this.stxLen) this.endLen = this.stxLen + 1;
            if (this.endLen > this.maxLen) this.endLen = this.maxLen;
            // Y좌표 높이 산출
            var y = Math.round(this.stxLen / this.tick);
            var h = Math.round((this.endLen - this.stxLen) / this.tick)
            this.handle.pos.y = y;
            this.handle.dim.h = h;
            this.draw();
        },
        // 코일길이
        displayLen(){
            this.stxLen = Math.round(this.handle.pos.y * this.tick);
            this.endLen = Math.round((this.handle.pos.y + this.handle.dim.h) * this.tick);            
        },
        // 캔버스 초기 데이터
        canvasInit: function(){                         
            // 캔바스
            var canvas = this.$refs.device;  
            this.handle = {
                color: 'rgba(233, 233, 0, 0.3)',
                dim: { w: canvas.width, h: 50 },
                pos: { x: 0, y: 0, padX: 0, padY: 0 },
                max: { w: canvas.width, h: canvas.height},
                stx: { x: 0, y: 0, w: 0, h: 0}

            }
            this.offset = {left:canvas.offsetLeft, top:canvas.offsetTop};
            this.tick = this.maxLen / canvas.height;
        },
        // 이미지 관련
        canvasEventAdd(){
            var canvas = this.$refs.device;
            //canvas.addEventListener("dblclick", this.handleDblClick, false);  
            canvas.addEventListener("mousedown", this.handleMouseDown, false); 
            canvas.addEventListener("mousemove", this.handleMouseMove, false);
            canvas.addEventListener("mouseup", this.handleMouseUp, false);             
        },
        // 이미지 그리기
        draw(){
            // 캔바스
            var canvas = this.$refs.device;            
            var ctx = canvas.getContext('2d');
            
            // 이미지
            var img = this.$refs.image;
            img.src = this.imgsrc;                     

            // 그리기
            var handle = this.handle;
            setTimeout(function() {
                // 캔바스 초기화
                ctx.clearRect(0,0,canvas.width,canvas.height);                
                ctx.drawImage(img,0,0, canvas.width, canvas.height);
                ctx.fillStyle = handle.color;
                ctx.fillRect(handle.pos.x, handle.pos.y, handle.dim.w, handle.dim.h);  
                ctx.strokeStyle = 'rgba(222,222,222,0.3)';
                ctx.strokeRect(handle.pos.x, handle.pos.y, handle.dim.w, handle.dim.h);                              
            }, 5);
        },
        // 이미지의 상태박스(노란네모박스)
        handleMouseDown: function (evt) {
            var handle = this.handle;
            var grabOffset = {
                x: evt.offsetX,
                y: evt.offsetY
            };
            // X좌표 히트 여부
            var xflag = grabOffset.x >= 0 && grabOffset.x <= handle.dim.w;
            // 중앙 히트 여부
            var cflag = grabOffset.y >= handle.pos.y && grabOffset.y <= (handle.pos.y + handle.dim.h);
            // 상단 히트 여부
            var tflag = grabOffset.y >= handle.pos.y-5 && grabOffset.y <= (handle.pos.y + 5);
            // 하단 히트 여부
            var bflag = grabOffset.y >= handle.pos.y + handle.dim.h -5 && grabOffset.y <= (handle.pos.y + handle.dim.h + 5);
            // 히트 여부에 따른 클릭 좌표 초기값 설정
            if (xflag && tflag){
                this.mouseHit = 'T';
                var padY = grabOffset.y - handle.pos.y;
                handle.stx.y = grabOffset.y - padY;
                handle.stx.h = handle.dim.h;
            }
            else if (xflag && bflag){
                this.mouseHit = 'B';
                var padY = grabOffset.y - (handle.dim.h + handle.pos.y);
                handle.stx.y = grabOffset.y - padY;
                handle.stx.h = handle.dim.h;                
            }
            else if (xflag && cflag){
                this.mouseHit = 'C';
                handle.pos.padY = grabOffset.y - handle.pos.y;
            }            
        },
        // 이미지의 상태박스(노란네모박스)
        handleMouseUp: function (evt) {
            this.mouseHit = '';
        },
        // 이미지의 상태박스(노란네모박스) 이동
        handleMouseMove: function (evt){
            var handle = this.handle;            
            switch(this.mouseHit)
            {
                case 'C':
                    handle.pos.y = evt.offsetY - this.handle.pos.padY;
                    // 범위 유효성
                    if (handle.pos.y < 0) {
                        handle.pos.y = 0;
                        //this.mouseHit = '';
                    }

                    if (handle.pos.y + handle.dim.h > handle.max.h) {
                        handle.pos.y = handle.max.h - handle.dim.h;
                    } 

                    if (handle.pos.y > handle.max.h) {
                        this.mouseHit = '';
                    }
                    // 다시 그리기
                    this.draw();
                    this.displayLen();
                break;
                case 'T':
                    var y = evt.offsetY;
                    // 범위 유효성
                    if (y <= 0) {
                        handle.pos.y = 0;
                        this.mouseHit = '';
                    }
                    if (y >= handle.max.h-1) {
                        this.mouseHit = '';
                    } 
                    // 높이 구하기
                    var max = handle.stx.h + handle.stx.y;
                    var h = max - y;
                    handle.dim.h = h;
                    if (h < 10){
                        handle.dim.h = 10;
                    }
                    handle.pos.y = y;
                    if (handle.pos.y > max-10)
                        handle.pos.y = max-10;
                    if (handle.pos.y + handle.dim.h >= handle.max.h) {
                        handle.pos.y = handle.max.h - handle.dim.h;
                    }                                        
                    // 다시 그리기
                    this.draw();
                    this.displayLen();
                break;
                case 'B':
                    var y = evt.offsetY;
                    // 범위 유효성
                    if (y <= 0) {
                        this.mouseHit = '';
                    }                    
                    if (y >= handle.max.h-1) {
                        this.mouseHit = '';
                    }

                    // 높이 구하기
                    var pad = y - handle.stx.y;
                    handle.dim.h = handle.stx.h + pad;
                    if (handle.pos.y + handle.dim.h > handle.max.h){
                        handle.dim.h = handle.max.h - handle.pos.y;
                    }                    
                    if (handle.dim.h < 10){
                        handle.dim.h = 10;
                    }                    
                    // 다시 그리기
                    this.draw();
                    this.displayLen();
                break;
                default:
                    var grabOffset = {
                        x: evt.offsetX,
                        y: evt.offsetY
                    };
                    // X좌표 히트 여부
                    var xflag = grabOffset.x >= 0 && grabOffset.x <= handle.dim.w;
                    // 중앙 히트 여부
                    var cflag = grabOffset.y >= handle.pos.y && grabOffset.y <= (handle.pos.y + handle.dim.h);
                    // 상단 히트 여부
                    var tflag = grabOffset.y >= handle.pos.y-5 && grabOffset.y <= (handle.pos.y + 5);
                    // 하단 히트 여부
                    var bflag = grabOffset.y >= handle.pos.y + handle.dim.h -5 && grabOffset.y <= (handle.pos.y + handle.dim.h + 5);
                    // 히트 여부에 따른 커서 초기값 설정
                    if (xflag && tflag){
                        this.$refs.device.style.cursor='n-resize';
                    }
                    else if (xflag && bflag){
                        this.$refs.device.style.cursor='n-resize';
                    }
                    else if (xflag && cflag){
                        this.$refs.device.style.cursor='pointer';
                    }
                    else{
                        this.$refs.device.style.cursor='default';
                    }

                break;               
            }               
        },
        // 전체선택
        allSelect() {
            for(var i = 0; i < this.item.length; i++) {
                this.item[i].show = true;
            }
            console.log(this.$store.state.partchart)
        },
        // 전체해제
        allDeselect() {
            for(var i = 0; i < this.item.length; i++) {
                this.item[i].show = false;
            }
        },
        // 클래스 선택 - ex) A - A1, A2, A3 ...
        partSelect() {
            switch(this.classModel)
            {
                case 'A':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'A') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'B':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'B') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'C':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'C') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'D':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'D') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'E':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'E') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'F':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'F') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'H':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'H') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'I':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'I') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'P':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'P') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'Q':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'Q') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'N':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'N') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'W':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'W') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                case 'U':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'U') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = true;
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        // 클래스 선택해제 - ex) A - A1, A2, A3 ...
        partDeselect() {
            switch(this.classModel)
            {
                case 'A':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'A') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'B':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'B') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'C':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'C') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'D':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'D') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'E':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'E') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'F':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'F') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'H':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'H') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'I':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'I') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'P':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'P') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'Q':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'Q') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'N':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'N') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'W':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'W') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                case 'U':
                    for(var i = 0; i < this.item.length; i++) {
                        if(this.item[i].class.substr(0, 1) == 'U') {
                            var idx = i
                        }

                        if(idx != null) {
                            this.item[idx].show = false;
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        // 모달창 안에서 slider로 위치(시작점, 끝점) 지정하고, 위치에 따른 결함 class의 갯수 표시
        checkclass() {
            this.$store.state.partchart = [];
            axios.get(this.$store.state.baseURL + '/api/defect/', {
                params : {plant:this.$store.state.currentCoil.LineName, coil:this.$store.state.currentCoil.CoilNo 
                            ,from: Number(this.stxLen) * 1000, to: Number(this.endLen) * 1000, flag:0}
            })
            .then((response)=>{
                response.data.forEach(g=>{
                    // 색상 찾기
                    var find = this.$store.state.classInfo.find(c => c.name == g.Class);
                    var a = 'gray';
                    if (find != null) {
                        a = find.color;
                    }

                    this.$store.state.partchart.push({class:g.Class, top:g.TopCnt, bot:g.BotCnt, show:true, total: g.TopCnt + g.BotCnt, color: a});
                });
            })
            .catch((ex)=>{
                console.log("ERROR!!!: ", ex);
            })
        },
        // 모달창의 ok 버튼 - 눌렀을때 지정한 길이와 클래스에 따라 전,이면에 표시
        handleOk(evt) {
            evt.preventDefault();
            if(!this.endLen) {
                this.$swal({
                    type: 'warning',
                    title: 'Warning',
                    text: '시작점과 끝점을 입력하세요.'
                })
            } else {
                this.$store.state.chartTOP = [];
                this.$store.state.chartBOT = [];
    
                this.queryPart();
                this.$refs.partModal.hide();
                this.$emit('handleOk');
            }
        },
        // 부분조회 - 선택한 길이 + 클래스에 대한 데이터 받기
        queryPart: async function() {
            this.$store.state.isLoading = true;
            var from = Number(this.stxLen);
            var to = Number(this.endLen);

            // 선택된 클래스명 모음
            var list = "";
            var find = this.$store.state.partchart.filter(g=> g.show);
            find.forEach(g=>{list += g.class + ","});

            this.$store.state.chartTOP = [];
            this.$store.state.chartBOT = [];
            var topItems = [];
            var botItems = [];
            var topRange = {min:0, max:0};
            var botRange = {min:0, max:0};
            var seqTop = 0;
            var seqBot = 0;

            await axios.get(this.$store.state.baseURL + '/api/defect/', {
                params : {plant:this.$store.state.currentCoil.LineName, coil:this.$store.state.currentCoil.CoilNo, 
                            from: from * 1000, to: to * 1000, classes: list}
            })
            .then((response)=>{
                this.$store.state.coildefect = response.data;
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

            // Top(전면)- x축
            this.$store.state.chartOptionsTOP.scales.xAxes[0].ticks.max = Math.round(this.$store.state.currentCoil.SISCoilWidth);
            this.$store.state.chartOptionsTOP.scales.xAxes[0].ticks.min = 0;
            this.$store.state.XsliderTOP.max = Math.round(this.$store.state.currentCoil.SISCoilWidth);
            this.$store.state.XsliderTOP.min = 0;
            this.$store.state.XsliderTOP.value = [0, Math.round(this.$store.state.currentCoil.SISCoilWidth)];

            // Top(이면)- x축
            this.$store.state.chartOptionsBOT.scales.xAxes[0].ticks.max = Math.round(this.$store.state.currentCoil.SISCoilWidth);
            this.$store.state.chartOptionsBOT.scales.xAxes[0].ticks.min = 0;
            this.$store.state.XsliderBOT.max = Math.round(this.$store.state.currentCoil.SISCoilWidth);
            this.$store.state.XsliderBOT.min = 0;
            this.$store.state.XsliderBOT.value = [0, Math.round(this.$store.state.currentCoil.SISCoilWidth)];

            // Top(전면)- y축
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.min = from;
            this.$store.state.chartOptionsTOP.scales.yAxes[0].ticks.max = to;
            this.$store.state.YsliderTOP.min = from;
            this.$store.state.YsliderTOP.max = to;
            this.$store.state.YsliderTOP.value = [from, to];

            // Bot(이면)- y축
            this.$store.state.chartOptionsBOT.scales.yAxes[0].ticks.min = from;
            this.$store.state.chartOptionsBOT.scales.yAxes[0].ticks.max = to;
            this.$store.state.YsliderBOT.min = from;
            this.$store.state.YsliderBOT.max = to;
            this.$store.state.YsliderBOT.value = [from, to];

            // classclick - 결함클래스 클릭 가능하게
            this.$store.state.classclick = false;
            this.$store.state.isLoading = false;
        },
    },
    computed: {
        item: function() {
            return this.$store.state.partchart
        },
        totalRows: function() {
            return this.item.length
        },
        count: function() {
            var count = 0
            for(var i = 0; i < this.$store.state.partchart.length; i++) {
                count += this.$store.state.partchart[i].total
            }
            return count
        },
        topcount: function() {
            var topcount = 0
            for(var i = 0; i < this.$store.state.partchart.length; i++) {
                topcount += this.$store.state.partchart[i].top
            }
            return topcount
        },
        botcount: function() {
            var botcount = 0
            for(var i = 0; i < this.$store.state.partchart.length; i++) {
                botcount += this.$store.state.partchart[i].bot
            }
            return botcount
        },
        classOp: function() {
            var overlapStr = [];
            var str = [];
            for(var i = 0; i < this.$store.state.partchart.length; i++) {
                overlapStr[i] = this.$store.state.partchart[i].class.substr(0, 1)
            }
            str = overlapStr.filter((item, idx, array) => {
                return array.indexOf(item) == idx;
            })
            return str
        },
        imgsrc: function() {
            return "data:image/png;base64," + this.$store.state.coilImage
        },
        maxLen: function(){
            return Math.round(this.$store.state.currentCoil.SISCoilLength/1000);
        }              
    },    
    watch: {
        active: function(val){
            if (val)
                this.$refs.partModal.show();
            else
                this.$refs.partModal.hide();
        },
        imgsrc: function(val){
            this.canvasInit();
            this.draw();
            this.displayLen();
        },
        mouseHit: function(val){
            if (val == ''){
                this.checkclass()
            }
        }
    },
    mounted() {
        this.canvasEventAdd();
    }
}
</script>

<style scoped>
.custom-icon { width: 12px; margin-top: -3px; color: white; }
.btn-secondary{ background-color: tomato; border-color: tomato; }

#ysliderPart{ margin-left: 40px; }

#container{ margin-left: 0px; display: flex; }

#classColor{ height: 24px; }

#firstLabel{ color: blue; }
#textdisplay{ margin-top: 15px; }
#checkbtn{ font-size: 12px; margin-top: 0px; margin-left: 15px; height: 33px; }
#selectbtn{ font-size: 12px; margin-left: 1px; height: 33px; }
#deselectbtn{ font-size: 12px; height: 33px; }
#table{ height: 200px; overflow-x: hidden; overflow-y: scroll; }

#startinput{ width: 20%; display: inline; margin-left: 5px; }
#endinput{ width: 20%; display: inline; margin-left: 5px; }

#coillenthlayout{ display: block; margin-bottom: 20px; }
#endtext{ margin-left: 10px; }

#partLabel{ margin-right: 5px; }
#coilsearch{ width: 80px; height: 33px; margin-left: 0px; } /* 99px */
#partselectbtn{ font-size: 12px; margin-top: 0px; margin-left:0px; height: 33px; background-color: orange; border-color: orange; color: white; }
#partdeselectbtn{ font-size: 12px; margin-top: 0px; height: 33px; background-color: orange; border-color: orange; color: white; }
</style>
