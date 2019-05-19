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
	
	var url = "http://openapi.seoul.go.kr:8088/5865466b776b79773633685a426759/xml/SeoulLibraryTimeInfo/" + localStorage.start_library + "/" + (parseInt(localStorage.start_library) + parseInt(localStorage.end_library) -1) + "/";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        updateLibrary(this);
	    }
	};
	xhttp.open("GET", url, true);
	xhttp.send();
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

function updateLibrary(xml) {

	var xmlDoc = xml.responseXML;
	var librariesDiv = document.getElementById("libraries");
	libraries = xmlDoc.getElementsByTagName("row");

	var max = parseInt(xmlDoc.getElementsByTagName("list_total_count")[0].childNodes[0].nodeValue);
	document.getElementById("end_library_index").setAttribute("max", 1365);

	var guDiv = document.getElementById("gu");
	
	var selected = localStorage.gu_selected;
	
	for (var i = 0; i < libraries.length; i++) {
		
		var row = libraries[i];
		
		var value1 = row.getElementsByTagName("CODE_VALUE")[0].childNodes[0];
		var value2 = row.getElementsByTagName("ADRES")[0].childNodes[0];
		var value3 = row.getElementsByTagName("FDRM_CLOSE_DATE")[0].childNodes[0];
		var value4 = row.getElementsByTagName("TEL_NO")[0].childNodes[0];
		
		var div = document.createElement("div");
		div.setAttribute("class", "library");
		var title = document.createElement("span");
		title.setAttribute("class", "title");
		var sub = document.createElement("span");
		sub.setAttribute("class", "sub");
		
		var mapDiv = document.createElement("div");
		mapDiv.setAttribute("class", "map");
		
		title.innerHTML = "No. "+ row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue + " "
		 + row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue + "<pre>\n</pre>";
		
		var str = "";
		
		if(value1){
			str = str + " 구명: "+ value1.nodeValue + "<pre>\n</pre>";

			//Gu탭 처리 과정 끼워넣음
			if(selected==value1.nodeValue){

				var singleGu = document.createElement("div");
				singleGu.setAttribute("class", "library");
				var guTitle = document.createElement("span");
				guTitle.setAttribute("class", "title");
				var guSub = document.createElement("span");
				guSub.setAttribute("class", "sub");
				
				guTitle.innerHTML = "No. "+ row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue + " "
				 + row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue + "<pre>\n</pre>";
				
				var guStr = "";
				
				if(value2){
					guStr = guStr + " 주소: "+ value2.nodeValue + "<pre>\n</pre>"
				}
				if(value3){
					guStr = guStr + " 정기 휴관일: "+ value3.nodeValue + "<pre>\n</pre>"
				}
				if(value4) {
					guStr = guStr + " 전화번호: "+ value4.nodeValue + "<pre>\n</pre>";
				}
				
				guSub.innerHTML = guStr;
				
				var gumapDiv = document.createElement("div");
				gumapDiv.setAttribute("class", "map");
				gumapDiv.setAttribute("id", "map"+i);
				
				guDiv.appendChild(singleGu);
				
				singleGu.appendChild(guTitle);
				singleGu.appendChild(guSub);
				singleGu.appendChild(gumapDiv);
				
				showMap(gumapDiv, row.getElementsByTagName("XCNTS")[0].childNodes[0].nodeValue, row.getElementsByTagName("YDNTS")[0].childNodes[0].nodeValue);

			}
		}
		if(value2){
			str = str + " 주소: "+ value2.nodeValue + "<pre>\n</pre>"
		}
		if(value3){
			str = str + " 정기 휴관일: "+ value3.nodeValue + "<pre>\n</pre>"
		}
		if(value4) {
			str = str + " 전화번호: "+ value4.nodeValue + "<pre>\n</pre>";
		}
		
		sub.innerHTML = str;
		
		librariesDiv.appendChild(div);
		div.appendChild(title);
		div.appendChild(sub);
		div.appendChild(mapDiv);
		
		showMap(mapDiv, row.getElementsByTagName("XCNTS")[0].childNodes[0].nodeValue, row.getElementsByTagName("YDNTS")[0].childNodes[0].nodeValue);
	}
}