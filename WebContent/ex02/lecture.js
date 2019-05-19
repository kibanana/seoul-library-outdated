window.onload = function() {
    var interval = setInterval(handleRefresh, 3000);
    handleRefresh();
}
function handleRefresh() {
	console.log("here");
	
	var url = "http://openapi.seoul.go.kr:8088/644d42625173756e35354e6d636d63/json/GwanakClassLectureList/1/30/";
	$.getJSON(url, updatelecture);
}	
/*var url = "http://openapi.seoul.go.kr:8088/644d42625173756e35354e6d636d63/json/CardSubwayStatsNew/1/100/20180101/";
$.getJSON(url, updateTraffic);	*/

function updatelecture(lectures) {
	var lecturesDiv = document.getElementById("lectures");
	lectures = lectures.GwanakClassLectureList.row;

	
	for (var i = 0; i < lectures.length; i++) {
		var lecture = lectures[i];
		var div = document.createElement("div");
		div.setAttribute("class", "lecture");
/*		1   TITLE	강좌명
		2	EDU_PERIOD	교육기간
		3	EDU_PLACE	교육장소
		4	EDU_TARGET	교육대상
		5	APPLY_WAY	접수방법
		6	EDU_PAY	수강료
		7	APPLY_PERIOD	접수기간*/
		div.innerHTML = "강좌명:"+lecture.TITLE + "은 "
		 +" 교육기간:"+lecture.EDU_PERIOD + " "
		 +" 교육장소:"+lecture.EDU_PLACE + " "
		 +" 교육대상:"+lecture.EDU_TARGET + " "
		 +" 접수방법:"+lecture.APPLY_WAY + " "
		 +" 수강료:"+lecture.EDU_PAY + "원입니다 ";

			lecturesDiv.appendChild(div);
	}

}

