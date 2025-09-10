import { GroupBase, StylesConfig } from "react-select";

export type SelectOption = { label: string; value: string };

// Factory to generate base styles with proper typing for caller's Option type
export const getBaseSelectStyles = <TOption extends { label: string; value: string } = SelectOption>(): StylesConfig<TOption, false, GroupBase<TOption>> => ({
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "black" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "black" : "#9ca3af",
    },
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: 400,
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    height: "100%",
    alignContent: "center",
    borderRadius: 4,
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    backgroundColor: "white",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: 400,
    backdropFilter: "none",
    position: "absolute",
    width: "100%",
    transform: "translate3d(0, 0, 0)",
    WebkitTransform: "translate3d(0, 0, 0)",
    isolation: "isolate",
  }),

  menuList: (provided) => ({
    ...provided,
    zIndex: 9999,
    fontWeight: 400,
    padding: "0",
    fontSize: "14px",
    fontFamily: "inherit",
    maxHeight: "15rem",
    color: "black",
    borderRadius: "4px",
    backgroundColor: "white",
    opacity: "100%",
    filter: "none",
    "&::-webkit-scrollbar": {
      width: "0px",
      background: "transparent",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    overflowY: "auto",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
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
    fontFamily: "inherit",
    fontWeight: 400,
    zIndex: 10000,
    transition: "all 50ms",
    "&:active": {
      backgroundColor: "#2563eb",
    },
    "&:hover": {
      color: "white",
    },
    backdropFilter: "none",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280",
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: 400,
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "10px 10px",
    margin: "0",
    lineHeight: "20px",
    fontFamily: "inherit",
    fontWeight: 400,
  }),

  singleValue: (provided) => ({
    ...provided,
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
    color: "#000",
    fontFamily: "inherit",
    fontWeight: 400,
  }),

  input: (provided) => ({
    ...provided,
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
    padding: "0",
    fontFamily: "inherit",
    fontWeight: 400,
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    width: "20px",
    color: "black",
    height: "18px",
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
});

// Merge multiple style objects/functions into one StylesConfig
export function mergeSelectStyles<
  TOption extends { label: string; value: string } = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>
>(
  base: StylesConfig<TOption, IsMulti, Group>,
  ...overrides: Array<Partial<StylesConfig<TOption, IsMulti, Group>>>
): StylesConfig<TOption, IsMulti, Group> {
  // Shallow override per style key; last writer wins. This avoids composing
  // functions and keeps typings strict without using `any`.
  return Object.assign({}, base, ...overrides) as unknown as StylesConfig<TOption, IsMulti, Group>;
}


