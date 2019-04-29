var $ = require("jquery");

function clearSchedule() {
    $(".view-wrap .event-col-template").remove();
    $(".sub-header .room-template").remove();
    $(".office-selector option").remove();
}

function getData(office_id = 0, date = 20190426) {

    clearSchedule();

    $.get( "http://calendar.karlis.id.lv/calendar.php", { office_id: office_id, date: date }, "jsonapi" )
        .done(function( data ) {

            data = $.parseJSON(data);

            console.log(data);


            $(data.offices).each(function(offIn, offName) {

                $(".office-selector").append('<option value="'+offIn+'">' +offName.title + '</option>')

            });


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

                var eventMarkup = $(".templates .event-template").clone();
                $(eventMarkup).find(".event-title").text(eventData.title);
                $(eventMarkup).find(".event-start").text(eventData.startTime);
                $(eventMarkup).find(".event-end").text(eventData.endTime);
                $(eventMarkup).css("height", eventHeight + "%");
                $(eventMarkup).css("top", eventTop + "%");
                // $(roomMarkup).find(".capacity").text(roomData.capacity);
                $(eventMarkup).appendTo('[data-roomid="'+eventData.calendarId+'"]');

            });



        });

}

$(document).ready(function() {
        getData();
        // $(".office-selector").change(function () {
        //     clearSchedule();
        //     getData($(".office-selector").val())
        // });
}
);