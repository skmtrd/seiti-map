import { checkAuth } from "@/app/actions/auth";
import { getSpotDetail } from "@/app/actions/spot";
import { PageBackButton } from "@/components/common/PageBackButton";
import { SpotDetailCard } from "@/components/spots/SpotDetailCard";

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  const { spotId } = await params;

  await checkAuth();

  const spot = await getSpotDetail(spotId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SpotDetailCard spot={spot} />
      <PageBackButton />
    </div>
  );
}
