import React, { useContext } from 'react';
import Select, { ActionMeta } from 'react-select';
import { LanguageContext } from '../components/Settings/LanguageContext.tsx';

interface OptionType {
  value: string;
  label: string;
}


interface LabelDropdownProps {
  // labelData: any[];
  allLabelData: any[];
  onSelectedOptionsChange: (selectedOptions: OptionType[]) => void;
  reset: boolean;
}
const LabelDropdown: React.FC<(LabelDropdownProps)> = ({ allLabelData, onSelectedOptionsChange, reset }) => {
  const options: OptionType[] = allLabelData.map((item, index) => ({ value: item.labelid, label: item.labelname }));
  const [selectedOptions, setSelectedOptions] = React.useState<OptionType[]>([]);

  const handleChange = (selectedOptions: readonly OptionType[] | null, actionMeta: ActionMeta<OptionType>) => {
    const newSelectedOptions = Array.from(selectedOptions || []);
    setSelectedOptions(newSelectedOptions);
    onSelectedOptionsChange(newSelectedOptions);

  };

  React.useEffect(() => {
    if (reset) {
      setSelectedOptions([]);
    }
  }, [reset]);

  const { language } = useContext(LanguageContext);
  return (
    <div className='search-form-label label-dropdown'>
      <div>{language === 'zh' ? '选择标签: ' : 'Select a Label: '}</div>
      <div>
        <Select
          isMulti
          name="labels"
          options={options}
          className="basic-multi-select select"
          classNamePrefix="select"
          onChange={handleChange}
          value={selectedOptions}
        />
      </div>
    </div>
  );
};

export default LabelDropdown;
export { OptionType };