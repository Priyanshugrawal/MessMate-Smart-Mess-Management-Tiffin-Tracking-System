import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function MapTracker({ latitude, longitude, deliveryPerson }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const lat = latitude || 22.7196;
  const lng = longitude || 75.8577;

  useEffect(() => {
    const initMap = async () => {
      try {
        // Note: Replace with your actual Google Maps API key
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
          version: 'weekly',
        });

        await loader.load();

        const position = { lat, lng };
        
        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
        });

        // Custom marker icon (motorcycle/rider)
        const markerIcon = {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: 2,
          anchor: new window.google.maps.Point(12, 22),
        };

        // Create marker
        const marker = new window.google.maps.Marker({
          position,
          map,
          icon: markerIcon,
          title: deliveryPerson || 'Delivery Location',
          animation: window.google.maps.Animation.DROP,
        });

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${deliveryPerson || 'Delivery Person'}</h3>
              <p style="color: #666; font-size: 14px;">Current Location</p>
              <p style="color: #999; font-size: 12px;">Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setLoading(false);
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map. Check your API key.');
        setLoading(false);
      }
    };

    if (mapRef.current) {
      initMap();
    }
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const newPosition = { lat, lng };
      markerRef.current.setPosition(newPosition);
      mapInstanceRef.current.panTo(newPosition);
    }
  }, [lat, lng]);

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-[360px] flex items-center justify-center bg-gray-50">
          <div className="text-center p-6">
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Add VITE_GOOGLE_MAPS_API_KEY to frontend/.env</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
      <div ref={mapRef} className="h-[360px] w-full" />
    </div>
  );
}

export default MapTracker;

