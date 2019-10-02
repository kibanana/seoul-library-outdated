window.onload = initMap;
var map;
var health_Code = null;	
var forecast_Code = null;
var sidoName,AreaNo;

function initMap() {

	var mapContainer = document.getElementById('map'),
		mapOption = {
			center: new daum.maps.LatLng(33.450701, 126.570667),
			level: 11
    };

	map = new daum.maps.Map(mapContainer, mapOption);
    map.setZoomable(false);
 	initControl();
	myLocation();
};

function initControl() {
    var mapTypeControl = new daum.maps.MapTypeControl();

    map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
};


function moveTomyLocation() {
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude,
            lon = position.coords.longitude;
        
        var locPosition = new daum.maps.LatLng(lat, lon),
            message = '<div>현위치</div>';
			
        displayMarker(locPosition, message);
		getmyLocationAddr();  
      });
    } 
}

function MoveTo(a,b) {
    var moveLatLon = new daum.maps.LatLng(a, b);
    map.panTo(moveLatLon);           
}

function myLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude,
                lon = position.coords.longitude;
            
            var locPosition = new daum.maps.LatLng(lat, lon),
                message = '<div>현위치</div>'; 
				
            displayMarker(locPosition, message);
            getmyLocationAddr();  
        });
    } else {
        var locPosition = new daum.maps.LatLng(33.450701, 126.570667),    
            message = 'geolocation을 사용할수 없어요..'
        displayMarker(locPosition, message);
    }
}

function displayMarker(locPosition, message) {

	var imageSrc = 'here.png', 
    imageSize = new daum.maps.Size(64, 69),
    imageOption = {offset: new daum.maps.Point(27, 69)}; 
 
   var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);
   
    var marker = new daum.maps.Marker({  
        map: map, 
        position: locPosition,
        image:markerImage
    }); 
    
    marker.setMap(map); 
    map.setCenter(locPosition);      
}

function getmyLocationAddr() {
	var geocoder = new daum.maps.services.Geocoder();

    searchAddrFromCoords(map.getCenter(), displayCenterInfo);

    function searchAddrFromCoords(coords, callback) {
        geocoder.coord2addr(coords, callback);         
    }

    function displayCenterInfo(status, result) {
        if (status === daum.maps.services.Status.OK) {
            document.getElementById('myloctext').innerHTML =result[0].fullName;
            selectMYLoc(result[0].name1);
        }    
    }
}

function selectLoc(value) {
	var a, b;
	health_Code = null;
	forecast_Code = null;
	sidoName = value;

	switch(value){
		case '서울특별시': health_Code=1100000000;sidoName='서울';  a=37.5636;b=126.98; AreaNo=1100000000;
			break;
		case '부산광역시': health_Code=2600000000; sidoName='부산'; a=35.177;b=129.077; AreaNo=2600000000;
			break;
		case '대구광역시': health_Code=2700000000;sidoName='대구';  a=35.8685;b=128.6036; AreaNo=2700000000;
			break;
		case '인천광역시': health_Code=2800000000;sidoName='인천';  a=37.4532;b=126.7074; AreaNo=2800000000;
			break;
		case '광주광역시': health_Code=2900000000; sidoName='광주'; a=35.157;b=126.8534; AreaNo=2900000000;
			break;
		case '대전광역시': health_Code=3000000000;sidoName='대전';  a=36.3471;b=127.3866; AreaNo=3000000000;
			break;
		case '울산광역시': health_Code=3100000000; sidoName='울산'; a=35.5354;b=129.3137; AreaNo=3100000000;
			break;
		case '경기도': health_Code=4111000000;sidoName='경기';  a=37.2606;b=127.0307; AreaNo=4100000000;
			break;
		case '강원도': health_Code=4211000000;sidoName='강원';  a=37.8785;b=127.7323; AreaNo=4200000000;
			break;
		case '충청북도': health_Code=4311000000;sidoName='충북';  a=36.6396;b=127.4912; AreaNo=4300000000;
			break;
		case '충청남도': health_Code=4413000000;sidoName='충남';  a=36.8121;b=127.1162; AreaNo=4400000000;
			break;
		case '전라북도': health_Code=4511000000;sidoName='전북';  a=35.8215;b=127.15; AreaNo=4500000000;
			break;
		case '전라남도': health_Code=4611000000;sidoName='전남';  a=34.8088;b=126.3944; AreaNo=4600000000;
			break;
		case '경상북도': health_Code=4812100000;sidoName='경북';  a=36.016;b=129.3456; AreaNo=4700000000;
			break; 
		case '경상남도': health_Code=4812000000;sidoName='경남';  a=35.2248;b=128.6841; AreaNo=4800000000;
			break;
		case '제주특별자치도': health_Code=5011000000;sidoName='제주'; a=33.4963;b=126.5332; AreaNo=5000000000;
			break;
	}
	MoveTo(a,b);
    displayMarker(new daum.maps.LatLng(a, b), sidoName); 
 	parsing();
    document.getElementById('myloctext').innerHTML = sidoName;
}

function selectMYLoc(value){
	var a,b;
	health_Code = null;
	forecast_Code = null;
	sidoName = value;

	switch(value){
		case '서울특별시': health_Code=1100000000;sidoName='서울';  a=37.5636;b=126.98; AreaNo=1100000000;
			break;
		case '부산광역시': health_Code=2600000000; sidoName='부산'; a=35.177;b=129.077; AreaNo=2600000000;
			break;
		case '대구광역시': health_Code=2700000000;sidoName='대구';  a=35.8685;b=128.6036; AreaNo=2700000000;
			break;
		case '인천광역시': health_Code=2800000000;sidoName='인천';  a=37.4532;b=126.7074; AreaNo=2800000000;
			break;
		case '광주광역시': health_Code=2900000000; sidoName='광주'; a=35.157;b=126.8534; AreaNo=2900000000;
			break;
		case '대전광역시': health_Code=3000000000;sidoName='대전';  a=36.3471;b=127.3866; AreaNo=3000000000;
			break;
		case '울산광역시': health_Code=3100000000; sidoName='울산'; a=35.5354;b=129.3137; AreaNo=3100000000;
			break;
		case '경기도': health_Code=4111000000;sidoName='경기';  a=37.2606;b=127.0307; AreaNo=4100000000;
			break;
		case '강원도': health_Code=4211000000;sidoName='강원';  a=37.8785;b=127.7323; AreaNo=4200000000;
			break;
		case '충청북도': health_Code=4311000000;sidoName='충북';  a=36.6396;b=127.4912; AreaNo=4300000000;
			break;
		case '충청남도': health_Code=4413000000;sidoName='충남';  a=36.8121;b=127.1162; AreaNo=4400000000;
			break;
		case '전라북도': health_Code=4511000000;sidoName='전북';  a=35.8215;b=127.15; AreaNo=4500000000;
			break;
		case '전라남도': health_Code=4611000000;sidoName='전남';  a=34.8088;b=126.3944; AreaNo=4600000000;
			break;
		case '경상북도': health_Code=4812100000;sidoName='경북';  a=36.016;b=129.3456; AreaNo=4700000000;
			break; 
		case '경상남도': health_Code=4812000000;sidoName='경남';  a=35.2248;b=128.6841; AreaNo=4800000000;
			break;
		case '제주특별자치도': health_Code=5011000000;sidoName='제주'; a=33.4963;b=126.5332; AreaNo=5000000000;
			break;
	}
 	parsing();
}

function parsing() {

	$.ajax({
		url:"http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?ServiceKey=ALU3bZoJ8Q7ZDwbvKbaZG8RagtVXMTE%2FsQWx1xxWRN6VHwxQ4fsy3Tl1hhUYDEcnPXGzJXGuHEglVUcfInfIBg%3D%3D&pageNo=1&numOfRows=1&ver=1.3&sidoName="+sidoName,
		 type: 'GET',
		 dataType:"xml",
		 success: dust 
	 });
    $.ajax({
        url:"http://203.247.66.146/iros/RetrieveWhoIndexService/getAsthmaWhoList?ServiceKey=55N1hQHeereP8lF51%2BpHC00GZ8DmJIhjTQlTsvEgYbixuNLHq%2Bu8BAiLmzMN1eJYp9EAlcdamPbuPVpAov0XHA%3D%3D&AreaNo="+AreaNo,
        type: 'GET',
        dataType:"xml",
        success: infl 
    });
}

function forecast(info) {
    var myXML = info.responseText;
    myXML = $.parseXML(myXML)
    myXML = $(myXML); 

    var result='';
    var data= $(myXML.find('item'));

    if ($(data[data.length-1]).find('informOverall').text().length!=0)
    {
		document.getElementById('f_1').innerHTML =$(data[data.length-1]).find('informOverall').text();
		document.getElementById('f_2').innerHTML =$(data[data.length-1]).find('informGrade').text();
		document.getElementById('date').innerHTML =$(data[data.length-1]).find('dataTime').text();
	} else {
		document.getElementById('f_1').innerHTML ='예보 준비중 입니다. ';
		document.getElementById('f_2').innerHTML ='예보 준비중 입니다. ';
		document.getElementById('date').innerHTML =$(data[data.length-1]).find('dataTime').text();
	}

}


function dust(info) {
	//console.log(info);
    var myXML = info.responseText;
    myXML = $.parseXML(myXML);
    myXML = $(myXML); 
    var result='';
    var data= $(myXML.find('item'));

	document.getElementById('d_1').innerHTML =$(data).find('dataTime').text();
	document.getElementById('d_2').innerHTML =$(data).find('stationName').text();
	document.getElementById('d_3').innerHTML =setTotalContent($(data).find('khaiGrade').text());
	document.getElementById('d_4').innerHTML =setContentforDust($(data).find('pm10Grade').text());
	document.getElementById('d_5').innerHTML =setContentforDust($(data).find('o3Grade').text());
	document.getElementById('d_6').innerHTML =setContentforDust($(data).find('coGrade').text());
	document.getElementById('d_7').innerHTML =setContentforDust($(data).find('coGrade').text());
}
function infl(info) {
    var myXML = info.responseText;
    myXML = $.parseXML(myXML);
    myXML = $(myXML); 
    var result='';
    var data= $(myXML.find('IndexModel'));

	document.getElementById('d_7').innerHTML =setContentforInfl($(data).find('tomorrow').text());
}
function setTotalContent(text) {
	var result = '';
 			switch(text)
			{
				case '0': result = '좋음';
					break;
				case '1': result = '좋음';
					break;
				case '2': result = '보통';
					break;
				case '3': result = '나쁨';
					break;
				case '4': result = '매우나쁨';
					break;
				default : result = '정보없음';
					break;
			}
	return result;
}

function setContentforDust(text) {
	var result='';
 			switch(text)
			{
				case '0': result = '좋음';
					break;
				case '1': result = '좋음';
					break;
				case '2': result = '보통';
					break;
				case '3': result = '나쁨';
					break;
				case '3': result = '매우나쁨';
					break;
				default : result = '정보없음';
					break;
			}
	return result;
}
function setContentforInfl(text) {
	var result='';
 			switch(text)
			{
				case '0': result = '낮음';
					break;
				case '1': result = '보통';
					break;
				case '2': result = '높음';
					break;
				case '3': result = '매우높음';
					break;
				default : result = '정보없음';
					break;
			}
	return result;
}