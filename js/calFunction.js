;;

(function(a){
    console.log(a);   //firebug输出123,使用（）运算符
})("start working...");


var CalendarInit=function(params){
    var _init=new Object();
    var _tools=new Object();
    var _oprate=new Object();
    _tools._addEvents=function(source){
        $("#calendar").fullCalendar('addEventSource',source);
        $('#calendar').fullCalendar('rerenderEvents');
    }
    _tools._setIcon=function(str){
        iconType={
            TYPE:"resources/event.png"
        }
        return iconType[str];
    }
    _tools._formatEvents=function(str){
        //6个一组
        //开始日期|开始时间|(结束日期|结束时间)|编号|内容|
        //data解析成calendar的数组格式
        var cells=str.split("|");
        var length=cells.length,
            i=0,j=0;
        var events=new Array();
        var time_start,time_end;
        var event_temp=new Object();
        for(i=0;i<length;i++){
            time_start=cells[i]+"T"+cells[i+1];
            event_temp.start=time_start;
            if(cells[i+2]!=""&&cells[i+3]!=""){
                time_end=cells[i+2]+"T"+cells[i+3];
                event_temp.end=time_end;
            }                
            event_temp.BH=cells[i+4]
            event_temp.title=cells[i+5];
//图标
            //event_temp.icon="resources/event.png";
            event_temp.icon=_tools._setIcon(cells[i+6]);

            if(i%7==0){
                events[j]=event_temp;
                j++;
                event_temp=new Object();
            }
        }
        return events;
    }

    _oprate.newItem=function(ID,Evtstr,dateStart,dateEnd){
        
    }
    _oprate.editItem=function(ID,BH){

    }
    /**
     * @moment:'2016-09-12'
     * @events:Array
     */
    _init.init=function(){
        var moment=params.startDate;
        var click2day=params.click2day=="true"?true:false;
        $('#calendar').fullCalendar({
			header: {
				center: 'title',
				left: 'prev,next today',
				right: 'month,basicWeek,basicDay'
			},
			eventRender: function(event, element) {
            	// $(element).addTouch();
        	},
			defaultDate: moment,
			navLinks: click2day, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			dayClick: function(date, jsEvent, view) {
				console.log('Clicked on: ' + date.format());
				//$(this).css('background-color', 'red');
                //回传函数，告诉jsp点击了这个时间，然后由主机调用refresh回调重新渲染事件
                // _oprate.newItem(ID,Evtstr,dateStart,dateEnd);
				
			},
            eventClick: function(calEvent, jsEvent, view) {
                console.log('Event: ' + calEvent.title+"BH:"+calEvent.BH);
                // _oprate.editItem(ID,BH);
            }
		});
    }   

    _init.loadEvents=function(){
        var ID=params.ID,
            SID=params.SID;
        var fd = new FormData();
        fd.append("ID", ID);
        fd.append("SID", SID);
        $.ajax({
            cache: true,
            type: "POST",
            url:'server/ajaxTest.php',
            data:fd,
            processData: false,  // 告诉jQuery不要去处理发送的数据
            contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
            error: function(request) {
                console.log(request);
            },
            success: function(data) {
                var source=_tools._formatEvents(data);
                //在这里初始化calendarevents
                //  $('#calendar').fullCalendar({
                //     eventSources: source
                // });
                // $('#calendar').fullCalendar('rerenderEvents');
                $("#calendar").fullCalendar( 'removeEventSources');
                _tools._addEvents(source);              
            },
            dataType: "text"
        });
    }   


    _init.closeCal=function (){
        window.top.closeLatery();
    }

    return _init;

}

;;
