

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

var map = L.map('map').setView([37.8, -96.9], 2).addLayer(osm);

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

// Load map data
d3.json('npsBoundaries.json', function(error, mapData) {

    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    var park = g.selectAll("path")
        .data(mapData.features)
        .enter().append("path");

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the parks.
    function reset() {
        var bounds = path.bounds(mapData),
            topLeft = bounds[0],
            bottomRight = bounds[1];
        console.log(bounds)
        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        park.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
});



