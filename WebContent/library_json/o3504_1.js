window.onload = function() {
	handleRefresh();
}


//localStorage 사용하는 방법
 
function changeIndex(){
	localStorage.start_library = document.getElementById("start_library_index").value;
	localStorage.end_library = document.getElementById("end_library_index").value;
	location.href = location.href;
}

function changeGu(){
	const gu_name = document.getElementById("gu_select").value;
	localStorage.gu_selected = gu_name;
	
	if(gu_name==='강남구') {
		localStorage.start_library = 1;
		localStorage.end_library = 54;
	} else if(gu_name==='강동구') {
		localStorage.start_library = 55;
		localStorage.end_library = 105;
	} else if(gu_name==='강북구') {
		localStorage.start_library = 106;
		localStorage.end_library = 158;
	} else if(gu_name==='강서구') {
		localStorage.start_library = 159;
		localStorage.end_library = 239;
	} else if(gu_name==='관악구') {
		localStorage.start_library = 240;
		localStorage.end_library = 294;
	} else if(gu_name==='광진구') {
		localStorage.start_library = 295;
		localStorage.end_library = 331;
	} else if(gu_name==='구로구') {
		localStorage.start_library = 332;
		localStorage.end_library = 412;
	} else if(gu_name==='금천구') {
		localStorage.start_library = 413;
		localStorage.end_library = 437;
	} else if(gu_name==='노원구') {
		localStorage.start_library = 438;
		localStorage.end_library = 483;
	} else if(gu_name==='도봉구') {
		localStorage.start_library = 484;
		localStorage.end_library = 527;
	} else if(gu_name==='동대문구') {
		localStorage.start_library = 528;
		localStorage.end_library = 569;
	} else if(gu_name==='동작구') {
		localStorage.start_library = 570;
		localStorage.end_library = 621;
	} else if(gu_name==='마포구') {
		localStorage.start_library = 622;
		localStorage.end_library = 675;
	} else if(gu_name==='서대문구') {
		localStorage.start_library = 676;
		localStorage.end_library = 710;
	} else if(gu_name==='성동구') {
		localStorage.start_library = 780;
		localStorage.end_library = 813;
	} else if(gu_name==='성북구') {
		localStorage.start_library = 814;
		localStorage.end_library = 881;
	} else if(gu_name==='서초구') {
		localStorage.start_library = 711;
		localStorage.end_library = 779
	} else if(gu_name==='송파구') {
		localStorage.start_library = 882;
		localStorage.end_library = 962;
	} else if(gu_name==='영등포구') {
		localStorage.start_library = 1;
		localStorage.end_library = 54;
	} else if(gu_name==='용산구') {
		localStorage.start_library = 1;
		localStorage.end_library = 54;
	} else if(gu_name==='양천구') {
		localStorage.start_library = 963;
		localStorage.end_library = 1012;
	} else if(gu_name==='은평구') {
		localStorage.start_library = 1125;
		localStorage.end_library = 1222;
	} else if(gu_name==='종로구') {
		localStorage.start_library = 1223;
		localStorage.end_library = 1272;
	} else if(gu_name==='중구') {
		localStorage.start_library = 1273;
		localStorage.end_library = 1316;
	} else if(gu_name==='중랑구') {
		localStorage.start_library = 1315;
		localStorage.end_library = 1366;
	} 
	
	location.href = location.href;
}

function handleRefresh() {

	const gu_name = localStorage.gu_selected;
	
	if(!localStorage.start_library) {
		changeIndex();
	} else {
		document.getElementById("start_library_index").value = localStorage.start_library;
		document.getElementById("end_library_index").value = localStorage.end_library - localStorage.start_library + 1;
	}
	
	if(!localStorage.gu_selected) {
		changeGu();
	} else {
		document.getElementById("select_gu_span").innerHTML = localStorage.gu_selected + "가 선택되었습니다";
		var gu_s = document.getElementById("gu_select");
		for(var i = 0; i< gu_s.options.length; i++) {
		  if(gu_name == gu_s.options[i].value) {
			  gu_s.options[i].setAttribute('selected', 'selected');
		  }
		}
	}

	var url = "http://openapi.seoul.go.kr:8088/5865466b776b79773633685a426759/json/SeoulLibraryTimeInfo/" + localStorage.start_library + "/" + (parseInt(localStorage.start_library) + parseInt(localStorage.end_library) -1) + "/";
	$.getJSON(url, updateLibrary);
}

function showMap(mapContainer, x, y) {
	
	var mapOption = { 
        center: new daum.maps.LatLng(x, y), // 지도의 중심좌표
        level: 4 // 지도의 확대 레벨
    };

	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
	var map = new daum.maps.Map(mapContainer, mapOption); 
	
	// 마커가 표시될 위치입니다 
	var markerPosition  = new daum.maps.LatLng(x, y); 

	// 마커를 생성합니다
	var marker = new daum.maps.Marker({
	    position: markerPosition
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);
	
}

function updateLibrary(libraries) {
	var librariesDiv = document.getElementById("libraries");
	
	var max = parseInt(libraries.SeoulLibraryTimeInfo.list_total_count);
	document.getElementById("end_library_index").setAttribute("max", max);
	
	libraries = libraries.SeoulLibraryTimeInfo.row;
	
	var selected = localStorage.gu_selected;

	for (var i = 0; i < libraries.length; i++) {
		//Total 탭
		var library = libraries[i];
		
		var value1 = library.CODE_VALUE;
		var value2 = library.ADRES;
		var value3 = library.FDRM_CLOSE_DATE;
		var value4 = library.TEL_NO;
		
		var div = document.createElement("div");
		div.setAttribute("class", "library");
		var title = document.createElement("span");
		title.setAttribute("class", "title");
		var sub = document.createElement("span");
		sub.setAttribute("class", "sub");
		
		var mapDiv = document.createElement("div");
		mapDiv.setAttribute("class", "map");
		mapDiv.setAttribute("id", "map"+i);
		
		title.innerHTML = "No. "+library.LBRRY_SEQ_NO + " " +library.LBRRY_NAME + "<pre>\n</pre>";
		
		var str = "";
		
		if(value1){
			str = str + " 구명: "+ value1 + "<pre>\n</pre>";
			
		}
		if(value2){
			str = str + " 주소: "+ value2 + "<pre>\n</pre>"
		}
		if(value3){
			str = str + " 정기 휴관일: "+ value3 + "<pre>\n</pre>"
		}
		if(value4) {
			str = str + " 전화번호: "+ value4 + "<pre>\n</pre>";
		}
		
		sub.innerHTML = str;
		
		librariesDiv.appendChild(div);
		div.appendChild(title);
		div.appendChild(sub);
		
		//mapUrl, gumapLink는 이름만 같이씀
		var mapUrl = "https://www.google.com/maps/search/?api=1&query=" + library.XCNTS + ", " + library.YDNTS;
		
		var gumapLink = document.createElement("a");
		gumapLink.setAttribute("href", mapUrl);
		
		div.appendChild(gumapLink);
		gumapLink.appendChild(mapDiv);
		
		showMap(mapDiv, library.XCNTS, library.YDNTS);
	}
}

/*function todayIs() {
	var url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=2019&solMonth=05&serviceKey=KMJB89UDUGqIngamgEo%2FeX2gZ7jXWCelws8wKi2zu6YyobgX%2FzmU77OBCMmabTY4Ont3JDeDWHoNQrcAWf3UcQ%3D%3D";
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		todayResult(this);
	    }
	};
	xhr.open("GET", encodeURI(url), true);
	xhr.send();
}

function todayResult(result) {
	result = xmlDoc.getElementsByTagName("item");
	var resultStr  = '';
	var innerToday = 5; //today에서 Date만 뽑아냄
	
	console.log("innerToday: " + innerToday);
	for (var i = 0; i < result.length; i++) {
		
		var singleResult = result[i];
		
		if(singleResult.isHoliday==="Y"){
			var singleDay = singleResult.locdate; // ex) 20190505
			if(innerToday == singleDay.substring(6, 8)) {
				resultStr = singleResult.dateName;
			}
			
		} //if문
	} //for문
	
	if(resultStr) {
		resultStr = "오늘은 " + resultStr + "로, 공휴일입니다";
	} else {
		resultStr = "오늘은 공휴일이 아닙니다";
	}
	
	var todayResult = document.createElement("span");
	todayResult.setAttribute("class", "sub");
	todayResult.innerHTML = resultStr
	
	var div = document.getElementById("today");
	div.appendChild(todayResult);
	
}

function monthIs() {
	var url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=" + year + "&solMonth=" + month + "&serviceKey=KMJB89UDUGqIngamgEo%2FeX2gZ7jXWCelws8wKi2zu6YyobgX%2FzmU77OBCMmabTY4Ont3JDeDWHoNQrcAWf3UcQ%3D%3D";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	monthResult(this);
	    }
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function monthResult(result) {
	
}
*/