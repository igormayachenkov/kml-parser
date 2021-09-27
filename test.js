console.log('test.js')

import {KML} from './index.js';

// Data
let kml = null
// Controls
let inputText = null

// Init
$(function(){
    console.log("jQuery ready!")

    // DATA
    kml = new KML.Kml({singleSelection:false})

    // SOURCE TEXT PANEL
    inputText = $('textarea')
    inputText.val(kmlSample)

    // VIEWER PANEL
    $('#parse-text').on('click',function(){
        try{
            kml.parseFromString(inputText.val())
            console.log('SUCCESS',kml)
        }catch(error){
            console.error(error)
            alert(error)
        }
    })

})


const kmlSample = '<?xml version="1.0" encoding="UTF-8"?>\
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n\
<Document>\n\
    <name>Ngulia</name>\n\
    <Folder>\n\
        <name>Bounds</name>\n\
        <Placemark>\n\
            <name>test point</name>\n\
            <Point>\n\
                <coordinates>37.57209,55.80533</coordinates>\n\
            </Point>\n\
        </Placemark>\n\
        <Placemark>\n\
            <name>wrong point</name>\n\
            <Point>\n\
            </Point>\n\
        </Placemark>\n\
        <Placemark>\n\
            <name>LinearRing.kml</name>\n\
            <Polygon>\n\
                <outerBoundaryIs>\n\
                    <LinearRing>\n\
                        <coordinates>\n\
                        -122.365662,37.826988,0 -122.365202,37.826302,0\r\n\
                        -122.364581,37.82655,0  \r\
                        -122.364581  \r\
                        -122.365038,37.827237,0 \n\
                        wrong,value,0\
                        -122.365662,37.826988,0\
                        </coordinates>\n\
                    </LinearRing>\n\
                </outerBoundaryIs>\n\
            </Polygon>\n\
        </Placemark>\n\
    </Folder>\n\
    <Folder>\n\
        <name>Roads</name>\n\
        <Folder>\n\
            <name>Roads subfolder</name>\n\
            <Placemark>\n\
			<name>Road 1</name>\n\
			<visibility>0</visibility>\n\
			<styleUrl>#m_ylw-pushpin121</styleUrl>\n\
			<LineString>\n\
				<tessellate>1</tessellate>\n\
				<coordinates>\n\
					38.19439626089172,-2.976954651398529,0 38.19637224425649,-2.978710515333976,0 38.19846637016621,-2.977969044662994,0 38.20673351343918,-2.983741961709745,0 38.20722170044486,-2.980913516552085,0 38.24083266278009,-2.991494872784786,0 38.24641062006339,-2.993116115255185,0 38.25541398743441,-2.999220008259863,0 38.25697784506721,-3.005557147965376,0 38.25809772745807,-3.012103528367668,0 38.2631542799225,-3.016004357566955,0 38.26407659698351,-3.020301040021368,0 38.27110540885661,-3.023438627000819,0 38.26795198835482,-3.029591888488652,0 38.27082942692792,-3.032820557993619,0 \n\
				</coordinates>\n\
			</LineString>\n\
		</Placemark>\n\
        </Folder>\n\
    </Folder>\n\
</Document>\n\
</kml>';
