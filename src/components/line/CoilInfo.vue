<template>
<div>
    <table class="table table-bordered table-hover" style="margin-top: -3px; text-align: center; font-size: 14px; font-family: Arial;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0; width: 88px;">품명</th>
                <th style="padding: 5px; margin: 0;">용도</th>
                <th style="padding: 5px; margin: 0; width: 98px;">강종</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">{{PRDN_CD}}</td>
                <td style="padding: 5px; margin: 0;">{{USG_CD}}</td>
                <td style="padding: 5px; margin: 0;">{{MQC}}</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-bordered table-hover" style="margin-top: -10px; text-align: center; font-size: 14px; font-family: Arial;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0;">길이(모재)</th>
                <th style="padding: 5px; margin: 0;">주문 폭</th>
                <th style="padding: 5px; margin: 0;">주문 두께</th>
                <th style="padding: 5px; margin: 0;">주문 도금량</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">{{PAR_COIL_ACT_LTH}}</td>
                <td style="padding: 5px; margin: 0;">{{ORD_WTH}}</td>
                <td style="padding: 5px; margin: 0;">{{ORD_THK}}</td>
                <td style="padding: 5px; margin: 0;">{{GW_FRN}}</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-bordered table-hover" style="margin-top: -10px; text-align: center; font-family: Arial;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0;">고객사</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">{{CUS_NM}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    methods: {
        // 코일정보의 용도 항목 format
        isNumber: function(s) {
            s += ''; // 문자열로 변환
            s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
            if (s == '' || isNaN(s)) return false;
            return true;
        },
    },
    computed: {
        PRDN_CD: function() {
            if(this.$store.state.currentCoil.PRDN_CD == null) {
                return '　'
            } else {
                switch(this.$store.state.currentCoil.PRDN_CD)
                {
                    case 'CC':
                        return 'CR';
                    case 'GG':
                        return 'GA';
                    case 'GI':
                        return 'GI';
                    case 'GN':
                        return 'EG';
                    case 'GE':
                        return 'EG';                           
                    case 'CP':
                        return 'PO';
                    case 'CF':
                        return 'FH';
                    default:
                        if (this.$store.state.currentCoil.PRDN_CD.substr(0,1) == 'L')
                            return 'Color'
                        else
                            return '기타';
                }
            }
        },
        USG_CD: function() {
            if(this.$store.state.currentCoil.USG_CD == null) {
                return '　'
            } else {
                switch(this.$store.state.currentCoil.USG_CD)
                {
                    case 'X02':
                        return this.$store.state.currentCoil.USG_CD + '_더미재';
                    case 'AB0':
                        return this.$store.state.currentCoil.USG_CD + '_외판';
                    case 'EE5S':
                        return this.$store.state.currentCoil.USG_CD + '_외판';
                    default:
                        var head = this.$store.state.currentCoil.USG_CD.substr(0,2);
                        if (head == 'AA'|| head == 'BA')
                            return this.$store.state.currentCoil.USG_CD + '_외판'
                        else
                        {
                            if (head.substr(0,1) == 'A' && this.isNumber(head.substr(1,1)))
                                return this.$store.state.currentCoil.USG_CD + '_외판'
                            else
                                return this.$store.state.currentCoil.USG_CD + '_일반';
                        }                                    
                }
            }
        },
        MQC: function() {
            if(this.$store.state.currentCoil.MQC == null) {
                return '　'
            } else {
                return this.$store.state.currentCoil.MQC
            }
        },
        PAR_COIL_ACT_LTH: function() {
            if(this.$store.state.currentCoil.PAR_COIL_ACT_LTH == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.currentCoil.PAR_COIL_ACT_LTH).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        ORD_WTH: function() {
            if(this.$store.state.currentCoil.ORD_WTH == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.currentCoil.ORD_WTH).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        ORD_THK: function() {
            if(this.$store.state.currentCoil.ORD_THK == null) {
                return '　'
            } else {
                return this.$store.state.currentCoil.ORD_THK.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        GW_FRN: function() {
            if(this.$store.state.currentCoil.GW_FRN == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.currentCoil.GW_FRN).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        CUS_NM: function() {
            if(this.$store.state.currentCoil.CUS_NM == null) {
                return '　'
            } else {
                return this.$store.state.currentCoil.CUS_NM
            }
        },
    }
}
</script>

<style scoped>
div{ font-size: 12px; }
</style>
