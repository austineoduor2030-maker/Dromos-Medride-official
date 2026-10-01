// Loads the Google Maps JavaScript API (with Places) exactly once,
// and returns a promise that resolves once window.google is ready.
let mapsPromise = null;

export function loadGoogleMaps() {
  if (mapsPromise) return mapsPromise;

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Promise.reject(
      new Error('Missing VITE_GOOGLE_MAPS_API_KEY in your .env file.')
    );
  }

  mapsPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Google Maps failed to load.'));
    document.head.appendChild(script);
  });

  return mapsPromise;
}