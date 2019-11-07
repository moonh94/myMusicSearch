
$(document).click(function (event) { 
    $(".hide").fadeOut();           
    $(".show").fadeIn("slow");  
  });

var artistSearched = [];
var suggestion = [];


function displayBandInfo() {



   var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + bandName + "&city=" + city + "&apikey=cBL4SnU5itvcXd4uhDb6raolj7gNc9co"


   $.ajax({
       url: queryURL,
       method: "GET"
   }).then(function (response) {
       // console.log(response);
       var events = response._embedded.events;
       var image = response._embedded.events.image;

       response._embedded.events.forEach(function (event) {
           // console.log(event);
           appendEvent(event);

       });

   });
};


$("#submit").on("click", function (event) {
   event.preventDefault();
   $("#results").empty();
    $(".scrollBoxSuggestions").empty();
    suggestion=[];

   bandName = $("#bandInput").val().trim();
   city = $("#location").val()

   var artist = $("#bandInput").val();
   artistSearched.push(artist);

   displayBandInfo();
   displaySuggestionInfo();

   $("input").val("")

});


function appendEvent(event) {

   var eventName = event.name;
   var url = event.url;
   var imageURL = event.images[1].url;
   var image = "";

   for (i = 0; i < event.images.length; i++) {
       if (event.images[i].width > 600 && event.images[i].width < 800) {
           image = event.images[i]
           break;
       }

   }

   $("#results").append("<h2>" + eventName + "</h2>");
   $("#results").append("<p> <a href=" + url + " target='_blank'>Click Here For Tickets!</a></p>");
   $("#results").append("<image src=" + image.url + "></image><br>");



}

function displaySuggestionInfo() {

   // var suggestion = this.attr("Name");
   var queryURL = "https://tastedive.com/api/similar?q=" + artistSearched + "&k=332517-project1-8TB60H4T";
   suggestion = [];
   $.ajax({
       url: queryURL,
       method: "GET",
       contentType: "application/json",
       dataType: "jsonp"
   }).then(function (response) {


        console.log(response);






$(".scrollBoxSuggestions").html("");

       for (var i = 0; i < 20; i++) {

           var suggestedLink = response.Similar.Results[i].Name;

           var finalLink = suggestedLink.split(' ').join('+');
           console.log(finalLink)
           $(".scrollBoxSuggestions").prepend("<p><a href= https://www.ticketmaster.com/search?q=" + finalLink + "'&sort=relevance%2Cdesc&radius=10000&tab=events&daterange=all' target='_blank'>" + suggestedLink + "</a></p>");
       }

       console.log('suggestion post loop', suggestion)

   });
}

function rerunTicketMaster() {
   for (var i = 0; i < suggestion.length; i++) {
       var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + bandName + "&city=" + city + "&apikey=cBL4SnU5itvcXd4uhDb6raolj7gNc9co"

       $.ajax({
           url: queryURL,
           method: "GET"
       }).then(function (response) {

           $(".scrollBoxSuggestions").append("<p>From TM:" + response._embedded.events + "</p>");

       });

   };
}

