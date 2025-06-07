export const getGoogleMapsUrl = (latitude: number, longitude: number, address: string) => {
  if (latitude && longitude) {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }
  if (address) {
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  }
  return null;
};
