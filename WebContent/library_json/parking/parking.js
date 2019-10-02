var map;
window.onload = function () {
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
		mapOption = {
		center: new daum.maps.LatLng(37.56544,126.977119,17), // 추가1 서울시청역으로 임의로 지정, 지도의 중심좌표
		level: 6 // 지도의 확대 레벨
		};
    
	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
	map = new daum.maps.Map(mapContainer, mapOption);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new daum.maps.ZoomControl();
    map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
	
	var button = document.getElementById("button");
	button.onclick = handleRefresh;//검색버튼을 클릭할때 마커표시

	daum.maps.event.addListener(map, 'dragend', function() {
		handleRefresh();//지도의 중심이 이동될때도 마커를 다시 표시
	});
}


function handleRefresh() {
	for (var i=1; i<16000; i=i+1000 )//16번 호출 i=1 j=1000, i=1001 j=2000, i=2001 j=3000,..., i=15001 j=16000 까지
	{
	var j = i + 999;
//	var url = "http://openAPI.seoul.go.kr:8088/6d535054636a6f6b37394c43484343/json/SearchParkingInfo/"+i+"/"+j;

	var url = "http://openAPI.seoul.go.kr:8088/644d42625173756e35354e6d636d63/json/GetParkInfo/"+i+"/"+j;
    $.getJSON(url, updatePark);
	}
	addBound();// 지도에 원을 표시
}

function updatePark(parks) {//16번 호출
   var arr = parks.GetParkInfo.row;
   var addr = "";
   var center = map.getCenter(); // 중심 가져오기 
   var position = {
          latitude : center.getLat(),
		  longitude: center.getLng()
      };

   for (var i = 0; i < arr.length; i++) {
      var park = arr[i];
      var imageSrc = "marker1.png",
		imageSize = new daum.maps.Size(27, 40), //마커의 크기(daummap에서 size 검색, 크기정보를 가지고 있는 사이즈 객체 생성)
		imageOption = {offset: new daum.maps.Point(14, 28)};//point 검색, 화면 좌표 정보를 담고 있는 포인터 객체 생성
	                                                        //point생성, 좌표를 0,0으로 해도 됨
      var loc = {//open API의 값들 위도와 경도
            latitude : park.LAT,
			longitude: park.LNG
      };
	  var km = computeDistance (position, loc); //거리 계산, position 지도의 중심좌표이고 loc는 각 주차장 좌표

	  var remain = park.CAPACITY - park.CUR_PARKING; 
      //  remain 주자가능대수= 주차면수-현재 주차대수
	  if(addr != park.ADDR && km <= 1){ //주소가 있고 반경 1KM 이내에 주차장 마커표시, 산관논
      // 
			var runselect = document.getElementById("run");// 0 평일주말 week ,  1 평일 weekday 
			var selectrun = runselect.selectedIndex;       //index 0 or 1
			var whatrun = runselect[selectrun].value;      //value 평일주말 or 평일
			var runwhat;
			if(whatrun=='weekday'&&park.WEEKEND_BEGIN_TIME=='0000'){// 평일 이면서 주말운영시작시간=='0000'  => 주말 운영 안함(평일만 운영함)
				addr = park.ADDR;//중복되는 데이타는 제외
				addMarker(imageSrc, imageSize, imageOption, park.LAT, park.LNG, park.PARKING_NAME,park.TEL, remain, park.PAY_NM, park.WEEKEND_BEGIN_TIME);
	            //remain:주차가능대수 , park.PAY_NM:유료운영여부명, park.WEEKEND_BEGIN_TIME:주말운영시작시간
			}
			else if(whatrun=='week' && park.WEEKEND_BEGIN_TIME!='0000'){// 평일주말 이면서 주말운영시간 !='0000' => 평일주말운영함
				addr = park.ADDR;
				addMarker(imageSrc, imageSize, imageOption, park.LAT, park.LNG, park.PARKING_NAME,park.TEL, remain, park.PAY_NM, park.WEEKEND_BEGIN_TIME);
		    }//if(whatrun=='weekday'
	  }//if(addr != park.ADDR && km <= 1){ 
   }//for (var i = 0; i < arr.length; i++) {
}//function updatePark(parks)

function addBound(){
	// 지도에 표시할 원을 생성합니다
	var bound = new daum.maps.Circle({
	   center : map.getCenter(),  // 원의 중심좌표 입니다 
	   radius: 1000, // 미터 단위의 원의 반지름입니다 
	   strokeWeight: 5, // 선의 두께입니다 
	   strokeColor: '#3333ff', // 선의 색깔입니다
	   strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
	   strokeStyle: 'dashed', // 선의 스타일 입니다
	   fillColor: '#b5b5ff', // 채우기 색깔입니다
	   fillOpacity: 0.3,  // 채우기 불투명도 입니다
	   zIndex: 1
	}); 
	
	// 지도에 원을 표시합니다 
	bound.setMap(map);

	daum.maps.event.addListener(map, 'dragstart', function() {//지도가 이동될때도 원이 다시 그려짐
		bound.setMap(null);
	});
}
//호출시  addMarker(imageSrc, imageSize, imageOption, park.LAT, park.LNG, park.PARKING_NAME,park.TEL, remain, park.PAY_NM, park.WEEKEND_BEGIN_TIME);
function addMarker(imageSrc, imageSize, imageOption, latitude, longitude, name, tel, remain, pay, run) {
	//remain:주차가능대수=>remain, park.PAY_NM:유료운영여부명=>pay, , park.WEEKEND_BEGIN_TIME:주말운영시작시간=>run	
	var payselect = document.getElementById("pay");//유료-nofree-0,  무료-free-1
	var selectpay = payselect.selectedIndex;
	var whatpay = payselect[selectpay].value;//유료 또는 무료
	var what;
	if(whatpay=='free')
		what='무료';
	else
		what='유료';
	
	if(pay==what){	//유료 또는 무료
	//이미지 마커 맵에 추가
	var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption),
	markerPosition = new daum.maps.LatLng(latitude, longitude);
	var marker = new daum.maps.Marker({
		position: markerPosition,
		image: markerImage,
		clickable: true,
		zIndex: 7
	});
	
	marker.setMap(map);
	
	daum.maps.event.addListener(map, 'dragstart', function() {
		marker.setMap(null);
	});
    
    if(run=='0000')//주말운영시간이 == 0000    => 주말운영은 안한다는 의미(평일운영)
	{
		if (tel == "")//전화번호 없는경우와 있는경우
		{
		var content =  "<div style='width:100%; height:100%; padding:5px; font-size:0.8em;'>주차장: "
			+ name +"("+what+")"+'&nbsp;&nbsp;&nbsp;'+'<br>'+"운영 유형: 평일만 운영" +'<br>'/*+"평일시작시간: "+ run */+ "</div>";
		}
		else{
			var content =  "<div style='width:100%; height:100%; padding:5px; font-size:0.8em;'>주차장: "
			+ name +"("+what+")"+'&nbsp;&nbsp;&nbsp;'+'<br>'+"운영 유형: 평일만 운영" +'<br>'/*+"평일시작시간: "+ run  +'<br>'*/+"전화 번호: "+ tel + "</div>";
		}
	}
	else{// 주말운영시간이 != 0000    => 평일주말운영한다는 의미(항시운영)
		if (tel == "")//전화번호 없는경우와 있는경우
		{
		var content =  "<div style='width:100%; height:100%; padding:5px; font-size:0.8em;'>주차장: "
			+ name+"("+what+")"+'&nbsp;&nbsp;&nbsp;'+'<br>'+"운영 유형: 항시 운영" +'<br>'+"시작시간: "+ run + "</div>";
		}
		else{
			var content =  "<div style='width:100%; height:100%; padding:5px; font-size:0.8em;'>주차장: "
			+ name +"("+what+")"+'&nbsp;&nbsp;&nbsp;'+'<br>'+"시작시간: "+ run +'<br>'+"전화 번호: "+ tel + "</div>";
		}

	}
	
	// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
	var iwContent = content, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
		iwPosition = markerPosition, //인포윈도우 표시 위치입니다
		iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

	// 인포윈도우를 생성합니다
	var infowindow = new daum.maps.InfoWindow({
	   position : iwPosition,
	   content : iwContent,
	   removable : iwRemoveable,
	   zIndex : 10
	});

	// 마커에 클릭이벤트를 등록합니다
	daum.maps.event.addListener(marker, 'click', function() {
      // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);  
	});

	}
}

function computeDistance  (startCoords,destCoords){
    
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads =degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);
    
    var Radius = 6371;
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads ) +
                             Math.cos(startLatRads) * Math.cos(destLatRads )  *
                             Math.cos(startLongRads -destLongRads )) * Radius;
    
    return distance ;
    
    
}

function degreesToRadians(degrees){
    var radians = (degrees * Math.PI)/180;
    return radians;
}