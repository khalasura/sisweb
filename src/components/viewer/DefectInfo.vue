<template>
<div>
    <table class="table table-bordered table-hover" style="margin-top: 3px;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0;">결함번호</th>
                <th style="padding: 5px; margin: 0;">Side</th>
                <th style="padding: 5px; margin: 0;">클래스</th>
                <th style="padding: 5px; margin: 0;">반복주기(mm)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">{{DefectNumber}}</td>
                <td style="padding: 5px; margin: 0;">{{Side}}</td>
                <td style="padding: 5px; margin: 0;">{{Class}}</td>
                <td style="padding: 5px; margin: 0;">{{RepeatLength}}</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-bordered table-hover" style="margin-top: -10px;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0; width: 120px;">결함 면적(mm²)</th>
                <th style="padding: 5px; margin: 0; width: 115px;">길이(ROI)</th>
                <th style="padding: 5px; margin: 0;">폭(ROI)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">{{DefectArea}}</td>
                <td style="padding: 5px; margin: 0;">{{HeightSize}}</td>
                <td style="padding: 5px; margin: 0;">{{WidthSize}}</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-bordered table-hover" style="margin-top: -10px;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0; width: 160px;">롤 다이아</th>
                <th style="padding: 5px; margin: 0;">센터기준 길이정보</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">{{Roll}}</td>
                <td style="padding: 5px; margin: 0;">{{CenterLength}}</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-bordered table-hover" style="margin-top: -10px;">
        <thead>
            <tr style="background-color: rgb(246, 248, 251);">
                <th style="padding: 5px; margin: 0;">길이 방향 위치(m)</th>
                <th style="padding: 5px; margin: 0;">폭 방향 위치(mm)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 5px; margin: 0;">↓{{DistanceFromStart}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↑{{BoxBottom}}</td>
                <td style="padding: 5px; margin: 0;">→{{DistanceLeftEdge}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;←{{DistanceRightEdge}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    computed: {
        DefectNumber: function() {
            if(this.$store.state.coildefect.DefectNumber == null) {
                return '　'
            } else {
                return this.$store.state.coildefect.DefectNumber
            }
        },
        Side: function() {
            if(this.$store.state.coildefect.Side == null) {
                return '　'
            } else {
                return this.$store.state.coildefect.Side
            }
        },
        Class: function() {
            if(this.$store.state.coildefect.Class == null) {
                return '　'
            } else {
                return this.$store.state.coildefect.Class
            }
        },
        RepeatLength: function() {
            if(this.$store.state.coildefect.RepeatLength == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.coildefect.RepeatLength).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DistanceFromStart: function() {
            if(this.$store.state.coildefect.DistanceFromStart == null) {
                return '　'
            } else {
                return (this.$store.state.coildefect.DistanceFromStart / 1000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        BoxBottom: function() {
            if(this.$store.state.clickEl == null) {
                return '　'
            } else {
                var sis = (this.$store.state.chartName.SISCoilLength / 1000).toFixed(1);
                var roi = (this.$store.state.coildefect.HeightSize / 1000).toFixed(1);
                var box = (this.$store.state.clickEl.el.y).toFixed(1);
                var count = sis - roi - box;
                return count.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DistanceLeftEdge: function() {
            if(this.$store.state.coildefect.DistanceLeftEdge == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.coildefect.DistanceLeftEdge).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DistanceRightEdge: function() {
            if(this.$store.state.coildefect.DistanceRightEdge == null) {
                return '　'
            } else {
                return Math.round(this.$store.state.coildefect.DistanceRightEdge).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DefectArea: function() {
            if(this.$store.state.coildefect.DefectArea == null) {
                return '　'
            } else {
                return this.$store.state.coildefect.DefectArea.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        HeightSize: function() {
            if(this.$store.state.coildefect.HeightSize == null) {
                return '　'
            } else {
                return this.$store.state.coildefect.HeightSize.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        WidthSize: function() {
            if(this.$store.state.coildefect.WidthSize == null) {
                return '　'
            } else {
                return this.$store.state.coildefect.WidthSize.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        Roll: function() {
            if(this.$store.state.coildefect.RepeatLength == null) {
                return '　'
            } else {
                return (this.$store.state.coildefect.RepeatLength / 3.14).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        CenterLength: function() {
            if(this.$store.state.coildefect.DistanceLeftEdge == null) {
                return '　'
            } else {
                var defect = this.$store.state.coildefect;
                var xArea = defect.DistanceLeftEdge;
                
                // 전체 코일 폭 절반
                var totalLength = ((xArea + defect.DistanceRightEdge + defect.WidthSize) /2).toFixed(0);

                if(xArea < totalLength) {
                    return '←' + (totalLength - xArea).toFixed(0);
                } else {
                    return '→' + (xArea - totalLength).toFixed(0);
                }
            }
        },
    }
}
</script>

<style scoped>
div{ font-size: 14px; font-family: Arial; margin-left: -14px; margin-right: -6px; text-align: center; }

.table-responsive{ width: 95%; margin-left: 12px; margin-top: -5px; padding: 0; overflow-x: hidden; text-align: center; }

#title{ font-weight: bold; color: blue; }
#dataSide, #data2, #data3, #data4, #data5, #data6{ margin-left: 6px; }
</style>
