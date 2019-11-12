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
                <th style="padding: 5px; margin: 0; width: 100px;">결함 면적(mm²)</th>
                <th style="padding: 5px; margin: 0; width: 100px;">길이(ROI)</th>
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
                <th style="padding: 5px; margin: 0; width: 100px;">롤 다이아</th>
                <th style="padding: 5px; margin: 0; width: 100px;">센터기준 길이정보</th>
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
                <td style="padding: 5px; margin: 0;">
                    <label v-if="reverse2 == true" style="margin-bottom: 3px;">
                        ↓{{BoxBottom}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↑{{DistanceFromStart}}
                    </label>
                    <label v-if="reverse2 == false" style="margin-bottom: 3px;">
                        ↓{{DistanceFromStart}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↑{{BoxBottom}}
                    </label>
                </td>
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
            if(this.$store.state.coildefect2.DefectNumber == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.DefectNumber
            }
        },
        Side: function() {
            if(this.$store.state.coildefect2.Side == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.Side
            }
        },
        Class: function() {
            if(this.$store.state.coildefect2.Class == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.Class
            }
        },
        RepeatLength: function() {
            if(this.$store.state.coildefect2.RepeatLength == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.RepeatLength.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DistanceFromStart: function() {
            if(this.$store.state.coildefect2.DistanceFromStart == null) {
                return '　'
            } else {
                return (this.$store.state.coildefect2.DistanceFromStart / 1000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        BoxBottom: function() {
            if(this.$store.state.coildefect2.DistanceFromStart == null) {
                return '　'
            } else {
                var sis = (this.$store.state.line2.length / 1000).toFixed(1);
                var roi = (this.$store.state.coildefect2.HeightSize / 1000).toFixed(1);
                var box = (this.$store.state.coildefect2.DistanceFromStart / 1000).toFixed(1);
                var count = sis - roi - box;
                return count.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DistanceLeftEdge: function() {
            if(this.$store.state.coildefect2.DistanceLeftEdge == null) {
                return '　'
            } else {
                return (this.$store.state.coildefect2.DistanceLeftEdge).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DistanceRightEdge: function() {
            if(this.$store.state.coildefect2.DistanceRightEdge == null) {
                return '　'
            } else {
                return (this.$store.state.coildefect2.DistanceRightEdge).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        DefectArea: function() {
            if(this.$store.state.coildefect2.DefectArea == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.DefectArea.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        HeightSize: function() {
            if(this.$store.state.coildefect2.HeightSize == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.HeightSize.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        WidthSize: function() {
            if(this.$store.state.coildefect2.WidthSize == null) {
                return '　'
            } else {
                return this.$store.state.coildefect2.WidthSize.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        reverse2: function() {
            return this.$store.state.reverseBtnClick2
        },
        Roll: function() {
            if(this.$store.state.coildefect2.RepeatLength == null) {
                return '　'
            } else {
                return (this.$store.state.coildefect2.RepeatLength / 3.14).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        CenterLength: function() {
            if(this.$store.state.coildefect2.DistanceLeftEdge == null) {
                return '　'
            } else {
                var defect = this.$store.state.coildefect2;
                
                // 전체 코일 폭 절반
                var totalLength = ((defect.DistanceLeftEdge + defect.DistanceRightEdge + defect.WidthSize) /2).toFixed(0);

                if(defect.DistanceLeftEdge < totalLength) {
                    return '←' + (totalLength - defect.DistanceLeftEdge).toFixed(0);
                } else {
                    return '→' + (defect.DistanceLeftEdge - totalLength).toFixed(0);
                }
            }
        }
    }
}
</script>

<style scoped>
div{ font-size: 12px; margin-left: -14px; margin-right: -6px; text-align: center; font-family: Arial; }

.table-responsive{ width: 95%; margin-left: 12px; margin-top: -5px; padding: 0; overflow-x: hidden; text-align: center; }

#title{ font-weight: bold; color: blue; }
#dataSide, #data2, #data3, #data4, #data5, #data6{ margin-left: 6px; }
</style>
