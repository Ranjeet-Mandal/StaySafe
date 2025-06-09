

  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [77.1025, 28.7041],
    zoom: 9
  });
