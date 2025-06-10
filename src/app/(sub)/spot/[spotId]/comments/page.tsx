import { checkAuth } from "@/actions/auth";
import { CreateCommentForm } from "@/components/comments/CreateCommentForm";
import { PageBackButton } from "@/components/common/PageBackButton";
import { Spacer } from "@/components/common/Spacer";

export default async function CreatePage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  await checkAuth();
  const { spotId } = await params;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Spacer height={10} />
      <div className="w-full max-w-2xl">
        <CreateCommentForm spotId={spotId} />
      </div>
      <PageBackButton />
    </div>
  );
}
