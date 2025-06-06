import { getUser } from "@/actions/auth";
import { MapPage } from "@/components/main/MapPage";

const Page = async () => {
  const user = await getUser();
  return <MapPage userAuthenticated={user !== null} />;
};

export default Page;
