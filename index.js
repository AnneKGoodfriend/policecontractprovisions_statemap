var width = 900
    height = 500
    active = d3.select(null);
        //active = d3.select(null);

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);

var color = d3.scale.linear()
  //.range(["rgb(240,128,128)","rgb(205,85,85)","rgb(205,51,51)","rgb(178,34,34)","rgb(139,35,35)","rgb(139,26,26)","rgb(139,0,0)","rgb(128,0,0)"]);
    .range(["rgb(0,0,)","rgb(30,30,30)","rgb(60,60,60)","rgb(80,80,80)","rgb(100,100,100)","rgb(120,120,120)","rgb(140,140,140)","rgb(160,160,160)"]);

var legendText = ["1", "", "", "", "", "", "", "8"];

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    //.on("click", stopped, true);

svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg
        .call(zoom) // delete this line to disable free zooming
        .call(zoom.event);

// Append DIV for tooltip to SVG
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")    
    .style("opacity", 1)

// Load in the CSV by state
d3.csv("Final_14_States4.csv", function(data) {
color.domain([8,7,6,5,4,3,2,1,0]); // setting the range of the input data
  
  // Load GeoJSON data and merge with states data
  d3.json("us-states.json", function(json) {

      // Loop through each state data value in the .csv file
      for (var i = 0; i < data.length; i++){

          // Grab State Name
          var dataState  = data[i].state;

          // Grab code value 
          var dataValue = data[i].coder;

          //Grab other data
          var dataviolations = data[i].misconduct;
          var datadoc= data[i].doc;
          var datalanguage = data[i].language;

          //Find the corresponding state inside the GeoJSON
          for (var j = 0; j < json.features.length; j++)  {
             var jsonState = json.features[j].properties.name;
             if (dataState == jsonState) {

               // Copy the data value into the JSON
              json.features[j].properties.coder = dataValue;
              json.features[j].properties.name = dataState

               json.features[j].properties.misconduct = dataviolations;
               json.features[j].properties.doc = datadoc;
               json.features[j].properties.language = datalanguage;

               // Stop looking through the JSON
               break;
             }
          }
        }

        //Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("stroke", "#fff")
          .on("click", clicked)
          .style("stroke-width", "2")
          .style("fill", function(d) {
               // Get data value
               var value = d.properties.coder;
               // console.log(state);
               // console.log(dataState);
               if (value) {
                 //If value exists…
                 // console.log('in here');
                 // console.log(state);
                 // console.log(dataState);
                 //return "rgb(255,0,0)"
                  return color(value);
               } else {
                 //If value is undefined…
                 // console.log('in THERE');
                 // console.log(state);
                 // console.log(dataState);
                 return "rgb(230, 230, 230)";
               }
              })
      

      d3.csv("Final_14_States4.csv", function(data) {

       // var numDataAge = d.properties.average;
       // var numDataMale = d.properties.male;
       // var numDataFemale = d.properties.female;

           div.append("text")
           .data(data)
           .enter()

           // .on("mouseover", function(d) {      
           //      div.transition()        
           //         .duration(200)      
           //         .style("opacity", .9);      
           //      div.text(data.average)
           //         .style("left", (d3.event.pageX) + "px")     
           //         .style("top", (d3.event.pageY)+ "px");    
           // })   

           // // fade out tooltip on mouse out               
           // .on("mouseout", function(d) {       
           //     div.transition()        
           //     .duration(500)      
           //     .style("opacity", 0);   
           // });
      });

     // Legend
var legend = d3.select("body").append("svg")
          .attr("class", "legend")
          .attr("width", 140)
          .attr("height", 160)
          .selectAll("g")
          .data(color.domain().slice().reverse())
          .enter()
          .append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);
    legend.append("text")
          .data(legendText)
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("font-size", 14)
          .text(function(d) { return d; });
         

    })
});

function clicked(d) {
//       console.info(d);
//       $("#info_window").html(d.properties.misconduct);
//     }

// if (active.node() === this) return reset();
//       active.classed("active", false);
//       active = d3.select(this).classed("active", true);

//       var bounds = path.bounds(d),
//           dx = bounds[1][0] - bounds[0][0],
//           dy = bounds[1][1] - bounds[0][1],
//           x = (bounds[0][0] + bounds[1][0]) / 2,
//           y = (bounds[0][1] + bounds[1][1]) / 2,
//           scale = .9 / Math.max(dx / width, dy / height),
//           translate = [width / 2 - scale * x, height / 2 - scale * y];

//       svg.transition()
//           .duration(750)
//           .call(zoom.translate(translate).scale(scale).event);

    showInfo(d);
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      svg.transition()
          .duration(750)
          .call(zoom.translate([0, 0]).scale(1).event);
    }

    function zoomed() {
      g.style("stroke-width", 1.5 / d3.event.scale + "px");
      g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

    function showInfo(d) {
      console.info(d);
      $("#state_window").html("State:  " + d.properties.name);

      var docmisconduct = d.properties.misconduct;
          if (docmisconduct) {
            $("#info_window").html("Violations and Misconduct:  " + d.properties.misconduct);
            }else{$("#info_window").html("Violations and Misconduct: no data ")};

      var doclanguage = d.properties.language;
          if (doclanguage) {
              $("#language_window").html("Contract Language:  " + d.properties.language);
            }else{$("#language_window").html("Contract Language: no data ")};
    }

