<template>
<div>
    <!-- Header !-->
    <Header>
        <nav class="navbar navbar-default" id="headercolor">
            <div class="navbar-header">
                <p class="title">현대제철 순천공장 SIS 데이터 서버 Web ver. <br>(S-SID, Suncheon-Surface Inspection Data server)</p>
            </div>
        </nav>
    </Header>

    <div class="mainHeader">
        <div class="col-md-1">
            <div id="circle">
                <custom-icon name="log-in" base-class="custom-icon"></custom-icon>
            </div>
        </div>
        <div class="col-md-8">
            <p class="textPtag">LOGIN TO ACCESS</p>
            <p>로그인하여 접속해주세요.</p>
        </div>
    </div>

    <!-- body -->
    <div class="mainBody">
        <br><br><br><br><br>
        <form class="form-signin" @submit.prevent="validateBeforeSubmit">
        <p class="loginTitle">USERNAME</p>
        <input type="text" id="inputID" v-model="ID" class="form-control" placeholder="Username" required autofocus style="ime-mode: disabled;">
        <br>
        <p class="loginTitle">Password</p>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" v-model="Password" class="form-control" placeholder="Password" required>
        <!-- <div class="checkbox mb-3">
            <label>
            <input type="checkbox" value="remember-me"> Remember me
            </label>
        </div> -->
        <button class="btn btn-lg btn-primary btn-block" type="submit" style="margin-top: 40px;">Sign in</button>
        </form>
        <div id="menualDiv">
            <b-button id="menual" variant="success" @click="download">사용자메뉴얼</b-button>
        </div>
    </div>

    <!-- footer !-->
    <div class="mainFooter" id="footer">
        <div class="container">
            <span> COPYRIGHT(C) HYUNDAI STEEL. ALL RIGHTS RESERVED.</span>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span id="footerspan">전라남도 순천시 해룡면 인덕로 300</span>
            <span>전화번호: 061-720-4114 / FAX: 061-723-5256</span>
        </div>
    </div>

    <!-- bubble image !-->
    <ul class="bubble-boxes">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</div>
</template>

<script>
import axios from 'axios'
import customIcon from 'vue-icon/lib/vue-feather.esm'

export default {
    components: { customIcon },
    data: () => ({
        ID: '',
        Password: ''
    }),
    methods: {
        // 로그인 연결
        validateBeforeSubmit () {
            axios.get(this.$store.state.baseURL + '/api/user', {params:{ID: this.ID} }).
            then((response) => {
                if (response.data != null) {
                    if (response.data.Password == this.Password) {
                        var user = {name: response.data.Name, id: response.data.ID, class: response.data.Class}
                        this.$session.start();
                        this.$session.set('user', user);
                        this.$router.push('/Viewer');
                    } else {
                        this.Password = ''
                        this.$swal({
                            type: 'error',
                            title: 'Error',
                            text: 'Password를 잘못 입력했습니다.'
                        })
                    }
                } else {
                    this.ID = ''
                    this.Password = ''
                    this.$swal({
                        type: 'error',
                        title: 'Error',
                        text: this.ID + '는(은) 등록되지 않은 아이디 입니다.'
                    })
                }
            }).catch((ex)=>{console.log("ERROR!!!: ", ex);})
        },
        // 사용자 메뉴얼
        download() {
            window.open('http://siss.hyundai-steel.com/file/SISWebManual.pdf');
        }
    }
}
</script>

<style scoped>
.navbar-default{ margin-bottom: 0px; border: 0; }
.navbar-brand{ margin-right: 150px; }
.title{ font-size: 18px; color: white; margin-top: 3%; margin-left: 17px; }

.mainHeader{ height: 200px; display: flex; }
.glyphicon{ font-size: 50px; margin-left: 27px; margin-top: 23px; color: white}
.logintext{ margin-left: 100px; margin-bottom: 100px; }
.textPtag{ font-size: 28px; margin-top: 60px; font-weight:bold; }

.mainBody{ height: 500px; background-color: rgba(199, 194, 194, 0.527); }
.loginTitle{ font-weight: bold; }

.container{ margin-top: 100px; }

#footer{ margin-top: 40px; height: 40px; }
#footerspan{ margin-right: 100px; }

#headercolor{ background-color: #223344; }
#circle{ width: 100px; height: 100px; border-radius: 100px; background-color: rgb(255, 187, 0); margin-top: 50px; margin-left: 30%; }
#lock{ border: 1px solid black; width: 100px; height: 100px; border-radius: 100em; position: relative; }
.custom-icon { width: 80px; margin-top: 0px; margin-left: 5px; color: white; -webkit-margin-before: 10px; }

#menualDiv{ float: right; margin-top: 20px; margin-right: 10px; }
#menual{ font-size: 13px; }

/* .input[type=text] { 
-webkit-ime-mode: disable; 
-moz-ime-mode:disable; 
-ms-ime-mode:disable; 
ime-mode:disable;
}  */

/* 로그인 폼 */
.form-signin {
  width: 100%;
  max-width: 450px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* 버블 애니메이션 */
.bubble-boxes{
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 40%;
}
.bubble-boxes li{
position: absolute;
list-style: none;
display: flex;
width: 20px;
height: 20px;
background: rgba(152, 204, 252, 0.2);
animation: animate 25s linear infinite;
bottom: -800px;
}
.bubble-boxes li:nth-child(1){
left: 25%;
width: 80px;
height: 80px;
animation-delay: 0;
}
.bubble-boxes li:nth-child(2){
left: 10%;
width: 20px;
height: 20px;
animation-delay: 2s;
animation-duration: 12s;
}
.bubble-boxes li:nth-child(3){
left: 70%;
width: 20px;
height: 20px;
animation-delay: 4s;
}
.bubble-boxes li:nth-child(4){
left: 40%;
width: 60px;
height: 60px;
animation-delay: 0s;
animation-duration: 18s;
}
.bubble-boxes li:nth-child(5){
left: 65%;
width: 20px;
height: 20px;
animation-delay: 0s;
}
.bubble-boxes li:nth-child(6){
left: 75%;
width: 110px;
height: 110px;
animation-delay: 3s;
}
.bubble-boxes li:nth-child(7){
left: 35%;
width: 150px;
height: 150px;
animation-delay: 7s;
}
.bubble-boxes li:nth-child(8){
left: 50%;
width: 25px;
height: 25px;
animation-delay: 15s;
animation-duration: 45s;
}
.bubble-boxes li:nth-child(9){
left: 20%;
width: 15px;
height: 15px;
animation-delay: 2s;
animation-duration: 35s;
}
.bubble-boxes li:nth-child(10){
left: 85%;
width: 150px;
height: 150px;
animation-delay: 0s;
animation-duration: 12s;
}
@keyframes animate{
0%{
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
}
100%{
    transform: translateY(-1000px) rotate(720deg);
    opacity: 1;
    border-radius: 50%;
}
}
</style>
