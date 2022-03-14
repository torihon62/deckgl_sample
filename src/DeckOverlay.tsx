import { renderToString } from 'react-dom/server';
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { useGoogleMap } from "@react-google-maps/api";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";

let overlay: GoogleMapsOverlay;
let coordinates1 = [139.692101, 35.689634];
let coordinates2 = [139.6941689, 35.6902021];

function DeckOverlay() {
    const map = useGoogleMap();

    const [point1, setPoint1] = useState(coordinates1);
    const [point2, setPoint2] = useState(coordinates2);

    const geojson1 = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": point1
                },
                "properties": {
                    "name": "東京都庁"
                }
            },
        ]
    };

    const geojson2 = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": point2
                },
                "properties": {
                    "name": "京王プラザホテル"
                }
            },
        ]
    };    

    const createSvgIcon = () => {
        const svg = renderToString(
            <svg
                width="80px"
                height="80px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <circle fill="white" cx="12" cy="9" r="4" />
                <path
                    fill="#003452"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                ></path>
            </svg>
        );
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    };
    
    const makeGeoJsonLayer = (id: string, data: unknown) => {
        return new GeoJsonLayer({
            id,
            data ,
            pickable: true,
            pointType: 'icon',
            getIcon: () => ({
                url: createSvgIcon(),
                width: 80,
                height: 80,
            }),
            getIconPixelOffset: () => [0, -28],
            getIconSize: () => 3,
            iconSizeScale: 16,
            onClick: info => {
                console.log(info);
            },
            onHover: info => {
                if (!map) return;
                map.setOptions({ draggableCursor: info.object ? 'pointer' : 'grab' });
    
                console.log(info);
            },
        });  
    }

    const geojsonLayer1 = makeGeoJsonLayer('layer1', geojson1);
    const geojsonLayer2 = makeGeoJsonLayer('layer2', geojson2);

    const layerUpdate = (layer: string, direction: 0 | 1, range: number) => {
        console.log(layer)
        if (layer === 'layer1') {
            coordinates1[direction] = coordinates1[direction] + range;
        } else {
            coordinates2[direction] = coordinates2[direction] + range;
        }
        if (layer === 'layer1') setPoint1([...coordinates1]); 
        if (layer === 'layer2') setPoint2([...coordinates2]);
    }

    const randomUpdate = () => {
        setInterval(() => {
            const layer = `layer${ Math.random() > 0.5 ? 1 : 2}`;
            const direction = Math.random() > 0.5 ? 0 : 1;
            const range = Math.random() > 0.5 ? 0.001 : -0.001;
            layerUpdate(layer, direction, range);
        }, 1000);
    };

    useEffect(() => {
        overlay = new GoogleMapsOverlay({
            id: 'deck_gl_google_map_overlay',
            layers: [geojsonLayer1, geojsonLayer2],
        });
        overlay.setMap(map);
        randomUpdate();
        return () => {
            overlay.finalize();
        };
    }, []);

    useEffect(() => {
        overlay.setProps({ layers: [geojsonLayer1, geojsonLayer2] });
    }, [geojsonLayer1, geojsonLayer2]);    

    return null; 
};

export default DeckOverlay;
