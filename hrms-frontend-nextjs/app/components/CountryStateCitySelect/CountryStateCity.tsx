"use client";

import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
} from "@/lib/cscApi";
import { useEffect, useState } from "react";

import Select, {
  StylesConfig,
  GroupBase,
  OptionProps,
  SingleValueProps,
  MultiValueProps,
} from "react-select";
type Option = {
  value: string;
  label: string;
};

interface Props {
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
}
const CountryStateCity: React.FC<Props> = ({
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
})=> {
  const [countries, setCountries] = useState<Option[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [statesList, setStatesList] = useState<Option[]>([]);
  const [citiesList, setCitiesList] = useState<Option[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStatesLoading, setIsStatesLoading] = useState<boolean>(false);
  const [isCitiesLoading, setIsCitiesLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch countries only once
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const data = await getCountries();
        const formattedCountries = data.map(
          (country: { iso2: string; name: string }) => ({
            value: country.iso2,
            label: country.name,
          })
        );
        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle country change and fetch states
  const handleCountryChange = async (selectedCountry: Option | null) => {
    if (!selectedCountry) {
      setSelectedCountryCode("");
      setCountry("");
      setState("");
      setCity("");
      setStatesList([]);
      setCitiesList([]);
      return;
    }
    setSelectedCountryCode(selectedCountry.value);
    setCountry(selectedCountry.label);
    setState("");
    setCity("");
    setStatesList([]); // Clear previous states and cities
    setCitiesList([]);
    setIsStatesLoading(true);

    try {
      const data = await getStatesByCountry(selectedCountry.value);
      // Sort the states alphabetically by name before setting the state list
      const stateData = data
        .map((state: { iso2: string; name: string }) => ({
          value: state.iso2,
          label: state.name,
        }))
        .sort((a: Option, b: Option) => a.label.localeCompare(b.label));

      setStatesList(stateData);
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setIsStatesLoading(false);
    }
  };
  useEffect(() => {
    const handleStates = ()=>{

    
    if(!country){
      return;
    }
    setStatesList([])
    setCitiesList([])
    setState("")
    setCity("")
    setIsStatesLoading(true);

  }
  handleStates
    

  }, [])
  

  // Handle state change and fetch cities
  const handleStateChange = async (selectedState: Option | null) => {
    if (!selectedState) {
      setCitiesList([]);
      //   setState("");
      setCity("");
      return;
    }
    setCity("");
    setState(selectedState.label);
    setIsCitiesLoading(true);
    setCitiesList([]); // Clear previous cities

    try {
      const data = await getCitiesByState(
        selectedCountryCode,
        selectedState.value
      );
      const cityData = data.map((city: { name: string }) => ({
        value: city.name,
        label: city.name,
      }));
      setCitiesList(cityData);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsCitiesLoading(false);
    }
  };

  const handleCityChange = (selectedCity: Option | null) => {
    if (!selectedCity) {
      setCity("");
      return;
    }
    setCity(selectedCity.label);
  };

  useEffect(() => {
    if (!country || !state) {
      setStatesList([]);
      setCitiesList([]);
      return;
    }

    if (!state) {
      setCitiesList([]);
      return;
    }
   
  }, [country, state, city]);

  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "black" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "black" : "#9ca3af",
      },
      fontSize: "14.5px",
      // fontWeight: "400",
      backdropFilter: "none", // Explicitly remove any blur
      WebkitBackdropFilter: "none", // For Safari
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
      backgroundColor: "white",
      borderRadius: ".6rem",
      fontSize: "14.5px",
      backdropFilter: "none", // Explicitly remove any blur
      position: "absolute", // Ensure proper positioning
      width: "100%",
      transform: "translate3d(0, 0, 0)", // Force GPU acceleration
      WebkitTransform: "translate3d(0, 0, 0)",
      isolation: "isolate", // Create new stacking context
    }),

    menuList: (provided) => ({
      ...provided,
      zIndex: 9999,
      fontFamily:"sans-serif",
      fontWeight:"0",
      padding: "0",
      fontSize: "14.5px",
      maxHeight: "15rem",
      color: "black",
      borderRadius: ".6rem",
      backgorundColor: "white",
      opacity: "100%",
      filter: "none",
      "&::-webkit-scrollbar": {
        width: "0px",
        background: "transparent",
      },
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      overflowY: "auto",
      backdropFilter: "none", // Explicitly remove any blur
      WebkitBackdropFilter: "none", // For Safari
     
    }),

    // Individual option in the dropdown
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b92f6"
        : state.isFocused
        ? "#2372f5"
        : "white",
      cursor: "pointer",
      fontWeight:"0",
      fontFamily:"sans-serif",
      zIndex: 10000,
      transition: "all 50ms",
      "&:active": {
        backgroundColor: "#2563eb",
      },
      "&:hover": {
        color: "white",
      },
      backdropFilter: "none", // Explicitly remove any blur
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "black", // text-gray-400
      fontSize: "14.5px", // text-sm
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,

      // transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
      // transition: "transform 150ms ease",
      width: "20px",
      color: "black",
      height: "18px", // w-5
      padding: "0",
      scale: "0.8",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingRight: "1px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex max-[500px]:gap-[20px] gap-[10px] max-[500px]:flex-col flex-row w-[100%]">
        {/* Country Select */}
        <Select
          className="max-[500px]:w-full w-1/2"
          options={countries}
          styles={customStyles}
          value={country ? { value: country, label: country } : null}
          onChange={handleCountryChange}
          placeholder="Select a country"
          isLoading={isLoading} // Show loading state for countries
        />

        {/* State Select */}
        <Select
          className="max-[500px]:w-full w-1/2"
          options={statesList}
          styles={customStyles}
          onChange={handleStateChange}
          value={state ? { value: state, label: state } : null}
          placeholder="Select a state"
          isLoading={isStatesLoading} // Show loading state for states
          isDisabled={isStatesLoading || statesList.length === 0}
        />
      </div>
      <div className="flex gap-[10px]">
        {/* City Select */}
        <Select
          className="max-[500px]:w-full w-1/2 max-[500px]:pr-0 pr-[5px]"
          options={citiesList}
          styles={customStyles}
          onChange={handleCityChange}
          placeholder="Select a city"
          value={city ? { value: city, label: city } : null}
          isLoading={isCitiesLoading} // Show loading state for cities
          isDisabled={isCitiesLoading || citiesList.length === 0}
        />
      </div>
    </div>
  );
};

export default CountryStateCity;
