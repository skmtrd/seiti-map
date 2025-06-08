import { formatDateTime } from "@/functions/formatter";
import type { Comment } from "@/types/database";
import Image from "next/image";
import { Spacer } from "../common/Spacer";
import { Card, CardContent } from "../ui/card";

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = (props) => {
  const images = [
    props.comment.image_url_1,
    props.comment.image_url_2,
    props.comment.image_url_3,
    props.comment.image_url_4,
  ].filter((url): url is string => Boolean(url));

  const renderImages = () => {
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <div className="w-full">
          <Image
            src={images[0]}
            alt="comment"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {images.map((src) => (
            <Image
              key={src}
              src={src}
              alt="comment"
              width={300}
              height={300}
              className="w-full h-48 rounded-lg object-cover"
            />
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 h-96">
          <Image
            src={images[0]}
            alt="comment"
            width={300}
            height={400}
            className="w-full h-full rounded-lg object-cover"
          />
          <div className="flex flex-col gap-1">
            <Image
              src={images[1]}
              alt="comment"
              width={300}
              height={200}
              className="w-full h-full rounded-lg object-cover"
            />
            <Image
              src={images[2]}
              alt="comment"
              width={300}
              height={200}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </div>
      );
    }

    if (images.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {images.map((src) => (
            <Image
              key={src}
              src={src}
              alt="comment"
              width={300}
              height={300}
              className="w-full h-48 rounded-lg object-cover"
            />
          ))}
        </div>
      );
    }
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col">
        <div className="flex w-full justify-end">
          <div className="text-sm text-gray-500">{formatDateTime(props.comment.created_at)}</div>
        </div>
        {props.comment.content}
        {renderImages() && <Spacer height={5} />}
        {renderImages()}
      </CardContent>
    </Card>
  );
};
