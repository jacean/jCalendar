;;

(function(a){
    console.log(a);   //firebug输出123,使用（）运算符
})("start working...");


var TEXT={
    零:0,
    一:1,
    二:2,
    三:3,
    四:4,
    五:5,
    六:6,
    七:7,
    八:8,
    九:9,
    十:10
}


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
    _tools.customHeader=function(){




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
				left: 'prev',
				right: 'next'
			},
            locale: 'zh-cn',
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
				customHeader();
			},
            // navLinkDayClick: function(date, jsEvent) {
            //     console.log('day', date.format()); // date is a moment
            //     console.log('coords', jsEvent.pageX, jsEvent.pageY);
            //     customHeader();
            // },
            eventClick: function(calEvent, jsEvent, view) {
                console.log('Event: ' + calEvent.title+"BH:"+calEvent.BH);
                // _oprate.editItem(ID,BH);
            }
		});
        customHeaderInit();
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
                customHeader();           
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

function customHeaderInit(){
    var header=$(".fc-toolbar");
        var leftButton=header.find(".fc-prev-button");
         var rightButton=header.find(".fc-next-button");

         var leftArrow=$("<img src='SJimagesV2/arrow_left.png' class='arrow_l' />");
         var rightArrow=$("<img src='SJimagesV2/arrow_right.png' class='arrow_r' />");
         $.each($._data(leftButton[0], "events"), function() {
            // iterate registered handler of original
            $.each(this, function() {
                leftArrow.bind(this.type, this.handler);
                leftArrow.click(customHeader);
            });
        });
        $.each($._data(rightButton[0], "events"), function() {
            // iterate registered handler of original
            $.each(this, function() {
                rightArrow.bind(this.type, this.handler);
                rightArrow.click(customHeader);
            });
        });

        header.addClass("hide_header");
        var newHeader=$("<div class='calender_header'></div>");
        $(".fc-toolbar").before(newHeader);
        newHeader.append(leftArrow);
         newHeader.append("<h1></h1>");
         newHeader.append(rightArrow);
         newHeader.append("<div class='clearfix'></div>");
         customHeader();
}
function customHeader(date){

    if(typeof date=="string")
    {
        title=date;
    }else{
        
            //对fullcalendar的header进行重绘，以使满足ssj风格
        //思路:将fc的toolbar(header)拿到，然后修改其中的css
        var header=$(".fc-toolbar");
        if(header.length==0){
            return false;
        }
        //文字替换
        //2016年 十一月
        //2016年11月13日
        var title,title_a,title_y,title_m,title_d;
        title=header.find("h2").text();
        title=title.replace(" ","");
        title_a=title.split(/[年月日]/);
        title_a.pop();//空白
        title_y =title_a[0];
        title_m=title_a[1];
        if(title_a.length>2&&title_a[2]!=""){
            title_d=title_a[2];
        }        
        //月份汉字替换，当title_a的长度为4-1
        if(title_a.length==2){
            title_m=title_m.replace(title_m[0],TEXT[title_m[0]]);
            if(title_m.length>1&&title_m!="10"){
                if(title_m.length>2){
                    title_m=title_m.replace(/0/,"");;
                }
                title_m=title_m.replace(title_m[1],TEXT[title_m[1]]);
            }
        }
       title_a[1]=title_m;
       title=title_a.join("-");
        console.log(title);
    }
         
        //header.empty();
        var newHeader=$(".calender_header");
        newHeader.find("h1").text(title);;
         customWidget();
         bindClick2day();
 
}
function customWidget(){

    var widgetHeader=$(".fc-head-container");
         var weeks=widgetHeader.find(".fc-day-header");
        //  widgetHeader.removeClass().addClass("form_title");
         $.each(weeks,function(){
            //  $(this).addClass("form_title_li");
             $(this).text($(this).text().replace(/周/,""));
             $(this).text($(this).text().replace(/星期/,""));
         });

         var dayNumber=$(".fc-day-number");
         $.each(dayNumber,function(){
            //  $(this).removeClass("fc-day-number").addClass("form_day_number");;


         });

}
function bindClick2day(){

    var days=$(".fc-day-grid").find(".fc-day-number");
    $.each(days,function(){
        //$(this).click(customHeader);
        $(this).click(function(){
            console.log($(this).attr("data-goto"));
            var date=JSON.parse($(this).attr("data-goto")).date;
            customHeader(date);
        });
    });
}