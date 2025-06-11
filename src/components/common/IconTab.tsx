import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import { Button } from "../ui/button";

interface IconTabProps {
  options: {
    value: string;
    icon: React.ReactNode;
  }[];
  onChange: (value: string) => void;
  currentValue: string;
}

export const IconTab: React.FC<IconTabProps> = (props) => {
  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  return (
    <div className="flex gap-2 rounded-lg bg-primary p-1.5" ref={preventScroll}>
      {props.options.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          size="smIcon"
          onClick={() => props.onChange(option.value)}
          className={
            props.currentValue === option.value
              ? "bg-white text-black hover:bg-white/90"
              : "bg-transparent text-white hover:bg-white/10 hover:text-white"
          }
        >
          {option.icon}
        </Button>
      ))}
    </div>
  );
};
