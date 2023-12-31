import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";

type SingleBreedFilter = {
  value: string;
  paramLabel: string;
};

interface BreedFiltersProps {
  clearSelectedFilters: () => void;
}

const BreedFilters: React.FC<BreedFiltersProps> = ({
  clearSelectedFilters,
}) => {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState([] as SingleBreedFilter[]);

  const getBreedFilter = () => {
    const queryBreedfilters = [] as SingleBreedFilter[];
    const keys = Object.keys(router.query).filter((k) => k === "breeds");
    keys.forEach((key) => {
      const values = (router.query[key] as string).split("_");
      const singleFilters = values.map((filter) => {
        return { paramLabel: key, value: filter };
      });
      queryBreedfilters.push(...singleFilters);
    });
    setActiveFilters([...queryBreedfilters]);
  };

  useEffect(getBreedFilter, [router.query]);

  return (
    <div className="my-4 flex cursor-pointer flex-row flex-wrap">
      {activeFilters.map((filter: SingleBreedFilter) => {
        return (
          <div
            key={filter.value}
            className="my-1 mr-2 flex h-9 items-center rounded-md bg-[#E3E3E3] px-2 py-1"
          >
            <p className="font-base p-1.5 text-sm font-semibold text-[#383838]">
              {filter.value}
            </p>
          </div>
        );
      })}
      {activeFilters.length > 0 ? (
        <button
          className="font-base text-md ml-3.5 p-1.5 font-semibold text-[#E3E3E3]"
          onClick={clearSelectedFilters}
        >
          Clear All
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BreedFilters;
