import { ScrollArea } from "@/components/ui/scroll-area";
import { CDSData } from "./columns";
import { UniversityCard } from "./UniversityCard";

interface UniversityCardViewProps {
  data: CDSData[];
  onUniversityClick?: (university: CDSData) => void;
}

const UniversityCardView = ({
  data,
  onUniversityClick,
}: UniversityCardViewProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-1">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            표시할 대학교가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((university) => (
              <UniversityCard
                key={university.unitId}
                university={university}
                onClick={onUniversityClick}
                className="h-fit"
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default UniversityCardView;
