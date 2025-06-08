import { Spacer } from "@/components/common/Spacer";
import { SpotDetailCard } from "@/components/detail/SpotDetailCard";
import { CommentsList } from "@/components/detail/commentsList";
import { CreateCommentButton } from "@/components/detail/createCommentButton";

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

      <CreateCommentButton />
      <Spacer height={10} />
      <h1 className="text-2xl font-bold">コメント一覧</h1>
      <Spacer height={7} />
      <CommentsList spotId={spotId} />
    </div>
  );
}
