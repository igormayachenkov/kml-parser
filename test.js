console.log('test.js')

import * as KML from './src/kml.js';
import {SortedList,DynamicSortedList} from './lists.js';

// Data
let kml = null
// Controls
let inputText = null
let list = null
let compare = {			// compare functions
    name : function(a, b){
        return 0;
    },
}

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
            // Empty controls
            list.empty()
            // Load data
            kml.parseFromString(inputText.val())
            console.log('SUCCESS',kml)
            // Load controls
            let features = kml.root?.features
            if(features){
                console.log('features',features)
                list.loadDataArray(features)
            }
        }catch(error){
            console.error(error)
            alert(error)
        }
    })
    // Main List Control
    list  = new FeaturesList({
        header:  null,//hdr,
        body:    $('.panel-viewer .list'),
        compare: compare
    })

    // INSERT LOGO
    // https://css-tricks.com/using-svg/
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial
    $('header').append(
        `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 35">`+
            //`<rect width="100%" height="100%" fill="white" />`+
            //`<image href="locate.svg" class="logo"/>` +
            `<path d="M9.23,34.43A6.58,6.58,0,0,1,5,30.62,12.56,12.56,0,0,1,3.64,26a1.69,1.69,0,0,0,.78.3,2.29,2.29,0,0,0,1,0,7.65,7.65,0,0,1,0-2.3,6.31,6.31,0,0,1,.93-2.12,12.08,12.08,0,0,0,.72,4.37,12.61,12.61,0,0,0,2.08,3,20.18,20.18,0,0,1-.65-3.68A15.16,15.16,0,0,1,9,21.83a9.07,9.07,0,0,0,1.21,2.34c.65.74,1.26,1.6,1.26,1.6s.95-.95,1.17-3.94a33.52,33.52,0,0,0,0-5.11s2.16,2.25,2.29,4.5a10.81,10.81,0,0,1-.6,4.12,11.19,11.19,0,0,0,1.82-1.65,7.28,7.28,0,0,0,1.21-2,7.76,7.76,0,0,1,.43,2.51,9.92,9.92,0,0,1-.69,2.38s.52-.22.95-.43a2.35,2.35,0,0,0,.69-.54s.09,3.7-2.38,5.69A50.88,50.88,0,0,1,12,34.43s6.67,1.3,9.62-2.42a13.49,13.49,0,0,0,2.51-8.62,3.12,3.12,0,0,1-1,1.13c-.69.47-1,.43-1,.43a19.47,19.47,0,0,0,1.17-6,14.17,14.17,0,0,0-1.82-5.54,5.94,5.94,0,0,1-.22,1.64,6.53,6.53,0,0,1-1.39,1.56A15.41,15.41,0,0,0,19,11.44,11.21,11.21,0,0,0,16.07,7a8.94,8.94,0,0,1,.17,2,4.58,4.58,0,0,1-.65,1.56,7.27,7.27,0,0,0-1-2.77c-1-1.82-2.25-2.39-2.94-4.25A12.45,12.45,0,0,1,10.87,0,5.49,5.49,0,0,0,9.75,2.21c-.31,1.3,0,4.16-.09,5a3.38,3.38,0,0,1-.52,1.43,13.53,13.53,0,0,0-1.26-2A3,3,0,0,0,6.19,5.5,11.23,11.23,0,0,1,6.63,11a20.33,20.33,0,0,1-1.48,4.68,5.28,5.28,0,0,0-.86-2.08,4.42,4.42,0,0,0-1.65-1.21,29.06,29.06,0,0,1,0,4.94,33.51,33.51,0,0,1-.91,3.94A3.18,3.18,0,0,0,1,20.1a5,5,0,0,0-1-.57,12.44,12.44,0,0,1,.39,3.6C.26,24.82-.3,29.67,2.3,32.36S9.23,34.43,9.23,34.43Z"`+
            //` fill="red" stroke="yellow"`+ // can be specified in css
            `/>` +
        `</svg> `
    )
})

//-----------------------------------------
// THE MAIN LIST CONTROL
class FeaturesList extends SortedList{

    constructor(p){
        p.header = {order:"name"}// dummy header
        p.compare = {
            name : function(a, b){
                const nameA = a.name?a.name:''
                const nameB = b.name?b.name:''
				return nameA.localeCompare(nameB);
			}
        }
        super(p)
        this.onRowClick = this.onRowClick.bind(this)
    }

    fillRow(row, obj){
        let main = $('<div class="row-main"></div>')
        main.on('click', this.onRowClick )
        main.append(`<b>${obj.name}</b>`);
        let details = $('<div class="row-details"></div>')

        // Node or Leaf?
        if(obj.features){
            // NODE -> reccurent call
            row.addClass('node')
            let ctl = $(`<div class="list"></div>`)
            details.append(ctl)
            let sublist = new FeaturesList({
                header:  null,//hdr,
                body:    ctl,
                compare: compare
            })
            sublist.loadDataArray(obj.features)
        }else{
            // LEAF
            row.addClass('leaf')
            // Locate icon
            //if(obj.drawing)
                main.append($(`<i class='row-icon locate'></i>`).click(function(event){
                    event.stopPropagation();
                    obj.drawing.locate()
                }))
            //else
                //main.append($(`<b></b>`))

            //Details
            details.append(`<div>feature "${obj.name}" details</div>`)

        }

        row.append(main)
        row.append(details)
    }

    onRowClick(event){
        let row = $(event.target).closest('[objid]')
        row.toggleClass('expanded')
    }
}


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
