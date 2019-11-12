<template>
<div>
    <div style="width: 260px; height: 460px;">
        <canvas ref="device">
            <img ref="image"/>
        </canvas>
        <div v-if="this.$store.state.defectImage1 == null" style="text-align:center; width: 300px; height: 450px;">
            <img src="@/assets/NoImg.png" style="margin-left: -40px;" v-bind:style="{'margin-top': margintop}"/>
        </div>
    </div>
    <b-btn id="downloadbtn" @click="downloadBtn" :disabled="btndisabled" v-b-tooltip title="다운로드">
        <custom-icon name="download" base-class="custom-icon"></custom-icon>
    </b-btn>
    <b-button id="eyebtn" :variant="eyeCss" :disabled="btndisabled" @click="roiShow" v-bind:style="{'background-color': backcolor, 'border-color': bordercolor}" v-b-tooltip title="ROI">
        <img src="@/assets/eye.png" id="iconEye">
    </b-button>
</div>
</template>

<script>
import customIcon from 'vue-icon/lib/vue-feather.esm'
import saveAs from 'file-saver'
import toBlob from 'canvas-toBlob'

export default {
    components: { customIcon, saveAs, toBlob },
    data() {
        return {
            roiflag:true,
            eyeCss: 'danger',
            backcolor: '#dc3545',
            bordercolor: '#dc3545',
            margintop: '0px',
            // 줌인/이동 변수
            translatePos: {
                x: 0,
                y: 0
            },                
            scale: 1.0,
            scaleMultiplier: 0.9,
            startDragOffset: {
                x: 0,
                y: 0                
            },
            mouseDown: false,   
        }
    },
    methods: {
        // 이미지 다운로드
        downloadBtn() {
            // 캔바스
            var canvas = this.$refs.device;

            var chartName = this.$store.state.chartName;
            canvas.toBlob(function(blob) {
                saveAs(blob, chartName + "_결함.jpg");
            });
        },
        // 이미지 관련
        canvasImage: function(){
            // 캔바스
            var canvas = this.$refs.device;

            canvas.addEventListener("mousedown", this.handleMouseDown, false);
            canvas.addEventListener("mousemove", this.handleMouseMove, false);
            canvas.addEventListener("mouseup", this.handleMouseUp, false);
            canvas.addEventListener("mousewheel", this.handleMouseWheel, false);
            canvas.addEventListener("DOMMouseScroll", this.handleMouseWheel, false);
        },
        // 이미지 그리기
        handleDraw(scale, translatePos, flag){
            var data = this.$store.state.coildefect1;
            if (data == null) return;
            if(this.$store.state.defectImage1 == null) {
                // 캔바스
                var canvas = this.$refs.device;
                var ctx = canvas.getContext('2d');
                // 캔바스 초기화
                ctx.clearRect(0,0,canvas.width,canvas.height);
                this.margintop = '-480px';
                return;
            }
            var alt = data.Side + ": " + data.Class + " (" + data.DefectNumber.toString() + ")";
            var src = "data:image/png;base64," + this.$store.state.defectImage1;

            // 캔바스
            var canvas = this.$refs.device;
            var ctx = canvas.getContext('2d');
            
            // 이미지
            var img = this.$refs.image;
            img.src = src;
            img.alt = alt;

            var imgWidth = 0;
            var imgHeight = 0;
            var ax = 0;
            var ay = 0;
            var aw = 0;
            var ah = 0;
            var pad = 0;

            this.$nextTick(() => {
                // 캔버스 크기 지정
                canvas.width = 260;
                canvas.height = 450;

                // 이미지 크기 비교
                aw = canvas.width / img.width;
                ah = canvas.height / img.height;

                if (aw > ah){
                    pad = ah;
                }
                else {
                    pad = aw;
                }
                imgWidth = img.width * pad;
                imgHeight = img.height * pad;
                ax = (canvas.width - imgWidth) / 2;
                ay = (canvas.height - imgHeight) / 2;

                // 캔바스 초기화
                ctx.clearRect(0,0,canvas.width,canvas.height);

                // ROI
                var x = (data.RoiX0) * pad + ax;
                var y = (data.RoiY0) * pad + ay;
                var w = (data.RoiX1 - data.RoiX0) * pad;
                var h = (data.RoiY1 - data.RoiY0) * pad;

                // 2019-03-20 최원영 수정 (이미지 노이즈 현상 때문에 수정함)
                // 180도 ROI
                var nx = 0;
                var ny = 0;
                if(data.Rotate == 180) {
                    nx = (imgWidth + ax) - (x+w) + ax;
                    ny = (imgHeight + ay) - (y+h) + ay;
                    x = nx;
                    y = ny;
                }

                // 캔버스 그리기
                ctx.save();
                ctx.setTransform(1,0,0,1,0,0);
                ctx.scale(scale, scale);
                ctx.translate(translatePos.x/scale, translatePos.y/scale);
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, ax, ay, imgWidth, imgHeight);

                if (flag)
                {
                    ctx.strokeStyle = 'red';
                    ctx.strokeRect(x,y,w,h);
                }
                ctx.restore(); 
                
                // 이미지 타이틀
                ctx.font = "14px Arial";
                ctx.fillText(alt,0,20);

                // 이미지 사이즈
                var size = "결함크기: " + this.WidthSize + "mm x " + this.HeightSize + "mm";
                ctx.fillText(size, 0, 40);

                // 이미지 배율
                var info = "배율:" + Math.round(scale * pad * 100) + "%";
                ctx.fillText(info,190,20);
            });
        },
        // 이미지 크기 초기화, 이미지 이동 시작
        handleMouseDown: function (event) {
            if (event.ctrlKey){
                this.scale = 1;
                this.translatePos.x = 0;
                this.translatePos.y = 0;
                this.handleDraw(this.scale, this.translatePos, this.roiflag);
            }
            else{
                this.mouseDown = true;
                this.startDragOffset.x = (event.clientX - this.translatePos.x);
                this.startDragOffset.y = (event.clientY - this.translatePos.y);                 
            }
        },
        // 이미지 이동 멈춤
        handleMouseUp: function (event) {
            this.mouseDown = false;
        },
        // 마우스 휠로 이미지 크기 조절
        handleMouseWheel: function (event) {
            if (event.wheelDelta > 0) {                
                // 줌인
                this.scale /= this.scaleMultiplier;
            }
            else {
                // 줌아웃
                this.scale *= this.scaleMultiplier;
            }
            console.log(this.scale);
            this.handleDraw(this.scale, this.translatePos, this.roiflag);
        },
        // 이미지 이동
        handleMouseMove: function (event){
            if (this.mouseDown) {
                this.translatePos.x = (event.clientX - this.startDragOffset.x);
                this.translatePos.y = (event.clientY - this.startDragOffset.y);
                this.handleDraw(this.scale, this.translatePos, this.roiflag);
            }
        },
        // 'roi' 버튼 클릭
        roiShow(){
            this.roiflag = !this.roiflag;

            this.handleDraw(this.scale, this.translatePos, this.roiflag);

            this.eyeStyle();
        },
        // 'roi' 버튼 클릭시 버튼 배경색 변환
        eyeStyle() {
            if(this.roiflag) {
                this.eyeCss = 'danger';
                this.backcolor = '#dc3545';
                this.bordercolor = '#dc3545';
            } else {
                this.eyeCss = '';
                this.backcolor = 'gray';
                this.bordercolor = 'gray';
            }
        }
    },
    computed: {
        imgsrc: function() {
            return this.$store.state.defectImage1
        },
        btndisabled: function() {
            return this.$store.state.detailbtnclick1
        },
        HeightSize: function() {
            if(this.$store.state.coildefect1.HeightSize == null) {
                return '　'
            } else {
                return this.$store.state.coildefect1.HeightSize.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        WidthSize: function() {
            if(this.$store.state.coildefect1.WidthSize == null) {
                return '　'
            } else {
                return this.$store.state.coildefect1.WidthSize.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
    },
    watch:{
        imgsrc: function(val){
            this.canvasImage();
            this.scale = 1;
            this.translatePos.x = 0;
            this.translatePos.y = 0;
            this.handleDraw(this.scale, this.translatePos, this.roiflag);
        }
    }
}
</script>

<style scpoed>
.custom-icon { width: 15px; margin-top: -3px; }

#downloadbtn{ padding-top: 1px; height: 32px; }
#iconEye{ width: 20px; margin: 5px; }
#eyebtn{ padding: 0; }

#parentimg{ cursor: pointer; }
</style>
