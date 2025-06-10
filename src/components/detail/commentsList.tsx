"use client";

import { Spacer } from "@/components/common/Spacer";
import { useComments } from "@/hooks/SWR/useComments";
import { CommentCard } from "./CommentCard";

export const CommentsList = ({ spotId }: { spotId: string }) => {
  const { comments } = useComments(spotId);

  return (
    <div className="flex flex-col gap-4">
      {comments?.length === 0 ? (
        <>
          <div className="text-center text-gray-500">まだコメントがありません</div>
          <Spacer height={10} />
        </>
      ) : (
        comments?.map((comment) => <CommentCard key={comment.id} comment={comment} />)
      )}
    </div>
  );
};
