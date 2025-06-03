import { getUser } from "@/app/actions/auth";
import { MapPage } from "@/components/map/MapPage";

const Page = async () => {
  const user = await getUser();
  return <MapPage userAuthenticated={user !== null} />;
};

export default Page;
