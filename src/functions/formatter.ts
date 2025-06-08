export const getGoogleMapsUrl = (latitude: number, longitude: number, address: string) => {
  if (latitude && longitude) {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }
  if (address) {
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  }
  return null;
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
