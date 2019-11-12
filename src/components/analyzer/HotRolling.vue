<template>
<div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="hotrollingname" value="1열연" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>1열연</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="hotrollingname" value="박판" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>박판</label>
        </div>
    </div><br>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="hotrollingname" value="2열연" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>2열연</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="hotrollingname" value="외부소재" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>외부소재</label>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            checkName: [],
            checked: false
        }
    },
    computed: {
        trendType: function() {
            return this.$store.state.trendType
        },
        btnSelect: function() {
            return this.$store.state.btnSelected3
        }
    },
    watch: {
        checkName: function() {
            this.$store.state.hotrollingItem = [];
            this.$store.state.hotrollingItem = this.checkName;
        },
        trendType: function(val) {
            if(val != 3) {
                this.checked = true;
                this.checkName[0] = '1열연';
                this.checkName[1] = '2열연';
                this.checkName[2] = '박판';
                this.checkName[3] = '외부소재';
                this.$store.state.hotrollingItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.hotrollingItem = this.checkName;
            }
        },
        btnSelect: function(val) {
            if(val) {
                this.checked = true;
                this.checkName[0] = '1열연';
                this.checkName[1] = '2열연';
                this.checkName[2] = '박판';
                this.checkName[3] = '외부소재';
                this.$store.state.hotrollingItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.hotrollingItem = this.checkName;
            }
        }
    }
}
</script>

<style scoped>
.pretty{ margin-right: 20px; }
</style>
