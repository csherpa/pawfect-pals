import { api } from "~/utils/api";

interface TablePaginationProps {
  selectedFilters: string[];
  loadPrevPage: () => void;
  loadNextPage: () => void;
  from: number;
  size: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  selectedFilters,
  loadPrevPage,
  loadNextPage,
  from,
  size,
}) => {
  const totalNumber = api.dogs.searchDogs.useQuery({
    breeds: selectedFilters,
    size: size,
    from: from,
  }).data?.totalNumberOfResults as number;
  return (
    <>
      <div className="flex flex-col items-center p-8">
        <span className="text-sm text-white dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-white dark:text-white">
            {totalNumber}
          </span>{" "}
          Results
        </span>

        <div className="xs:mt-0 mt-2 inline-flex">
          <button
            disabled={from === 0 || from < size}
            onClick={loadPrevPage}
            className="flex h-10 items-center justify-center rounded-l bg-gray-800 px-4 text-base font-medium text-white hover:bg-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Prev
          </button>
          <button
            onClick={loadNextPage}
            className="flex h-10 items-center justify-center rounded-r border-0 border-l border-gray-700 bg-gray-800 px-4 text-base font-medium text-white hover:bg-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default TablePagination;
