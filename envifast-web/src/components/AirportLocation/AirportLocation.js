import L from 'leaflet';

const AirportLocation = L.icon ({
    iconUrl: require('../../assets/icons/venue_location_icon.svg'),
    iconRetinaUrl: require('../../assets/icons/venue_location_icon.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(35, 35),
    className: 'leaflet-venue-icon'
})

export default AirportLocation;