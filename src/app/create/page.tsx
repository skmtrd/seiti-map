import { checkAuth } from "@/app/actions/auth";
import { getWorks } from "@/app/actions/work";
import { CreateSpotForm } from "@/components/spots/CreateSpotForm";

export default async function CreatePage() {
  await checkAuth();

  const works = await getWorks();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">新しいスポットを投稿</h1>
      <CreateSpotForm works={works} />
    </div>
  );
}
