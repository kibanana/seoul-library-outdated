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
	localStorage.gu_selected = document.getElementById("gu_select").value;
	location.href = location.href;
}

function handleRefresh() {

	if(!localStorage.start_library) {
		changeIndex();
	} else {
		document.getElementById("start_library_index").value = localStorage.start_library;
		document.getElementById("end_library_index").value = localStorage.end_library;
	}
	
	if(!localStorage.gu_selected) {
		changeGu();
	} else {
		document.getElementById("select_gu_span").innerHTML = localStorage.gu_selected;
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
	var guDiv = document.getElementById("gu");
	
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
			
			//Gu탭 처리 과정 끼워넣음
			if(selected==value1){
				var singleGu = document.createElement("div");
				singleGu.setAttribute("class", "library");
				var guTitle = document.createElement("span");
				guTitle.setAttribute("class", "title");
				var guSub = document.createElement("span");
				guSub.setAttribute("class", "sub");
				
				guTitle.innerHTML = "No. "+library.LBRRY_SEQ_NO + " " +library.LBRRY_NAME + "<pre>\n</pre>";
				
				var guStr = "";
				
				if(value2){
					guStr = guStr + " 주소: "+ value2 + "<pre>\n</pre>"
				}
				if(value3){
					guStr = guStr + " 정기 휴관일: "+ value3 + "<pre>\n</pre>"
				}
				if(value4) {
					guStr = guStr + " 전화번호: "+ value4 + "<pre>\n</pre>";
				}
				
				guSub.innerHTML = guStr;
				
				var gumapDiv = document.createElement("div");
				gumapDiv.setAttribute("class", "map");
				gumapDiv.setAttribute("id", "map"+i);
				
				guDiv.appendChild(singleGu);
				
				singleGu.appendChild(guTitle);
				singleGu.appendChild(guSub);
				singleGu.appendChild(gumapDiv);
				
				showMap(gumapDiv, library.XCNTS, library.YDNTS);
				
			}
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
		div.appendChild(mapDiv);

		showMap(mapDiv, library.XCNTS, library.YDNTS);
		
	}
}

function todayIs() {
	var today = new Date();
	var url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=2019&solMonth=05&serviceKey=KMJB89UDUGqIngamgEo%2FeX2gZ7jXWCelws8wKi2zu6YyobgX%2FzmU77OBCMmabTY4Ont3JDeDWHoNQrcAWf3UcQ%3D%3D";
	
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	todayResult(this);
    	localStorage.ssibal = 150;
	    }
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function todayResult(result) {
	
	result = result.response.body.items.item;
	var resultStr  = '';
	const innerToday = 20; //today에서 Date만 뽑아냄
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