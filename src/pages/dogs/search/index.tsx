import { type NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import DogResults from "~/components/DogResults";
import LogoutButton from "~/components/LogoutButton";
import Search from "~/components/Search";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SizeDropdown from "~/components/sizeDropDown";
import Sort from "~/components/Sort";
import { api } from "~/utils/api";
import { type Dog } from "~/server/api/models/dogs";

const DogsPage: NextPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const current = new URLSearchParams(searchParams.toString());

  const [size, setSize] = useState(20);

  const [from, setFrom] = useState(0);

  const [sortValue, setSortValue] = useState("Breed");

  const getparams = searchParams.get("breeds") ?? "";

  const selectedFilters = getparams
    .split("_")
    .filter((val: string) => val != "");

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
    from: from,
    size: size,
  }).data?.dogObj as unknown as Dog[];

  const handleSortChange = (value: string) => {
    setSortValue(value);
    switch (value) {
      case "age":
        searchDogs.sort((a, b) => a.age - b.age);
        break;
      case "name":
        searchDogs.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "zip_code":
        searchDogs.sort((a, b) => a.zip_code.localeCompare(b.zip_code));
        break;
      default:
        searchDogs.sort((a, b) => a.breed.localeCompare(b.breed));
    }
    current.set("sortBy", value);
    const sortUrl = `${router.pathname}?${current.toString()}`;
    void router.push(sortUrl, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>T3 Dogs App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="mt-10 flex  gap-3 px-24">
          <Search
            selectedFilters={selectedFilters}
            onHandleChange={onHandleChange}
          />
          <SizeDropdown size={size} setSize={setSize} current={current} />

          <LogoutButton />
        </div>

        <div>
          <div className="mt-9 flex justify-center gap-3">
            <button
              onClick={clearSelectedFilters}
              className="mt-6 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              Clear Breeds
            </button>
            <Sort sortValue={sortValue} handleSortChange={handleSortChange} />
          </div>
          <DogResults
            selectedFilters={selectedFilters}
            searchDogs={searchDogs}
            current={current}
            size={size}
            from={from}
            setFrom={setFrom}
          />
        </div>
      </main>
    </>
  );
};

export default DogsPage;
