import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../Settings/LanguageContext.tsx';
import axios from 'axios';
import DataView, { DataItem } from './DataView.tsx';
import SearchForm from './SearchForm.tsx';
import formDate, { formDateWithoutTime } from '../../utils/formDate.ts';
import TagForm from '../TagManagement/TagForm.tsx';
import { OptionType } from '../../utils/LabelDropdown.tsx';

interface DataFormProps {
  // reset: boolean;
  onSearch: (query: { name: string; labelData: OptionType[]; time: string }) => void;
}

const DataForm: React.FC<DataFormProps> = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [labelData, setLabelData] = useState<any[]>([]);
  const [time, setTime] = useState('');
  const [times, setTimes] = useState<string[]>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  

  const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    setReset(false);
    if (event) {
      event.preventDefault();
    }

    let url = 'http://localhost:3001/api/data';
    const params = new URLSearchParams();
    let selectedLabelsId: string[] = [];
    if (name) {
      params.append('name', name);
    }

    if (selectedOptions) {
      selectedLabelsId = selectedOptions.map(option => option.value);
      
      console.log("selected labels: " + selectedLabelsId);
    }
    if (time) {
      params.append('time', time);
    }

    if (params.toString()) {
      url += '?' + params.toString();
    }

    console.log("request url: " + url);
    axios.post(url, selectedLabelsId)
      .then(response => {
        const data = response.data;
        // console.log(data[0]);
        setData(data);
        if (!params.toString() && !selectedLabelsId.length) {
          // 如果搜索的是全部数据，则提取times和labels

          const newTimes = data.map((item: DataItem) => formDateWithoutTime(item.addTime));
          const uniqueTimes = Array.from(new Set(newTimes));
          uniqueTimes.push('');
          uniqueTimes.sort();
          setTimes(uniqueTimes as string[]);
        }
      })
      .catch(error => console.error(error));
  };

  const handleSearchLabel = () => {
    let url = 'http://localhost:3001/api/label';
    console.log("request url: " + url);
    axios.post(url)
      .then(response => {
        const labelData = response.data;
        const labels = labelData.map((item: any) => item.labelname).sort();
        setLabelData(labelData);
        setLabels(labels);
      })
      .catch(error => console.error(error));
  };

  const handleSelectedOptionsChange = (newSelectedOptions: OptionType[]) => {
    setSelectedOptions(newSelectedOptions);
    // console.log("new selected options: " + newSelectedOptions);
  };

  const [reset, setReset] = useState(false);
  const handleReset = () => {
    setReset(true);
    // console.log("reset: " + reset);
    setName('');
    // setLabels('');
    setSelectedOptions([]);
    setTime('');

  };

  useEffect(() => {
    handleSearch();

  }, []);

  const { language } = useContext(LanguageContext);

  return (
    <div className='data-form'>
      <SearchForm 
        name={name}
        reset={reset}
        // labels={labels}
        labelData={labelData}
        time={time}
        times={times}
        handleSearch={handleSearch}
        handleSearchLabel={handleSearchLabel}
        handleReset={handleReset}
        setName={setName}
        setLabels={setLabels}
        setTime={setTime}
        onSelectedOptionsChange={setSelectedOptions}
      />
      <DataView
        data={data}
        handleSearch={handleSearch}
      />
    </div>

  );
};

export default DataForm;