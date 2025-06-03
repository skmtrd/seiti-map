import { getWorks } from "@/app/actions/work";
import { WorkSelector } from "@/components/Sidebar/WorkSelector";

export async function Toolbar() {
  const works = await getWorks();
  return (
    <div className="w-96 rounded-4xl p-4">
      <div className="flex items-center justify-between">
        <WorkSelector works={works} />
      </div>
    </div>
  );
}
