import { MapPage } from "@/components/main/MapPage";

const Page = async ({
  searchParams,
}: { searchParams: Promise<{ lat: string; lng: string; open: string }> }) => {
  const { lat, lng, open } = await searchParams;
  return <MapPage lat={lat} lng={lng} openSpotId={open} />;
};

export default Page;
