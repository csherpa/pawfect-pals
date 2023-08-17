import { type NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import DogResults from "~/components/DogResults";
import Search from "~/components/Search";
import { useSearchParams } from "next/navigation";
import Sort from "~/components/Sort";
import { api } from "~/utils/api";
import { type Dog } from "~/server/api/models/dogs";
import { useDataContext } from "dataContext";
import SizeSort from "~/components/SizeSort";
import BreedFilters from "~/components/BreedFilters";
import Header from "~/components/Header";

const DogsPage: NextPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const current = new URLSearchParams(searchParams.toString());

  const getparams = searchParams.get("breeds") ?? "";

  const selectedFilters = getparams
    .split("_")
    .filter((val: string) => val != "");

  const getSize = searchParams.get("size") ?? "20";

  const getFrom = searchParams.get("from") ?? "0";

  const getSortBy = searchParams.get("sortBy") ?? "Breed";

  const clearSelectedFilters = () => {
    current.delete("breeds");
    const deletedBreeds = `${router.pathname}?${current.toString()}`;
    void router.push(deletedBreeds);
  };

  const onHandleChange = (selectedFilters: string[]) => {
    current.set("breeds", selectedFilters.join("_"));
    const newUrl = `${router.pathname}?${current.toString()}`;
    void router.push(newUrl, undefined, { shallow: true });
  };

  const searchDogs = api.dogs.searchDogs.useQuery({
    breeds: selectedFilters,
    from: Number(getFrom),
    size: Number(getSize),
  }).data?.dogObj as unknown as Dog[];

  const findMatch = api.dogs.searchDogs.useQuery({
    breeds: selectedFilters,
    from: Number(getFrom),
    size: Number(getSize),
  }).data?.match;

  const { setData } = useDataContext();

  if (searchDogs) {
    const matchedDog = searchDogs.find(
      (dogObj) => dogObj.id === findMatch?.match
    );
    setData(matchedDog);
  }

  const handleSortChange = (value: string) => {
    current.set("sortBy", value.replace(/ /g, "_"));
    const sortUrl = `${router.pathname}?${current.toString()}`;
    void router.push(sortUrl, undefined, { shallow: true });
  };

  const handleSelectChange = (value: number) => {
    const selectedSize = Number(value);
    current.set("size", selectedSize.toString());
    const sizeQueryUrl = `${router.pathname}?${current.toString()}`;
    void router.push(sizeQueryUrl, undefined, { shallow: true });
  };

  return (
    <>
      {!searchDogs ? (
        <>
          <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] font-bold text-white">
            Loading...
          </div>
          ;
        </>
      ) : (
        <>
          <Head>
            <title>PawfectPals App</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />
          <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="mt-10 flex flex-col justify-between gap-3 px-24 md:flex md:flex-row">
              <Search
                selectedFilters={selectedFilters}
                onHandleChange={onHandleChange}
              />
              <SizeSort
                getSize={getSize}
                handleSelectChange={handleSelectChange}
                current={current}
              />
              <Sort
                getSorBy={getSortBy}
                searchDogs={searchDogs}
                handleSortChange={handleSortChange}
              />
            </div>
            <div>
              <div className="mt-10 flex  gap-3">
                <BreedFilters clearSelectedFilters={clearSelectedFilters} />
              </div>
              <DogResults
                selectedFilters={selectedFilters}
                searchDogs={searchDogs}
                current={current}
                getSize={getSize}
                getFrom={getFrom}
              />
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default DogsPage;
