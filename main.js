
let api = "https://api.data.gov.sg/v1/environment/psi";

     // Load external data
    fetch(api)
    .then(response => response.json()) 
    .then(data =>{
    
    console.log(data)
    
    psiReadings = data.items[0].readings.psi_twenty_four_hourly
    regionData = data.region_metadata
    updatedTimestamp = new Date(data.items[0].update_timestamp).toLocaleString()

    document.getElementById("lastupdated").innerHTML = "Last Updated: " + updatedTimestamp;

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
    
    let domain = [51, 101, 201, 301, 401];
    let psiLevels = ["Good", "Moderate", "Unhealthy", "Very Unhealthy", "Hazardous"];

    let map = new L.Map("map", {
        center: [1.347833, 103.809357], 
        zoom: 11,
        maxBounds: L.latLngBounds(L.latLng(1.1, 103.5), L.latLng(1.5, 104.3))
        })
        .addLayer(tiles)
        .setView([center.x, center.y], 12)
        .setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);

    
        let colorScale = d3.scaleThreshold()
        .domain(domain)
        .range(["green", "blue", "yellow", "orange", "red"]);

        let legendLabels = d3.scaleThreshold()
        .domain(domain)
        .range(psiLevels);
    
    let size = regionData.length;
   
    for(let i = 0; i < size; i++) {
        let labelLocation = regionData[i].label_location;
        let region = regionData[i].name;
        console.log(labelLocation.latitude)
        console.log(labelLocation.longitude)
        console.log(region)
        let circle =  L.circle([labelLocation.latitude, labelLocation.longitude], { 
            radius: psiReadings[region]*40,                      
            fillOpacity: 0.4,
            fillColor: colorScale(psiReadings[region]),
            color: colorScale(psiReadings[region]),

        }
        ).addTo(map);
        

        let marker = L.marker([labelLocation.latitude, labelLocation.longitude], { 
            icon: new L.DivIcon({
            className: 'text-labels',
            iconAnchor: [13, 16],
            direction: 'center',
            html: "<b>" + psiReadings[region] + "</b>",
             })

        }).addTo(map);
        
        circle.bindPopup("Status: " + legendLabels(psiReadings[region]), {
            className: "bd"
        });
        marker.bindPopup("Status: " + legendLabels(psiReadings[region]), {
            className: "bd"
        });
    }
    
    // Legend
    let legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (_map) {

        let div = L.DomUtil.create('div', 'info legend'),
        levels = [0, 50, 100, 200, 300];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < levels.length; i++) {
            div.innerHTML +=
            '<div class="mt-1">' + 
                '<p style="background:' + colorScale(levels[i] + 1) + '"></p> ' + psiLevels[i] +
            '</div>';
        }

        return div;
    };

    legend.addTo(map);
})
    
   

