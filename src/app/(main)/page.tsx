import { getUser } from "@/app/actions/auth";
import RootPage from "@/components/map/MapPage";

const Page = async () => {
  const user = await getUser();
  return <RootPage userAuthenticated={user !== null} />;
};

export default Page;
