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
  return (
    <div className="flex gap-2 rounded-lg bg-primary p-1.5">
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
