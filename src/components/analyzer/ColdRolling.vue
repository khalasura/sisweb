<template>
<div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="coldrollingname" value="순천" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>순천</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="coldrollingname" value="1냉연" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>1냉연</label>
        </div>
    </div>
    <div class="pretty p-default p-curve p-pulse">
        <input type="checkbox" name="coldrollingname" value="2냉연" v-model="checkName" :indeterminate.sync="checked"/>
        <div class="state p-primary-o">
            <label>2냉연</label>
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
            return this.$store.state.btnSelected2
        }
    },
    watch: {
        checkName: function() {
            this.$store.state.coldrollingItem = [];
            this.$store.state.coldrollingItem = this.checkName;
        },
        trendType: function(val) {
            if(val != 2) {
                this.checked = true;
                this.checkName[0] = '순천';
                this.checkName[1] = '1냉연';
                this.checkName[2] = '2냉연';
                this.$store.state.coldrollingItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.coldrollingItem = this.checkName;
            }
        },
        btnSelect: function(val) {
            if(val) {
                this.checked = true;
                this.checkName[0] = '순천';
                this.checkName[1] = '1냉연';
                this.checkName[2] = '2냉연';
                this.$store.state.coldrollingItem = this.checkName;
            } else {
                this.checked = false;
                this.checkName = [];
                this.$store.state.coldrollingItem = this.checkName;
            }
        }
    }
}
</script>

<style scoped>
.pretty{ margin-right: 3px; }
</style>
