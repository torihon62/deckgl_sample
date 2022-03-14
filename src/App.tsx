import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import DeckOverlay from './DeckOverlay';

function App() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    });

    if (loadError) return <div>load Error</div>;

    return isLoaded ? (
        <div style={{ height: '600px', width: '600px'}}>
            <GoogleMap
                id="wdb-google-map"
                clickableIcons={false}
                mapContainerStyle={{
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                }}
                zoom={16}
                onLoad={map => {
                    map.setCenter({
                        lat: 35.689634,
                        lng: 139.692101,
                    });
                }}
            >
                <DeckOverlay />
            </GoogleMap>
        </div>
    ) : (
        <></>
    );
};

export default App;
