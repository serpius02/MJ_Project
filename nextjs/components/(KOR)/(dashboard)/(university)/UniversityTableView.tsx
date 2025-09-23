import { ScrollArea } from "@/components/ui/scroll-area";
import { UniversityTable } from "./UniversityTable";
import { columns, CDSData } from "./columns";

interface UniversityTableViewProps {
  data: CDSData[];
}

const UniversityTableView = ({ data }: UniversityTableViewProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 sm:gap-4 p-1">
        <UniversityTable columns={columns} data={data} />
      </div>
    </ScrollArea>
  );
};

export default UniversityTableView;
