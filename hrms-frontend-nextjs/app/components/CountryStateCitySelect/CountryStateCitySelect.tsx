"use client";

import {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
} from "@/lib/countryStateCityApi";
import { useEffect, useState } from "react";
import { showToast } from "@/utils/toastHelper";
import { EmployeeListItem } from "@/types/types";

import Select from "react-select";
import { getBaseSelectStyles } from "@/lib/reactSelectStyles";

type LoadingState = {
  countries: boolean;
  states: boolean;
  cities: boolean;
};

type Option = {
  label: string;
  value: string;
};

interface Props {
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  stateCode: string;
  setStateCode: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  hasFetched: boolean;
  sethasFetched: React.Dispatch<React.SetStateAction<boolean>>;
  employeeData: EmployeeListItem | null;
  errors?: {
    country?: string;
    state?: string;
    city?: string;
  };
  handleTooltipPosition: (e: React.MouseEvent<HTMLParagraphElement>) => void;
}
const CountryStateCitySelect: React.FC<Props> = ({
  country,
  setCountry,
  countryCode,
  setCountryCode,
  state,
  setState,
  stateCode,
  setStateCode,
  city,
  setCity,
  hasFetched,
  sethasFetched,
  employeeData,
  errors,
  handleTooltipPosition,
}) => {
  const [countries, setCountries] = useState<Option[]>([]);
  const [statesList, setStatesList] = useState<Option[]>([]);
  const [citiesList, setCitiesList] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    countries: false,
    states: false,
    cities: false,
  });

  // Fetch countries only once when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      // console.log("Fetching initial countries");
      try {
        setIsLoading((prev) => ({ ...prev, countries: true }));
        const fetchedCountries = await getCountries();
        const formattedCountries = fetchedCountries.map(
          (country: { iso2: string; name: string }) => ({
            label: country.name,
            value: country.iso2,
          })
        );
        setCountries(formattedCountries);
        sethasFetched(true);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        sethasFetched(false);
      } finally {
        setIsLoading((prev) => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch states when component mounts in case of predefined country (via employeeData)
  useEffect(() => {
    const fetchStates = async () => {
      if (!employeeData || !employeeData.countryCode) return; // Ensure we are only fetching initial states when we have preexisting data passed in

      setIsLoading((prev) => ({ ...prev, states: true }));
      // console.log("Fetching initial states");
      try {
        const fetchedStates = await getStatesByCountry(
          employeeData.countryCode // Use preexisting country code
        );

        if (fetchedStates.length === 0) {
          // Fallback if no states exist, use country as state
          setStatesList([
            { label: employeeData.country, value: employeeData.countryCode },
          ]);
          return;
        }
        const formattedStates = fetchedStates
          .map((state: { iso2: string; name: string }) => ({
            label: state.name,
            value: state.iso2,
          }))
          .sort((a: Option, b: Option) => a.label.localeCompare(b.label));

        setStatesList(formattedStates);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, states: false }));
      }
    };
    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch cities when component mounts in case of predefined state (via employeeData) with a state code defined
  useEffect(() => {
    const fetchCities = async () => {
      if (
        !employeeData ||
        !employeeData.countryCode ||
        !employeeData.state ||
        !employeeData.stateCode
      )
        return; // Ensure we are only fetching cities for the initial state (if the case)

      setIsLoading((prev) => ({ ...prev, cities: true }));
      // console.log("Fetching initial cities");
      try {
        const fetchedCities = await getCitiesByState(
          employeeData.countryCode,
          employeeData.stateCode // Use preexisting state code
        );

        //If no city for the selected state then, the state is displayed as city.
        if (fetchedCities.length === 0) {
          setCitiesList([
            { label: employeeData.state, value: employeeData.stateCode },
          ]);
          return;
        }
        const formattedCities = fetchedCities.map((city: { name: string }) => ({
          label: city.name,
          value: city.name,
        }));
        setCitiesList(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle country change and adjust states list accordingly
  const handleCountryChange = async (selectedCountry: Option | null) => {
    if (!selectedCountry) {
      setCountry("");
      setCountryCode("");
      setState("");
      setStateCode("");
      setCity("");
      setStatesList([]);
      setCitiesList([]);
      return;
    }
    setCountry(selectedCountry.label);
    setCountryCode(selectedCountry.value);
    // Clear previous states and cities
    setState("");
    setStateCode("");
    setCity("");
    setStatesList([]);
    setCitiesList([]);
    setIsLoading((prev) => ({ ...prev, states: true }));

    try {
      const fetchedStates = await getStatesByCountry(selectedCountry.value);

      //If no state for the selected country, then the country is displayed as state.
      if (fetchedStates.length === 0) {
        setStatesList([
          { label: selectedCountry.label, value: selectedCountry.value },
        ]);
        return;
      }

      // Format and sort the states alphabetically by name before setting the state list
      const formattedStates = fetchedStates
        .map((state: { iso2: string; name: string }) => ({
          label: state.name,
          value: state.iso2,
        }))
        .sort((a: Option, b: Option) => a.label.localeCompare(b.label));

      setStatesList(formattedStates);
    } catch (error) {
      console.error("Error fetching states:", error);
      showToast("error", "Failed to fetch states.", [
        "Please try again later or inform the technical team.",
      ]);
    } finally {
      setIsLoading((prev) => ({ ...prev, states: false }));
    }
  };

  // Handle state change and adjust cities accordingly
  const handleStateChange = async (selectedState: Option | null) => {
    if (!selectedState) {
      setState("");
      setStateCode("");
      setCitiesList([]);
      setCity("");
      return;
    }
    setState(selectedState.label);
    setStateCode(selectedState.value);
    setCity("");
    setCitiesList([]); // Clear previous cities
    setIsLoading((prev) => ({ ...prev, cities: true }));

    try {
      const fetchedCities = await getCitiesByState(
        countryCode,
        selectedState.value
      );

      //If no city for the selected state then, the state is displayed as city.
      if (fetchedCities.length === 0) {
        setCitiesList([
          { label: selectedState.label, value: selectedState.value },
        ]);
        return;
      }
      const formattedCities = fetchedCities.map((city: { name: string }) => ({
        label: city.name,
        value: city.name,
      }));
      setCitiesList(formattedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      showToast("error", "Failed to fetch cities.", [
        "Please try again later or inform the technical team.",
      ]);
    } finally {
      setIsLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  const handleCityChange = (selectedCity: Option | null) => {
    if (!selectedCity) {
      setCity("");
      return;
    }
    setCity(selectedCity.label);
  };

  const handleCountryError = () => {
    if (!hasFetched) {
      showToast("error", "Failed to fetch countries, states and cities.", [
        "Please try again later or inform the technical team.",
      ]);
    }
  };

  const handleStateError = () => {
    if (!hasFetched) {
      showToast("error", "Failed to fetch countries, states and cities.", [
        "Please try again later or inform the technical team.",
      ]);
      return;
    }

    if (statesList.length === 0) {
      showToast("info", "", ["Select country first."]);
    }
  };

  const handleCityError = () => {
    if (!hasFetched) {
      showToast("error", "Failed to fetch countries, states and cities.", [
        "Please try again later or inform the technical team.",
      ]);
      return;
    }

    if (!country) {
      showToast("info", "", ["Select country and state first."]);
    } else if (citiesList.length === 0) {
      showToast("info", "", ["Select state first."]);
    }
  };

  const customStyles = getBaseSelectStyles<Option>();

    // Render all fields with internal layout management
  return (
    <div className="country-state-city-layout">
      {/* Country field - will be positioned alongside street */}
      <div 
        className={`input-wrapper ${errors?.country ? "error" : ""}`}
        onClick={handleCountryError}
      >
        <Select
          options={countries}
          styles={customStyles}
          value={country ? { label: country, value: countryCode } : null}
          onChange={handleCountryChange}
          placeholder="Country*"
          isLoading={isLoading.countries}
          isDisabled={isLoading.countries || !hasFetched}
        />
        {errors?.country && (
          <p
            className="error-message"
            data-tooltip={errors.country}
            onMouseEnter={handleTooltipPosition}
          >
            {errors.country}
          </p>
        )}
      </div>

      {/* State and City row */}
      <div className={`state-city-row ${errors?.state || errors?.city ? "hasErrors" : ""}`}>
        {/* State Select */}
        <div
          className={`input-wrapper ${errors?.state ? "error" : ""}`}
          onClick={handleStateError}
        >
          <Select
            options={statesList}
            styles={customStyles}
            onChange={handleStateChange}
            value={state ? { label: state, value: stateCode } : null}
            placeholder="State*"
            isLoading={isLoading.states}
            isDisabled={isLoading.states || statesList.length === 0}
          />
          {errors?.state && (
            <p
              className="error-message"
              data-tooltip={errors.state}
              onMouseEnter={handleTooltipPosition}
            >
              {errors.state}
            </p>
          )}
        </div>

        {/* City Select */}
        <div
          className={`input-wrapper ${errors?.city ? "error" : ""}`}
          onClick={handleCityError}
        >
          <Select
            options={citiesList}
            styles={customStyles}
            onChange={handleCityChange}
            placeholder="City*"
            value={city ? { label: city, value: city } : null}
            isLoading={isLoading.cities}
            isDisabled={isLoading.cities || citiesList.length === 0}
          />
          {errors?.city && (
            <p
              className="error-message"
              data-tooltip={errors.city}
              onMouseEnter={handleTooltipPosition}
            >
              {errors.city}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryStateCitySelect;
