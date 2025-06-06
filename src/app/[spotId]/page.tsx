import { getUser } from "@/actions/auth";
import { getSpotDetail } from "@/actions/spot";
import { PageBackButton } from "@/components/common/PageBackButton";
import { Spacer } from "@/components/common/Spacer";
import { SpotDetailCard } from "@/components/detail/SpotDetailCard";

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  const { spotId } = await params;

  const spot = await getSpotDetail(spotId);
  const user = await getUser();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Spacer height={10} />
      <SpotDetailCard spot={spot} userAuthenticated={user !== null} />
      <PageBackButton />
    </div>
  );
}
