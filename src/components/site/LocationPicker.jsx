import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../lib/loadGoogleMaps';

const NAIROBI = { lat: -1.286389, lng: 36.817223 };

// A small inline map: search a place or click/drag the pin to set the
// exact pickup location. Calls onPick({ lat, lng, label }) whenever the
// pin changes. Needs VITE_GOOGLE_MAPS_API_KEY in your .env file.
export default function LocationPicker({ onPick }) {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);
  const mapObjRef = useRef(null);
  const geocoderRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled) return;
        const map = new google.maps.Map(mapRef.current, {
          center: NAIROBI,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
        });
        mapObjRef.current = map;
        geocoderRef.current = new google.maps.Geocoder();

        const marker = new google.maps.Marker({
          map,
          position: NAIROBI,
          draggable: true,
        });
        markerRef.current = marker;

        const reverseGeocodeAndEmit = (latLng) => {
          geocoderRef.current.geocode({ location: latLng }, (results, status2) => {
            const label = status2 === 'OK' && results[0] ? results[0].formatted_address : '';
            onPick({ lat: latLng.lat(), lng: latLng.lng(), label });
          });
        };

        map.addListener('click', (e) => {
          marker.setPosition(e.latLng);
          reverseGeocodeAndEmit(e.latLng);
        });
        marker.addListener('dragend', () => reverseGeocodeAndEmit(marker.getPosition()));

        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            fields: ['geometry', 'formatted_address'],
            componentRestrictions: { country: 'ke' },
          });
          autocomplete.bindTo('bounds', map);
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;
            map.panTo(place.geometry.location);
            map.setZoom(16);
            marker.setPosition(place.geometry.location);
            onPick({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              label: place.formatted_address || inputRef.current.value,
            });
          });
        }

        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrMsg(err.message);
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, [onPick]);

  if (status === 'error') {
    return (
      <div className="hint" style={{ color: 'var(--text-faint)' }}>
        Map unavailable ({errMsg}). You can still type the pickup address above.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <input
        ref={inputRef}
        placeholder="Search for a place in Kenya…"
        style={{ marginBottom: 8 }}
      />
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: 260,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--cream)',
        }}
      />
      {status === 'loading' && <div className="hint">Loading map…</div>}
      {status === 'ready' && <div className="hint">Tap the map or drag the pin to set the exact pickup point.</div>}
    </div>
  );
}