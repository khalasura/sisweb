<template>
<div>
    <b-progress height= "30px" class="mt-1" :max="items.length" show-value v-if="items.length > 0">
        <b-progress-bar v-for="item in items" :value=1 :variant="item.color" v-b-tooltip.hover :title="item.title" :key="item.name">{{item.name}}</b-progress-bar>
    </b-progress>
</div>
</template>

<script>
export default {
    data () {
        return {
            items: []
        }
    },
    methods:{
        // 통과공정 데이터 색상으로 변환
        getColor(val){
            switch(val)
            {
                case 'T':
                    return 'success';
                case 'K':
                    return 'warning';
                case 'G':
                    return 'danger';
                case 'E':
                    return 'info';
                case 'R':
                    return 'primary';
                case 'A':
                    return 'dark';                    
                default:
                    return 'secondary';
            }
        },
        // 통과공정 데이터 text로 변환
        getTitle(val){
            switch(val)
            {
                case 'T':
                    return 'PCM';
                case 'K':
                    return 'CAL';
                case 'G':
                    return 'CGL';
                case 'E':
                    return 'EGL';
                case 'R':
                    return 'RCL';
                default:
                    return 'UNKNOWN';
            }
        },
    },
    computed: {
        coil: function(){
            return this.$store.state.currentCoil;
        },
        yeonju: function() {
            if(this.$store.state.yeonjuName == null) return;

            var text = this.$store.state.yeonjuName.split('(');
            return text[0];
        },
        hot: function() {
            if(this.$store.state.hotName == null) return;

            return this.$store.state.hotName;
        }
    },
    watch:{
        yeonju: function(value){
            // 통과공정 변수 초기화
            this.items = [];

            if (value == null) return;

            // 현재 코일값 가져오기
            var val = this.$store.state.currentCoil;
            var cc = val.CC_MC_CD;
            var hr = val.HR_PLNT_GP;
            var act = val.ACT_PAS_PROC;
            
            // 연주
            if (cc != null)
                this.items.push({name:cc, color:this.getColor('A'), title:this.yeonju});
            // 열연
            if (hr != null)
                this.items.push({name:hr, color:this.getColor('B'), title:this.hot});
            // 주공정
            if(act != null)
            {
                for(var i = 0; i < act.length; i = i+2) {
                    var name = act.substring(i, i+2);
                    var value = name.substring(0,1);
                    var num = name.substring(1,2);
                    var color = this.getColor(value);
                    //var title = this.getTitle(val) + num;
                    var title = this.$store.state.coldName;
                    var subStr = title.substr(title.length - 1);
                    if(subStr.match(/[^a-zA-Z]/) == null) {
                        title = title.slice(0, -1);
                    }
                    this.items.push({name:name, color:color, title:title});
                }
            }
        },
        coil: function(val) {
            // 초기화
            this.items = [];
            this.$store.state.yeonjuName = null;
            this.$store.state.yeonjuName = null;
        }
    }
}
</script>

<style scoped>

</style>
