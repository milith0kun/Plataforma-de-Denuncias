import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapaPicker.module.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

/**
 * MapaPicker - Componente para seleccionar ubicación en mapa interactivo
 * @param {Object} props
 * @param {Object} props.ubicacion - {lat, lng} ubicación actual
 * @param {Function} props.onChange - Callback cuando cambia la ubicación
 * @param {number} props.zoom - Nivel de zoom inicial (default: 13)
 * @param {string} props.className - Clase CSS adicional
 */
function MapaPicker({ ubicacion, onChange, zoom = 13, className = '' }) {
  const [position, setPosition] = useState(ubicacion || { lat: -12.0464, lng: -77.0428 }); // Lima, Perú por defecto
  const [obteniendo, setObteniendo] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const [ubicacionObtenida, setUbicacionObtenida] = useState(false);
  const mapRef = useRef(null);

  // Actualizar posición cuando cambia la prop ubicacion
  useEffect(() => {
    if (ubicacion && (ubicacion.lat !== position.lat || ubicacion.lng !== position.lng)) {
      setPosition(ubicacion);
    }
  }, [ubicacion]);

  // No obtener ubicación automáticamente - el usuario debe hacer clic en el botón
  // useEffect(() => {
  //   if (!ubicacion && !ubicacionObtenida) {
  //     obtenerUbicacionActual();
  //   }
  // }, []);

  // Obtener ubicación actual del usuario
  const obtenerUbicacionActual = () => {
    setObteniendo(true);
    setErrorUbicacion(null);

    if (!navigator.geolocation) {
      setErrorUbicacion('La geolocalización no está soportada en tu navegador');
      setObteniendo(false);
      setUbicacionObtenida(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newPos);
        onChange(newPos);
        setObteniendo(false);
        setUbicacionObtenida(true);

        // Centrar el mapa en la nueva posición
        if (mapRef.current) {
          mapRef.current.setView([newPos.lat, newPos.lng], zoom);
        }
      },
      (error) => {
        let mensaje = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensaje = 'Para usar tu ubicación actual, activa los permisos de ubicación en tu navegador. También puedes hacer clic en el mapa para seleccionar manualmente.';
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = 'No se pudo determinar tu ubicación. Puedes seleccionar manualmente haciendo clic en el mapa.';
            break;
          case error.TIMEOUT:
            mensaje = 'La búsqueda de ubicación tardó demasiado. Intenta de nuevo o selecciona manualmente en el mapa.';
            break;
          default:
            mensaje = 'No se pudo obtener tu ubicación. Puedes seleccionar manualmente haciendo clic en el mapa.';
        }
        setErrorUbicacion(mensaje);
        setObteniendo(false);
        setUbicacionObtenida(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Manejar selección de ubicación en el mapa
  const handleLocationSelect = (latlng) => {
    const newPos = { lat: latlng.lat, lng: latlng.lng };
    setPosition(newPos);
    onChange(newPos);
  };

  // Manejar arrastre del marcador
  const handleMarkerDrag = (e) => {
    const marker = e.target;
    const newPos = marker.getLatLng();
    const pos = { lat: newPos.lat, lng: newPos.lng };
    setPosition(pos);
    onChange(pos);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Ubicación de la denuncia</h3>
        <button
          type="button"
          onClick={obtenerUbicacionActual}
          disabled={obteniendo}
          className={styles.btnUbicacion}
          title="Obtener mi ubicación actual"
        >
          {obteniendo ? '🔄 Obteniendo...' : '📍 Mi ubicación'}
        </button>
      </div>

      {errorUbicacion && (
        <div className={styles.warning}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{errorUbicacion}</span>
        </div>
      )}

      <div className={styles.coordenadas}>
        <span className={styles.coordLabel}>Coordenadas:</span>
        <span className={styles.coordValue}>
          Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
        </span>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={zoom}
          className={styles.map}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <Marker
            position={[position.lat, position.lng]}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDrag,
            }}
          />
        </MapContainer>
      </div>

      <p className={styles.instrucciones}>
        💡 <strong>Tip:</strong> Haz clic en el mapa o arrastra el marcador para ajustar la ubicación exacta de tu denuncia.
      </p>
    </div>
  );
}

export default MapaPicker;
