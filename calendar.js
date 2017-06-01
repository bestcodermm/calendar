

   var layOutDay = function() {
     var events = [
      {id : 1, start : 30, end : 150},  // an event from 9:30am to 11:30am
      {id : 2, start : 540, end : 600}, // an event from 6pm to 7pm
      {id : 3, start : 560, end : 620}, // an event from 6:20pm to 7:20pm
      {id : 4, start : 580, end : 670}, // an event from 7:10pm to 8:10pm
      {id : 5, start : 570, end : 670}, //6:30
      {id: 6, start : 200, end: 250} //12:20

     ];

     var timeslots = [];
     var event, i, j;
     // Step 0: Sort events by id.
     events = events.sort(function(a, b){return a.start - b.start;});
     // Step 1: Initialize timeslots.
     for (i = 0; i < 720; i++) {
       timeslots[i] = [];
     }

     // Step 2: Arrange the events by timeslot.
     for (i = 0; i < events.length; i++) {
       event = events[i];
       // Safety first.
       if (event.start > event.end) {
         var temp = event.start;
         event.start = event.end;
         event.end = temp;
       }

       for (j = event.start; j < event.end; j++) {
         timeslots[j].push(event);
       }
     }
     console.log(timeslots);

     for (i = 0; i < 720; i++) {
       var next_hindex = 0;

       if (timeslots[i].length > 0) {
         var tmp = [];
         for(j = 0; j < timeslots[i].length; j++){
           tmp.push(j);
         }
         // Store the greatest concurrent event count (cevc) for each event.
         for (j = 0; j < timeslots[i].length; j++) {
           event = timeslots[i][j];
           //console.log("In time slot "+i+", the event "+event.id+" The cevc is "+event.cevc);
           if (!event.cevc || event.cevc < timeslots[i].length) {
             //console.log("In time slot "+event+" The cevc is "+event.cevc);
             event.cevc = timeslots[i].length;
             // Now is also a good time to coordinate horizontal ordering.
             // If this is our first conflict, start at the current index.
             if (!event.hindex) {
               //console.log("For "+event.id+ " this event hindex will be "+next_hindex);
               //event.hindex = next_hindex;
               event.hindex = tmp[0];
               tmp.splice(0,1);
               // We also want to boost the index,
               // so that whoever we conflict with doesn't get the same one.
               //next_hindex++;
               //console.log(event.hindex);
             }
             else {
               var index = tmp.indexOf(event.hindex);
               if (index > -1) tmp.splice(index,1);
             }
           }
           //console.log(event);
           //console.log(event);
         }
       }
     }
     // Step 4: Calculate event coordinates and dimensions,
     // and generate DOM.
     for (i = 0; i < events.length; i++) {
       event = events[i];

       // Height and y-coordinate are already known.
       event.pxh = event.end - event.start;
       event.pxy = event.start;

       // Width is based on calendar width and the cevc.
       event.pxw = 600 / event.cevc;

       // Height uses the same calendar/cevc figure,
       // multiplied by the horizontal index to prevent overlap.
       event.pxx = event.hindex * event.pxw;

       // Now, the easy part.
       var div = document.createElement("div");
       div.style.width = event.pxw + "px";
       div.style.height = event.pxh + "px";
       div.style.top = event.pxy + "px";
       div.style.left = event.pxx + "px";
       div.style.position = "absolute";
       div.style.background = "#"+Math.floor(Math.random()*16777215).toString(16);
       // (random colours will make the events easy to tell apart.)

      // console.log(document);
       document.getElementById("calander").appendChild(div);
     }
   };
