import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationMap({ location }) {
  if (!location?.latitude) return null;

  const position = [location.latitude, location.longitude];

  return (
    <div className="rounded-xl overflow-hidden border border-ink/10 h-64 relative z-0">
      <MapContainer
        key={`${location.latitude}-${location.longitude}`}
        center={position}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}