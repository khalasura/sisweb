<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{width, height, backgroundColor}">
        <div :id="windowId + '-' + 'header'" class="vue-window-modal-header">
            <h6>{{title}}</h6>
            <img src="@/assets/close.png" id="icon" @click="$emit('clickClose', data)">
            <img src="@/assets/mini.png" id="iconMini" @click="$emit('clickMini', data)">
            <img src="@/assets/eye.png" id="iconEyes" @click="roiShow">            
        </div>
        <div class="window-body">
            <slot name="default"></slot>
            <b-card no-body>
            <b-tabs card>
                <b-tab title="이미지" active>
                    <canvas id="popimg" ref="device" width="420" height="240">
                        <img ref="image"/>
                    </canvas>
                </b-tab>
                <b-tab title="상세정보">
                    <b-card >
                    <ul id="detailUl">
                        <li v-for="(value, key) in data" :key="key">{{ key }}: {{ value}}</li>
                    </ul>
                    </b-card>                    
                </b-tab>
            </b-tabs>
            </b-card>            
            <viewer @inited="inited" :options="options" class="viewer" ref="viewer" style="visibility:hidden">
                <img ref="image"/>
            </viewer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'vue-window-modal',
    data() {
        return {
            windowId: (function(){
                const one = Math.floor((Math.random() * 1000000) + 1) + ''
                const two = Math.floor((Math.random() * 1000000) + 1) + ''
                const three = Math.floor((Math.random() * 1000000) + 1) + ''
                return  one + two + three
            })(),
            fields: [
                { key: 'CoilNo', label: '코일번호' },
                { key: 'Class', label: '클래스명' },
                { key: 'Width', label: '너비', formatter: (value) => { return Math.round(value) } },
                { key: 'Height', label: '길이', formatter: (value) => { return Math.round(value) } },
            ],
            roiflag: true,
            options:{
                movable: true,
                toolbar: {
                    zoomIn:1, zoomOut:1, reset:1, oneToOne:1, play:1, rotateLeft:1, rotateRight:1, flipHorizontal:1, flipVertical:1
                },
                navbar: false          
            },
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
    props: {
        active: Boolean,
        title: String,
        width: {
            type: String,
            default: '465px'
        },
        height: {
            type: String,
            default: '380px'
        },
        backgroundColor: {
            type: String,
            default: '#f2f2f2'
        },
        image: String,
        data: Object,
        el: Object,
    },
    methods: {
        // 이미지 뷰어
        inited(viewer){
            this.$viewer = viewer
        },
        // roi 보이기/안보이기
        roiShow(){
            this.roiflag = !this.roiflag;
            this.handleDraw(this.scale, this.translatePos, this.roiflag);
        },
        // 이미지 관련
        canvasImage: function(){              
            // 이미지
            var img = this.$refs.image;
            img.src = this.image;
            img.alt = this.title;
            
            // 캔바스
            var canvas = this.$refs.device;

            //img.addEventListener("load", this.handleDraw(this.scale, this.translatePos, this.roiflag),false);  
            this.handleDraw(this.scale, this.translatePos, this.roiflag);
            canvas.addEventListener("dblclick", this.handleDblClick, false);
            canvas.addEventListener("mousedown", this.handleMouseDown, false);
            canvas.addEventListener("mousemove", this.handleMouseMove, false);
            canvas.addEventListener("mouseup", this.handleMouseUp, false);
            canvas.addEventListener("mousewheel", this.handleMouseWheel, false);
            canvas.addEventListener("DOMMouseScroll", this.handleMouseWheel, false);
        },
        // 이미지 그리기
        handleDraw(scale, translatePos, flag){
            // 캔바스
            var canvas = this.$refs.device;
            var ctx = canvas.getContext('2d');
            
            // 이미지
            var img = this.$refs.image;

            var imgWidth = 0;
            var imgHeight = 0;
            var ax = 0;
            var ay = 0;
            var aw = 0;
            var ah = 0;
            var pad = 0;

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

            // ROI
            var x = (this.data.RoiX0) * pad + ax;
            var y = (this.data.RoiY0) * pad + ay;
            var w = (this.data.RoiX1 - this.data.RoiX0) * pad;
            var h = (this.data.RoiY1 - this.data.RoiY0) * pad;

            // 2019-03-20 최원영 수정 (이미지 노이즈 현상 때문에 수정함)
            // 180도 ROI
            var nx = 0;
            var ny = 0;
            if(this.data.Rotate == 180) {
                nx = (imgWidth + ax) - (x+w) + ax;
                ny = (imgHeight + ay) - (y+h) + ay;
                x = nx;
                y = ny;
            }

            // 캔바스 초기화
            ctx.clearRect(0,0,canvas.width,canvas.height);

            // 그리기
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
                this.startDragOffset.x = event.clientX - this.translatePos.x;
                this.startDragOffset.y = event.clientY - this.translatePos.y;                    
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
            this.handleDraw(this.scale, this.translatePos, this.roiflag);
        },
        // 이미지 더블클릭 - 이미지뷰어 실행
        handleDblClick: function (event){
            this.$viewer.show();
            setTimeout(this.rotate, 1000);
        },
        // 이미지 이동
        handleMouseMove: function (event){
            if (this.mouseDown) {
                this.translatePos.x = event.clientX - this.startDragOffset.x;
                this.translatePos.y = event.clientY - this.startDragOffset.y;
                this.handleDraw(this.scale, this.translatePos, this.roiflag);
            }                
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
        this.dragElement()
        this.getThisWindowAndHeaderElements().window.addEventListener('click', () => {
            this.sendWindowToHighest()
        })
        this.getThisWindowAndHeaderElements().window.style.zIndex = 1000
        if (this.active)
        {
            this.canvasImage()
            this.show()
            this.sendWindowToHighest()
            this.centerWindow()
        }
    },
    computed: {
        items: function() {
            return [{ CoilNo: this.data.CoilNo, Class: this.data.Class, Width: this.data.WidthSize, Height: this.data.HeightSize }]
        }
    },
    created: function() {
        window.addEventListener('keydown', (e) => {
            if(e.key == 'b') {
                this.roiShow()
            }
        })
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

#detailUl {height: 188px; overflow-y: scroll; margin-left: -15px; }
</style>