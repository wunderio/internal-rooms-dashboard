var $ = require("jquery");

function clearSchedule() {
    $(".view-wrap .event-col-template").remove();
    $(".sub-header .room-template").remove();
    $(".office-selector option").remove();
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function getData(office_id = 0, date = 20190807) {
    clearSchedule();

    /*$.get( "http://calendar.karlis.id.lv/calendar.php", { office_id: office_id, date: date }, "jsonapi" )*/
    $.get( "http://localhost:8888/calendar.php", { office_id: office_id, date: date }, "jsonapi" )
        .done(function( data ) {
            data = $.parseJSON(data);


            $(data.offices).each(function(offIn, offName) {
                $(".office-selector").append('<option value="'+offIn+'">' +offName.title + '</option>')
            });

            $(".office-selector option").prop("selected", false);
            $(".office-selector option[value="+office_id+"]").prop("selected", true);

            $(data.rooms).each(function(roomIndex, roomData) {


                var roomMarkup = $(".templates .room-template").clone();
                $(roomMarkup).find(".room-title").text(roomData.title);
                $(roomMarkup).find(".capacity").text(roomData.capacity);
                $(roomMarkup).appendTo(".rooms-row");


                var enventColMarkup = $(".templates .event-col-template").clone();
                $(enventColMarkup).attr("data-roomid", roomData.id);
                $(enventColMarkup).appendTo(".events-row");

            });

            $(data.events).each(function(roomIndex, eventData) {


                var eventHeight = eventData.length / 3600 * 10;
                var eventTop = eventData.timeFromMorning / 3600 * 10;

                // create overlap checking (store in array  objects: top and top+height,
                // check if they ovep, add css-clases for overlap
                // witdth: 45%, (+ right:0 for second item)
                // also check if last top+height  is same as new top and add
                // css border-top: 1px solid #6c757d; for event-item

                var eventMarkup = $(".templates .event-template").clone();
                $(eventMarkup).find(".event-title").text(eventData.title);
                $(eventMarkup).find(".event-start").text(eventData.startTime);
                $(eventMarkup).find(".event-end").text(eventData.endTime);
                $(eventMarkup).css("height", eventHeight + "%");
                $(eventMarkup).css("top", eventTop + "%");
                // $(roomMarkup).find(".capacity").text(roomData.capacity);

                // tweak these  add event-item css clas height-(Math.floor(eventHeight))
                if (eventHeight < 8) {
                    $(eventMarkup).css({"padding": "1px"});
                }

                if (eventHeight < 7) {
                    $(eventMarkup).find(".event-timing").css({
                        "float": "left",
                        "padding-right": "10px",
                    })
                }

                if (eventHeight < 5) {
                    $(eventMarkup).find(".event-timing").css({
                        "font-size": "0.8rem",
                        "padding-bottom": 0,
                    });

                    $(eventMarkup).css({"padding": "1px"});
                }

                $(eventMarkup).appendTo('[data-roomid="'+eventData.calendarId+'"]');

            });

        });
}

$(document).ready(function() {

        let searchParams = new URLSearchParams(window.location.search)
        if (searchParams.has('office_id')) {
            var office_id = searchParams.get('office_id');
        } else {
            office_id = 1;
        }

        if (searchParams.has('date')) {
            var office_id = searchParams.get('date');
        } else {
            var now = new Date();
            console.log(date);
            var date = now.getUTCFullYear().toString() + parseInt(now.getUTCMonth() + 1).pad(2) + now.getUTCDate().pad(2)
        }

        getData(office_id, date);
        $(".office-selector").change(function () {
            var office_id = $(".office-selector option:selected").val();
            clearSchedule();
            getData(office_id);
        });
}
);