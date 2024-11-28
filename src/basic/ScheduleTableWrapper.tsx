import ScheduleDndProvider from "./ScheduleDndProvider";
import ScheduleTableContent from "./ScheduleTableContent";
import { ScheduleTableWrapperProps } from "./ScheduleTables";
import { TableProvider } from "./TableContext";

export const ScheduleTableWrapper = ({
  tableId,
  index,
  setSearchInfo,
}: ScheduleTableWrapperProps) => {
  return (
    <TableProvider tableId={tableId}>
      <ScheduleDndProvider>
        <ScheduleTableContent
          tableId={tableId}
          index={index}
          setSearchInfo={setSearchInfo}
        />
      </ScheduleDndProvider>
    </TableProvider>
  );
};

export default ScheduleTableWrapper;
