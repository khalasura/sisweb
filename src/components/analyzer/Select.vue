<template>
<div>
    <div>
        <b-form-group>
            <b-form-radio-group id="radios1" v-model="fillcheck" name="radioOpenions">
                <b-form-radio value="1" tabindex="1">
                    <b-form-select v-model="comboOption" :options="defectOp" id="comboForm" tabindex="2"></b-form-select>
                </b-form-radio>
                <b-form-radio value="2" tabindex="1">결함별 트렌드</b-form-radio>
            </b-form-radio-group>
        </b-form-group>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            fillcheck: 1,
            options: [
                { text: '공정별 트렌드', value: 1 },
                { text: '결함별 트렌드', value: 2 },
            ],
            comboOption: null,
            defectOp: [
                { text: '공정별 트렌드', value: null, disabled: true },
                { text: '주공정별 트렌드', value: 1 },
                { text: '냉간압연별 트렌드', value: 2 },
                { text: '열연별 트렌드', value: 3 },
                { text: '연주별 트렌드', value: 4 }
            ],
        };
    },
    mounted(){
        this.$store.state.trendType = null;
    },
    watch: {
        comboOption: function(val) {
            this.fillcheck = 1;
            this.$store.state.trendType = val;
            // if(this.fillcheck == 1) this.$store.state.trendType = val;
        },
        fillcheck: function(val) {
            // this.$store.state.trendType = null;
            
            if(val == 2) this.$store.state.trendType = 5;
            
            // this.comboOption = null;
        }
    }
}
</script>

<style scoped>
#comboForm{ display: inline-block; height: 35px; margin-bottom: -15px; margin-top: -5px; }
/* #comboForm{ display: inline-block; height: 35px; margin-top: -10px; margin-left: -0px; width: 45%; } */
</style>
