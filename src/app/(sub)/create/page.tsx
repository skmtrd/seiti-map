import { checkAuth } from "@/actions/auth";
import { Spacer } from "@/components/common/Spacer";
import { CreateSpotForm } from "@/components/create/CreateSpotForm";

export default async function CreatePage() {
  await checkAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Spacer height={10} />
      <h1 className="text-2xl font-bold mb-8">新しいスポットを投稿</h1>
      <CreateSpotForm />
    </div>
  );
}
