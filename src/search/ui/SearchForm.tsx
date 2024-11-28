import { memo } from "react";
import { SearchOption } from "../model/Search";
import { HStack } from "@chakra-ui/react";
import { GRADE_OPTIONS, DAY_OPTIONS, TIME_SLOTS } from "../model/constants";
import { ComplexFilterGroup } from "./ComplexFilterGroup";
import { CreditSelect } from "./CreditSelect";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";
import { SearchInput } from "./SearchInput";

interface SearchFormProps {
  searchOptions: SearchOption;
  updateSearchOptions: {
    updateSearchQuery: (query: string) => void;
    updateSearchGrades: (grades: number[]) => void;
    updateSearchDays: (days: string[]) => void;
    updateSearchTimes: (times: number[]) => void;
    updateSearchMajors: (majors: string[]) => void;
    updateSearchCredits: (credits: number | undefined) => void
  }
  allMajors: string[];
}

export const SearchForm = memo(({ searchOptions, updateSearchOptions, allMajors }: SearchFormProps) => {
  const {
    updateSearchQuery,
    updateSearchGrades,
    updateSearchDays,
    updateSearchTimes,
    updateSearchMajors,
    updateSearchCredits
  } = updateSearchOptions;
  return (
    <>
      <HStack spacing={4}>
        <SearchInput
          value={searchOptions.query}
          onChange={updateSearchQuery}
        />
        <CreditSelect
          value={searchOptions.credits}
          onChange={updateSearchCredits}
        />
      </HStack>

      <HStack spacing={4}>
        <FilterCheckboxGroup
          label="학년"
          name="grades"
          options={GRADE_OPTIONS}
          value={searchOptions.grades}
          onChange={(values) => updateSearchGrades(values.map(Number))}
        />
        <FilterCheckboxGroup
          label="요일"
          name="days"
          options={DAY_OPTIONS}
          value={searchOptions.days}
          onChange={(values) => updateSearchDays(values as string[])}
        />
      </HStack>

      <HStack spacing={4}>
        <ComplexFilterGroup
          label="시간"
          options={TIME_SLOTS}
          value={searchOptions.times}
          onChange={(values) => updateSearchTimes(values.map(Number))}
          tagLabelFormatter={(time) => `${time}교시`}
          checkboxLabelFormatter={(option) => `${option.id}교시(${option.label})`}
        />
        <ComplexFilterGroup
          label="전공"
          options={allMajors.map(major => ({ id: major, label: major }))}
          value={searchOptions.majors}
          onChange={(values) => updateSearchMajors(values as string[])}
          tagLabelFormatter={(major) => String(major).split("<p>").pop() || ''}
          checkboxLabelFormatter={(option) => option.label.replace(/<p>/gi, ' ')}
        />
      </HStack>
    </>
  );
});