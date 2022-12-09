import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from "leaflet";

import airplaneIcon from "../../assets/icons/avion.png";

const icon = L.icon({
  iconSize: [15, 15],
  popupAnchor: [2, -20],
  iconUrl: airplaneIcon
});

export default function AirplaneMarker({ data }) {
  const { lat, lng , duration_flight} = data;
  const [prevPos, setPrevPos] = useState([lat, lng]);

  // ejecutar lo que que esta dentro si se cambia los parametros despues de la ,
  useEffect(() => {
    if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng]);
  }, [lat, lng]);

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[lat, lng]}
      previousPosition={prevPos}
      // duration={(1000 * duration_flight ) / (400)}// // aqui antes el dividendo estaba en 360 * 32
      // el factor de conversion es (1 / 288) luego, como la duracion viene en minutos tenemos que
      // mostrarla a segundo osea * 60. El 1000 tambien es necesario ponerlo porque la duracion
      // esta en milisegundos.
      // duration={(0.003472) * duration_flight * 60 * 10} // esta duracion esta en milisegundos
      // duration={(0.003472) * duration_flight * 743.88} // Original de la presentacion
      duration={(0.003472) * duration_flight * 380 * 10} // sin tanta notoriedad los pasos
    />
  );
}