<template>
<div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="yeonjuname" value="CCM1(1연주)" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>CCM1(1연주)</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="yeonjuname" value="CCM2(1연주)" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>CCM2(1연주)</label>
        </div>
    </div><br>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="yeonjuname" value="CCM3(1연주)" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>CCM3(1연주)</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="yeonjuname" value="CCM4(2연주)" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>CCM4(2연주)</label>
        </div>
    </div><br>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="yeonjuname" value="CCM5(2연주)" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>CCM5(2연주)</label>
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
            return this.$store.state.btnSelected4
        }
    },
    watch: {
        checkName: function() {
            this.$store.state.yeonjuItem = [];
            this.$store.state.yeonjuItem = this.checkName;
        },
        trendType: function(val) {
            if(val != 4) {
                this.checked = true;
                this.checkName[0] = 'CCM1(1연주)';
                this.checkName[1] = 'CCM2(1연주)';
                this.checkName[2] = 'CCM3(1연주)';
                this.checkName[3] = 'CCM4(2연주)';
                this.checkName[4] = 'CCM5(2연주)';
                this.$store.state.yeonjuItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.yeonjuItem = this.checkName;
            }
        },
        btnSelect: function(val) {
            if(val) {
                this.checked = true;
                this.checkName[0] = 'CCM1(1연주)';
                this.checkName[1] = 'CCM2(1연주)';
                this.checkName[2] = 'CCM3(1연주)';
                this.checkName[3] = 'CCM4(2연주)';
                this.checkName[4] = 'CCM5(2연주)';
                this.$store.state.yeonjuItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.yeonjuItem = this.checkName;
            }
        }
    }
}
</script>

<style scoped>
.pretty{ margin-right: 0px; }
</style>
