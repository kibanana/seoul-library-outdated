window.onload = function() {
    handleRefresh();
}
function handleRefresh() {
	console.log("here");
	
	var url = "http://openapi.seoul.go.kr:8088/5865466b776b79773633685a426759/json/SeoulLibraryTimeInfo/1/30/";
	$.getJSON(url, updateLibrary);
}

function showMap(mapContainer, x, y) {
	
	console.log(x + " " + y + "" + location); 
	
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
	libraries = libraries.SeoulLibraryTimeInfo.row;

	for (var i = 0; i < libraries.length; i++) {
		
		var library = libraries[i];
		
		var value1 = library.CODE_VALUE;
		var value2 = library.ADRES;
		var value3 = library.FDRM_CLOSE_DATE;
		var value4 = library.TEL_NO;
		
		/*if(value1){ //'구' 단위로 작은탭을 적용하기 위한 제어문 
			if(gu==value1) {
				
			} else {
				
			}
		}*/
		
		var div = document.createElement("div");
		div.setAttribute("class", "library");
		var title = document.createElement("span");
		title.setAttribute("class", "title");
		var sub = document.createElement("span");
		sub.setAttribute("class", "sub");
		
		var mapDiv = document.createElement("div");
		mapDiv.setAttribute("class", "map");
		mapDiv.setAttribute("id", "map"+i);
		
		title.innerHTML = "No. "+library.LBRRY_SEQ_NO + "<pre>\n</pre>" +library.LBRRY_NAME + "<pre>\n</pre>";
		
		var str = "";
		
		if(value1){
			str = str + " 구명: "+ value1 + "<pre>\n</pre>"
		}
		if(value2){
			str = str + " 주소: "+ value2 + "<pre>\n</pre>"
		}
		if(value3){
			str = str + " 정기 휴관일: "+ value3 + "<pre>\n</pre>"
		}
		if(value4) {
			str = str + " 전화번호:"+ value4 + "<pre>\n</pre>";
		}
		
		sub.innerHTML = str;
		
		librariesDiv.appendChild(div);
		div.appendChild(title);
		div.appendChild(sub);
		div.appendChild(mapDiv);

		showMap(mapDiv, library.XCNTS, library.YDNTS);
	}

}

