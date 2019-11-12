<template>
<div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="criticalpathname" value="1CGL" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label id="leftLabel">1CGL</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="criticalpathname" value="CAL" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>CAL</label>
        </div>
    </div><br>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="criticalpathname" value="2CGL" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label id="leftLabel">2CGL</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="criticalpathname" value="EGL" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>EGL</label>
        </div>
    </div><br>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="criticalpathname" value="3CGL" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label id="leftLabel">3CGL</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="criticalpathname" value="PL" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>PL</label>
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
            return this.$store.state.btnSelected1
        }
    },
    watch: {
        checkName: function() {
            this.$store.state.criticalpathItem = [];
            this.$store.state.criticalpathItem = this.checkName;
        },
        trendType: function(val) {
            if(val != 1) {
                this.checked = true;
                this.checkName[0] = '1CGL';
                this.checkName[1] = '2CGL';
                this.checkName[2] = '3CGL';
                this.checkName[3] = 'CAL';
                this.checkName[4] = 'EGL';
                this.checkName[5] = 'PL';
                this.$store.state.criticalpathItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.criticalpathItem = this.checkName;
            }
        },
        btnSelect: function(val) {
            if(val) {
                this.checked = true;
                this.checkName[0] = '1CGL';
                this.checkName[1] = '2CGL';
                this.checkName[2] = '3CGL';
                this.checkName[3] = 'CAL';
                this.checkName[4] = 'EGL';
                this.checkName[5] = 'PL';
                this.$store.state.criticalpathItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.criticalpathItem = this.checkName;
            }
        }
    }
}
</script>

<style scoped>
.pretty{ margin-right: 20px; }
/* .pretty { margin-left: 0px; margin-top: 7px; }
.pretty input { left: 170px; width: 0; }
.pretty .state label:after, .pretty .state label:before { left: 170px; }
.pretty input[disabled]~* { opacity:inherit; }
.pretty .state label{ width: 80px; } */
</style>
