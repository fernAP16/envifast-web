import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from "leaflet";

import airplaneIcon from "../../assets/icons/avion.png";

const icon = L.icon({
  iconSize: [45, 45],
  popupAnchor: [2, -20],
  iconUrl: airplaneIcon
});

export default function AirplaneMarker({ data }) {
  const { lat, lng , duration_flight} = data;
  const [prevPos, setPrevPos] = useState([lat, lng]);

  // ejecutar lo que que esta dentro si se cambia los parametros despues de la ,
  useEffect(() => {
    if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng]);
    // console.log("Lat " + lat)
    // console.log("lng " + lng)
  // }, [lat, lng, prevPos]);
  }, [lat, lng]);

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[lat, lng]}
      previousPosition={prevPos}
      duration={1000 * duration_flight}// poner el factor de transformacion
    />
  );
}