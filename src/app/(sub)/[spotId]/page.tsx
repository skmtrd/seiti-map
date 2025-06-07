import { PageBackButton } from "@/components/common/PageBackButton";
import { Spacer } from "@/components/common/Spacer";
import { SpotDetailCard } from "@/components/detail/SpotDetailCard";

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  const { spotId } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Spacer height={10} />
      <SpotDetailCard spotId={spotId} />
    </div>
  );
}
