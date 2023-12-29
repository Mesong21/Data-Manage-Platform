import React, { useContext, useEffect, useState } from 'react';
import formDate from '../../utils/formDate.ts';
import LabelDropdown from '../../utils/LabelDropdown.tsx';
import axios from 'axios';
import { OptionType } from '../../utils/LabelDropdown.tsx';
import { LanguageContext } from '../Settings/LanguageContext.tsx';

interface SearchFormProps {
  name: string;
  // labels: string[];
  labelData: any[];
  time: string;
  times: string[];
  reset: boolean;
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSearchLabel: () => void;
  handleReset: () => void;
  setName: (name: string) => void;
  setLabels: (labels: string[]) => void;
  setTime: (time: string) => void;
  onSelectedOptionsChange: (selectedOptions: OptionType[]) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  name,
  // labels,
  labelData,
  time,
  times,
  handleSearch,
  handleSearchLabel,
  handleReset,
  setName,
  reset,
  setTime,
  onSelectedOptionsChange
}) => {

  useEffect(() => {
    handleSearchLabel();
  }, []);

  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  const handleSelectedOptionsChange = (newSelectedOptions: OptionType[]) => {
    setSelectedOptions(newSelectedOptions);
    onSelectedOptionsChange(newSelectedOptions);
  };

  const { language } = useContext(LanguageContext);
  return (
    <form className='search-form' onSubmit={handleSearch}>
      <label className='search-form-name'>
        {language === 'zh' ? '名称: ' : 'Name: '}
        <input placeholder={language === 'zh' ? '请输入搜索名称' : 'Please enter name'}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)} />
      </label>
      <LabelDropdown
        allLabelData={labelData}
        reset={reset}
        onSelectedOptionsChange={handleSelectedOptionsChange}
      />
      <label className='search-form-time'>
        {language === 'zh' ? '添加时间: ' : 'Add Time: '}
        <select
          value={time}
          onChange={e => setTime(e.target.value)}
          className='search-form-time-select'
        >
          {times.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
      <button
        className='search-form-submit'
        type="submit">{language === 'zh' ? '搜索' : 'Search'}</button>
      <button
        className='search-form-reset'
        type="button"
        onClick={handleReset}
        title={language === 'zh' ? '重新搜索以显示结果' : 'Need to Search Again'}
      >
        {language === 'zh' ? '重置' : 'Reset'}
      </button>
    </form>
  );
};

export default SearchForm;