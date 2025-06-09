import { PageBackButton } from "@/components/common/PageBackButton";
import { Spacer } from "@/components/common/Spacer";
import { SpotDetailCard } from "@/components/detail/SpotDetailCard";
import { CommentsList } from "@/components/detail/commentsList";
import { CreateCommentButton } from "@/components/detail/createCommentButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SpotDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ spotId: string }>;
  searchParams: Promise<{ tab: string }>;
}) {
  const { spotId } = await params;
  const { tab } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Spacer height={10} />
      <CreateCommentButton />
      <Tabs defaultValue={tab || "detail"}>
        <TabsList className="w-full">
          <TabsTrigger value="detail">詳細</TabsTrigger>
          <TabsTrigger value="comment">コメント</TabsTrigger>
        </TabsList>
        <Spacer height={5} />
        <TabsContent value="detail">
          <SpotDetailCard spotId={spotId} />
        </TabsContent>
        <TabsContent value="comment">
          <CommentsList spotId={spotId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
