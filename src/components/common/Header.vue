<template>
<div>
    <b-navbar toggleable type="dark" variant="info" style="height: 50px;">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand style="font-size: 17px;">현대제철 순천공장 SIS 데이터 서버 Web ver.
                                                <div style="font-size: 15.5px;">(S-SID, Suncheon-Surface Inspection Data server)</div>
        </b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav id="navitem">
                <b-nav-item :active="viewerActive" @click="goViewer('Viewer')" id="item1">Viewer</b-nav-item>
                <b-nav-item :active="lineActive" @click="goViewer('Line')" id="item1">Line</b-nav-item>
                <b-nav-item :active="analyzerActive" @click="goViewer('Analyzer')" id="item1">Analyzer</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-navbar-nav>
                    <b-nav-item @click="dlDefectCode">결함코드</b-nav-item>     
                    <b-nav-item @click="logout">{{user.name}} Logout</b-nav-item>
                </b-navbar-nav>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</div>
</template>

<script>
export default {
    methods: {
        // 다른 화면 이동(viewer, line, analyzer)
        goViewer(view){
            this.$router.push({name : view});
            // 다른 화면으로 이동할 경우 페이지를 새로고침하는 역할(store데이터... 같은것 초기화)
            window.location.reload(true);
        },
        // 로그아웃
        logout(){
            this.$session.destroy();
            this.$router.push('/');
        },
        // 결함코드
        dlDefectCode(){
            window.open('http://siss.hyundai-steel.com/file/DefectCode.pdf');
        }
    },
    computed: {
        viewerActive: function() {
            return this.$store.state.viewerActive
        },
        lineActive: function() {
            return this.$store.state.lineActive
        },
        analyzerActive: function() {
            return this.$store.state.analyzerActive
        },
        user: function() {
            return this.$session.get('user')
        }
    }
}
</script>

<style scoped>
.bg-info{ background-color: #223344 !important; }

#navitem{ margin-left: 100px; }
#item1{ margin-right: 30px; }
</style>
