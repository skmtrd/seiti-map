import { checkAuth } from "@/actions/auth";
import { Spacer } from "@/components/common/Spacer";
import { CreateSpotForm } from "@/components/create/CreateSpotForm";

export default async function CreatePage() {
  await checkAuth();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Spacer height={10} />
      <CreateSpotForm />
    </div>
  );
}
