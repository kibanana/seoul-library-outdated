window.onload = function() {
    handleRefresh();
}
function handleRefresh() {
	console.log("here");
	
	var url = "http://openapi.seoul.go.kr:8088/5865466b776b79773633685a426759/xml/SeoulLibraryTimeInfo/1/30/";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        updateLibrary(this);
	    }
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function showMap(location, x, y) {
	var mapContainer = document.getElementById(location), // 지도를 표시할 div 
    mapOption = { 
        center: new daum.maps.LatLng(x, y), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
	var map = new daum.maps.Map(mapContainer, mapOption); 
	
	// 마커가 표시될 위치입니다 
	var markerPosition  = new daum.maps.LatLng(33.450701, 126.570667); 

	// 마커를 생성합니다
	var marker = new daum.maps.Marker({
	    position: markerPosition
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);
}

function updateLibrary(xml) {
	var xmlDoc = xml.responseXML;
	var librariesDiv = document.getElementById("libraries");
	libraries = xmlDoc.getElementsByTagName("row");
	
	for (var i = 0; i < libraries.length; i++) {
		
		var row = libraries[i];
		
		var value1 = row.getElementsByTagName("CODE_VALUE")[0].childNodes[0];
		var value2 = row.getElementsByTagName("ADRES")[0].childNodes[0];
		var value3 = row.getElementsByTagName("FDRM_CLOSE_DATE")[0].childNodes[0];
		var value4 = row.getElementsByTagName("TEL_NO")[0].childNodes[0];
		
		/*if(value1){ //'구' 단위로 작은탭을 적용하기 위한 제어문 
			if(gu==value1.nodeValue) {
				
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
		
		
		title.innerHTML = "No. "+ row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue + " -\n"
		 + row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue + "\n";
		
		var str = "";
		
		if(value1){
			str = str + " 구명: "+ value1.nodeValue + "\n"
		}
		if(value2){
			str = str + " 주소: "+ value2.nodeValue + "\n"
		}
		if(value3){
			str = str + " 정기 휴관일: "+ value3.nodeValue + "\n"
		}
		if(value4) {
			str = str + " 전화번호:"+ value4.nodeValue + "\n";
		}
		
		sub.innerHTML = str;
		
		librariesDiv.appendChild(div);
		div.appendChild(title);
		div.appendChild(sub);
		div.appendChild(mapDiv);
	}
}