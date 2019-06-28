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
		document.getElementById("end_library_index").value = localStorage.end_library - localStorage.start_library + 1;;
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
		
		var mapUrl = "https://www.google.com/maps/search/?api=1&query=" + row.getElementsByTagName("XCNTS")[0].childNodes[0].nodeValue + ", " + row.getElementsByTagName("YDNTS")[0].childNodes[0].nodeValue;
		
		var gumapLink = document.createElement("a");
		gumapLink.setAttribute("href", mapUrl);
		
		div.appendChild(gumapLink);
		gumapLink.appendChild(mapDiv);
		
		showMap(mapDiv, row.getElementsByTagName("XCNTS")[0].childNodes[0].nodeValue, row.getElementsByTagName("YDNTS")[0].childNodes[0].nodeValue);
	}
}