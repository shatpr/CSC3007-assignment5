
let api = "https://api.data.gov.sg/v1/environment/psi";

     // Load external data
    fetch(api)
    .then(response => response.json()) 
    .then(data =>{
    
    console.log(data)
    
    psiReadings = data.items[0].readings.psi_twenty_four_hourly
    regionData = data.region_metadata
    updatedTimestamp = console.log(new Date(data.items[0].update_timestamp).toLocaleString())

    // document.getElementById("time").innerHTML = updatedTimestamp;

    // Map

    let tiles = new L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 18,
        minZoom: 11,
        //Do not remove this attribution
        attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;">' +
            'New OneMap | Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
    }); 
    let center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter()

    // Add MaxBound
    let map = new L.Map("map", {
        center: [1.347833, 103.809357], 
        zoom: 11,
        maxBounds: L.latLngBounds(L.latLng(1.1, 103.5), L.latLng(1.5, 104.3))
        })
        .addLayer(tiles)
        .setView([center.x, center.y], 12)
        .setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);

    
        let colorScale = d3.scaleThreshold()
        .domain([50, 100, 200, 300, 400])
        .range(["#A0D568, #4FC1E8, #FFCE54, #AC92EB #ED5564"]);

        let legendLabels = d3.scaleThreshold()
        .domain([50, 100, 200, 300, 400])
        .range(["Good", "Moderate", "Unhealthy", "Very Unhealthy", "Hazardous"]);
    
    for(let i = 0; i < regionData.length; i++) {
        labelLocation = regionData[i].label_location;
        region = regionData[i].name;
        
        let circle =  L.circleMarker([labelLocation.latitude, labelLocation.longitude], { 
            radius: labelLocation[region] * 1.5,
            opacity: .9,                            
            fillOpacity: 0.3,
            fillColor: colorScale(labelLocation[region]),
            color: colorScale(labelLocation[region]),

        });
        

        let marker = L.marker([labelLocation.latitude, labelLocation.longitude], { 
            icon: new L.DivIcon({
            html: "<br>" + labelLocation[region] + "</b>",
            className: 'circle-with-txt'
             })

        });

        let group = L.layerGroup([circle, marker]);
        group.addTo(map);
    }; 
    
    })
    
   

