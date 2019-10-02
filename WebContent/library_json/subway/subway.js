var map;
var km = 100;//기준값
var km2 = 0; //나의 좌표와 traffic.json안에 있는 역들과의 거리를 저장
var number;  // 가장 가까운 역 호선 저장
var station; // 가장 가까운 역이름 저장
var memory;  // 중간기억장소(가장 가까운 역의 첨자위치를 저장)
var test;    // 가장 가까운 역의 코드 저장
var LL;      // 가장 가까운 역의 x, y 좌표 저장
var time = 1;// 상행선과 하행선을 구별하기 위해 사용
var content1 = ""; //상행선 알림내용
var content2 = ""; //하행선 알림내용

window.onload = getMyLocation;

function getMyLocation() {

	if (navigator.geolocation) {

		//navigator.geolocation.getCurrentPosition(showMap);
		navigator.geolocation.getCurrentPosition(
				showMap, displayError,{enableHighAccuracy:true,maximumAge:60000});
	
	}
	else {
		alert("위치지원이 되지 않습니다.");
	}
}

function displayError(error) {
	var errorTypes = {
		0: "알려지지 않은 에러",
		1: "사용자가 권한 거부",
		2: "위치를 찾을 수 없음",
		3: "요청 응답 시간 초과"
	};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}
function showMap(position) {
	var googleLatAndLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var mapOptions = {
		zoom: 17,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	

	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
   
    var url = "traffic.json";
	var request = new XMLHttpRequest();
	request.open("GET",url);
	request.onload = function(){
		if(request.status == 200){
			var subways = JSON.parse(request.responseText);
			for(var i = 0; i < subways.length; i++){
				var LT = new google.maps.LatLng(subways[i].XPOINT, subways[i].YPOINT);

				var markerOptions = {
					position : LT,
					map : map,
					title : "역",
					icon:"subway.png"
				};
                var marker = new google.maps.Marker(markerOptions);
                /* 전체의 지하철역 그림을 마크로 표시 */
				km2 = computeDistance(position.coords.latitude, position.coords.longitude, subways[i].XPOINT, subways[i].YPOINT);
				if(km2<km){
					memory = i;
					km = km2;
					station = subways[i].STATION_NM;
					number = subways[i].LINE_NUM;

				}
			}
			
			LL = new google.maps.LatLng(subways[memory].XPOINT, subways[memory].YPOINT);
			/* 가장 가까운역의 x, y 좌표 저장 */
			alert("가장 가까운 역은 " + station + "역 입니다. (" + number +"호선)");



			test = subways[memory].STATION_CD; // 가장 가까운 역의 코드가 저장된 상태
			handleRefresh();

		}
	};
	request.send(null);
    var title = "현재 위치";
	var content = "당신의 현재 위치입니다.";
	addMarker(map, googleLatAndLong, title, content, "no");//나의 위치 표시
	/*googleLatAndLong 에는 현대위치를 저장*/
}

function handleRefresh() {
    console.log("here");
    var url = "http://openapi.seoul.go.kr:8088/644d42625173756e35354e6d636d63/json/SearchArrivalInfoByIDService/1/2/"+test+"/1/3/"
    $.getJSON(url + "?callback=", updateTraffic);
//    $.getJSON(url + "?callback=", updateSubway);
	var url = "http://openapi.seoul.go.kr:8088/644d42625173756e35354e6d636d63/json/SearchArrivalInfoByIDService/1/2/"+test+"/2/3/"
	$.getJSON(url + "?callback=", updateTraffic);
	//  1/2/는 최근 데이타(최근시간) OPEN API를 제공하고 있음
}

function updateTraffic(subways) {
	var traffic = subways.SearchArrivalInfoByIDService.row;
	if(time==1){//처음에 time==1
		for(var i = 0; i < traffic.length; i++){
			content1 += "상행 도착 시간 : " + traffic[i].ARRIVETIME + "<br>상행 종점 : " + traffic[i].SUBWAYNAME + "<br><br>";
			//가장가까운 좌표의 역을 가르치는 첨자
		}
	}
	if(time==2){
		for(var i = 0; i < traffic.length; i++){

			if(i == 0){
				content2 = "<br><br>" + content1 + "하행 도착 시간 : " + traffic[i].ARRIVETIME + "<br>하행 종점 : " + traffic[i].SUBWAYNAME + "<br><br>";
			}
			else{
				content2 += "하행 도착 시간 : " + traffic[i].ARRIVETIME + "<br>하행 종점 : " + traffic[i].SUBWAYNAME;

			}
		}
		addMarker(map, LL, "지하철", content2, "yes");// 상하행선의 내용을 가지고 addMarker을 호출
	}
	time=2;
	/*addMarker(map, LL, "지하철", content2, "yes");*/
}


function addMarker(map, latlong, title, content, iconcheck){
	if(iconcheck == "no"){
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};

	var marker = new google.maps.Marker(markerOptions);
	var infoWindowOptions = {
	content: content,
	position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    
	infoWindow.open(map);

	google.maps.event.addListener(marker, "click", function(){
		
		infoWindow.open(map);
	});
	}
	if(iconcheck == "yes"){
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		icon: "subway.png",
		clickable: true
	};

	var marker = new google.maps.Marker(markerOptions);
	var infoWindowOptions = {
	content: content,
	position: latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    
	infoWindow.open(map);
	

	google.maps.event.addListener(marker, "click", function(){
		infoWindow.open(map);
	});
	}
}

function computeDistance(stlatitude, stlongitude, dtlatitude, dtlongitude) {
	var startLatRads = degreesToRadians(stlatitude);
	var startLongRads = degreesToRadians(stlongitude);
	var destLatRads = degreesToRadians(dtlatitude);
	var destLongRads = degreesToRadians(dtlongitude);

	var Radius = 6371; 
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
					Math.cos(startLatRads) * Math.cos(destLatRads) *
					Math.cos(startLongRads - destLongRads)) * Radius;

	return distance;
}

function degreesToRadians(degrees) {
	radians = (degrees * Math.PI)/180;
	return radians;
}

