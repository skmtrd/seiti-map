import { checkAuth } from "@/actions/auth";
import { CreateCommentForm } from "@/components/comments/CreateCommentForm";
import { Spacer } from "@/components/common/Spacer";

export default async function CreatePage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  await checkAuth();
  const { spotId } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Spacer height={10} />
      <h1 className="text-2xl font-bold mb-8">コメントを投稿</h1>
      <CreateCommentForm spotId={spotId} />
    </div>
  );
}
