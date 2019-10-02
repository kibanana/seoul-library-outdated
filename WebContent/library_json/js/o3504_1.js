window.onload = function() {
	handleRefresh();
}

//localStorage 사용하는 방법
 
function changeIndex(){
	localStorage.start_library = document.getElementById("start_library_index").value;
	localStorage.end_library = document.getElementById("end_library_index").value;
	
	localStorage.select = 'total';
	
	location.href = location.href;
}

function ifSearch(){
	console.log(document.getElementById("searchTarget").value=="name");
	if(document.getElementById("searchTarget").value=="name") {
		setTimeout(function() {
			searchName();
		}, 3000);
	} else {
		searchAddress();
	}
}

function searchAddress(){
	localStorage.search_address = document.getElementById("lib_name").value;
	
	localStorage.start_library = 1;
	localStorage.end_library = Math.ceil(document.getElementById("end_library_index").getAttribute("max")/2);
	console.log(document.getElementById("end_library_index").getAttribute("max"));
	location.href = location.href;
}

function searchName(){
	localStorage.search_name = document.getElementById("lib_name").value;
	
	localStorage.start_library = 1;
	localStorage.end_library = Math.ceil(document.getElementById("end_library_index").getAttribute("max")/2);
	console.log(document.getElementById("end_library_index").getAttribute("max"));
	location.href = location.href;
}

function changeGu(){
	const gu_name = document.getElementById("gu_select").value;
	localStorage.gu_selected = gu_name;
	
	localStorage.select = 'gu';
	
	if(gu_name==='강남구') {
		localStorage.start_library = 1;
		localStorage.end_library = 53;
	} else if(gu_name==='강동구') {
		localStorage.start_library = 54;
		localStorage.end_library = 104;
	} else if(gu_name==='강북구') {
		localStorage.start_library = 105;
		localStorage.end_library = 157;
	} else if(gu_name==='강서구') {
		localStorage.start_library = 158;
		localStorage.end_library = 239;
	} else if(gu_name==='관악구') {
		localStorage.start_library = 240;
		localStorage.end_library = 293;
	} else if(gu_name==='광진구') {
		localStorage.start_library = 294;
		localStorage.end_library = 330;
	} else if(gu_name==='구로구') {
		localStorage.start_library = 331;
		localStorage.end_library = 411;
	} else if(gu_name==='금천구') {
		localStorage.start_library = 412;
		localStorage.end_library = 436;
	} else if(gu_name==='노원구') {
		localStorage.start_library = 437;
		localStorage.end_library = 482;
	} else if(gu_name==='도봉구') {
		localStorage.start_library = 483;
		localStorage.end_library = 526;
	} else if(gu_name==='동대문구') {
		localStorage.start_library = 527;
		localStorage.end_library = 568;
	} else if(gu_name==='동작구') {
		localStorage.start_library = 569;
		localStorage.end_library = 620;
	} else if(gu_name==='마포구') {
		localStorage.start_library = 621;
		localStorage.end_library = 674;
	} else if(gu_name==='서대문구') {
		localStorage.start_library = 675;
		localStorage.end_library = 709;
	} else if(gu_name==='성동구') {
		localStorage.start_library = 779;
		localStorage.end_library = 812;
	} else if(gu_name==='성북구') {
		localStorage.start_library = 813;
		localStorage.end_library = 880;
	} else if(gu_name==='서초구') {
		localStorage.start_library = 710;
		localStorage.end_library = 778;
	} else if(gu_name==='송파구') {
		localStorage.start_library = 881;
		localStorage.end_library = 962;
	} else if(gu_name==='영등포구') {
		localStorage.start_library = 1013;
		localStorage.end_library = 1068;
	} else if(gu_name==='용산구') {
		localStorage.start_library = 1069;
		localStorage.end_library = 1124;
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
		localStorage.end_library = 1315;
	} else if(gu_name==='중랑구') {
		localStorage.start_library = 1316;
		localStorage.end_library = 1366;
	} 
	
	location.href = location.href;
}

function handleRefresh() {

	const gu_name = localStorage.gu_selected;
	
	if(!localStorage.select || localStorage.select=='total'){
		if(!localStorage.start_library) {
			changeIndex();
		} else {
			document.getElementById("start_library_index").value = localStorage.start_library;
			document.getElementById("end_library_index").value = localStorage.end_library;
		}
	} else {
		if(!localStorage.gu_selected) {
			changeGu();
		} else {
			document.getElementById("start_library_index").value = localStorage.start_library;
			document.getElementById("end_library_index").value = localStorage.end_library;
			
			document.getElementById("select_gu_span").innerHTML = localStorage.gu_selected + "가 선택되었습니다";
			let gu_s = document.getElementById("gu_select");
			for(let i = 0; i< gu_s.options.length; i++) {
			  if(gu_name == gu_s.options[i].value) {
				  gu_s.options[i].setAttribute('selected', 'selected');
				  gu_s.val(gu_s).attr('selected', 'selected'); 
				  gu_s.selectmenu('refresh');	
			  }
			}
		}
	}

	let url = "http://openapi.seoul.go.kr:8088/5865466b776b79773633685a426759/json/SeoulLibraryTimeInfo/" + localStorage.start_library + "/" + localStorage.end_library + "/";
	$.getJSON(url, updateLibrary);
}

function showMap(mapContainer, x, y) {
	
	let mapOption = { 
        center: new daum.maps.LatLng(x, y), // 지도의 중심좌표
        level: 4 // 지도의 확대 레벨
    };

	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
	let map = new daum.maps.Map(mapContainer, mapOption); 
	
	// 마커가 표시될 위치입니다 
	let markerPosition  = new daum.maps.LatLng(x, y); 

	// 마커를 생성합니다
	let marker = new daum.maps.Marker({
	    position: markerPosition
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);
	
}

function updateLibrary(libraries) {
	let librariesDiv = document.getElementById("libraries");
	
	let max = parseInt(libraries.SeoulLibraryTimeInfo.list_total_count);
	document.getElementById("end_library_index").setAttribute("max", max);
	
	libraries = libraries.SeoulLibraryTimeInfo.row;
	
	let selected = localStorage.gu_selected;

	for (let i = 0; i < libraries.length; i++) {
		let library = libraries[i];
		if((localStorage.search_name == '' && localStorage.search_address == '') || (!(localStorage.search_name == '') && library.LBRRY_NAME.indexOf(localStorage.search_name) !== -1) || (!(localStorage.search_address == '') && library.ADRES.indexOf(localStorage.search_address) !== -1)){
				let value1 = library.CODE_VALUE;
				let value2 = library.ADRES;
				let value3 = library.FDRM_CLOSE_DATE;
				let value4 = library.TEL_NO;
				
				let div = document.createElement("div");
				div.setAttribute("class", "library");
				let title = document.createElement("span");
				title.setAttribute("class", "title");
				let sub = document.createElement("span");
				sub.setAttribute("class", "sub");
				
				let mapDiv = document.createElement("div");
				mapDiv.setAttribute("class", "map");
				mapDiv.setAttribute("id", "map"+i);
				
				title.innerHTML = "No. "+library.LBRRY_SEQ_NO + " " +library.LBRRY_NAME + "<pre>\n</pre>";
				
				let str = "";
				
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
				let mapUrl = "https://www.google.com/maps/search/?api=1&query=" + library.XCNTS + ", " + library.YDNTS;
				
				let gumapLink = document.createElement("a");
				gumapLink.setAttribute("href", mapUrl);
				
				div.appendChild(gumapLink);
				gumapLink.appendChild(mapDiv);
				
				showMap(mapDiv, library.XCNTS, library.YDNTS);
		}
	}
	localStorage.search_name = '';
	localStorage.search_address = '';
	localStorage.gu_selected = '';
}

/*function todayIs() {
	let url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=2019&solMonth=05&serviceKey=KMJB89UDUGqIngamgEo%2FeX2gZ7jXWCelws8wKi2zu6YyobgX%2FzmU77OBCMmabTY4Ont3JDeDWHoNQrcAWf3UcQ%3D%3D";
	
	let xhr = new XMLHttpRequest();
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
	let resultStr  = '';
	let innerToday = 5; //today에서 Date만 뽑아냄
	
	console.log("innerToday: " + innerToday);
	for (let i = 0; i < result.length; i++) {
		
		let singleResult = result[i];
		
		if(singleResult.isHoliday==="Y"){
			let singleDay = singleResult.locdate; // ex) 20190505
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
	
	let todayResult = document.createElement("span");
	todayResult.setAttribute("class", "sub");
	todayResult.innerHTML = resultStr
	
	let div = document.getElementById("today");
	div.appendChild(todayResult);
	
}

function monthIs() {
	let url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=" + year + "&solMonth=" + month + "&serviceKey=KMJB89UDUGqIngamgEo%2FeX2gZ7jXWCelws8wKi2zu6YyobgX%2FzmU77OBCMmabTY4Ont3JDeDWHoNQrcAWf3UcQ%3D%3D";

    let xhttp = new XMLHttpRequest();
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