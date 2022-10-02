import { Marker } from 'leaflet';
import { AirportLocation } from '../AirportLocation/AirportLocation';
import React from 'react'

const Markers = () => {
  return (
    <Marker position={{lat:-12.0219,lng:-77.1112}} img={AirportLocation}></Marker>
  )
}

export default Markers;