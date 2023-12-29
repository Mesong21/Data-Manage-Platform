import React, { useContext, useState } from "react";
import DeleteConfirm from "../../utils/DeleteConfirm.tsx";
import EditData from "../../utils/EditData.tsx";
import axios from "axios";
import AddData from "../../utils/AddData.tsx";
import formDate from "../../utils/formDate.ts";
import { OptionType } from "../../utils/LabelDropdown.tsx";
import DataViewHeader from "./DataViewHeader.tsx";
import { LanguageContext } from "../Settings/LanguageContext.tsx";

type DataItem = {
  id: string;
  name: string;
  description: string;
  addTime: string;
  labelData: OptionType[];
};

type DataViewProps = {
  data: DataItem[];
  handleSearch: (event?: React.FormEvent<HTMLFormElement>) => void;
};

type LabelProps = {
  label: string;
};

const Label: React.FC<LabelProps> = ({ label }) => {
  return <span className='label-span'>{label} </span>;
};

const DataView: React.FC<DataViewProps> = ({ data, handleSearch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);

  // 计算页数据
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const handleEdit = (id: string, name: string, description: string, labelData: OptionType[], addTime: string) => {
    let url = 'http://localhost:3001/api/data/edit';
    const data = {
      id: id,
      name: name,
      description: description,
      labelData: labelData,
      // label: label,
      addTime: addTime
    };
    console.log(url);
    axios.put(url, data).then(() => {
      handleSearch();
    });
  };

  const handleDelete = (id: string) => {
    let url = 'http://localhost:3001/api/data/delete';
    url += '?' + "id=" + id.toString();
    axios.delete(url).then(() => {
      handleSearch();
    });

  };

  const handleAdd = (name: string, description: string, labelData: OptionType[], addTime: string) => {
    let url = 'http://localhost:3001/api/data/add';
    const data = {
      name: name,
      description: description,
      labelData: labelData,
      addTime: addTime
    };
    console.log(url);
    axios.post(url, data).then(() => {
      handleSearch();
    });
  }
  const { language } = useContext(LanguageContext);
  return (
    <>
      <AddData onAdd={handleAdd} name={""} description={""} labelData={[]} addTime={""} />
      <table className='data-view-table'>
        <thead>
          <DataViewHeader language={language} />
        </thead>
        <tbody>
          {currentRows.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{formDate(item.addTime)}</td>
              <td>
                {item.labelData && item.labelData.map((item: any, index) => (
                  <Label key={index} label={item.labelname} />
                ))}
              </td>
              <td className='action-data'>
                <EditData id={item.id}
                  name={item.name}
                  description={item.description}
                  // label={item.label} 
                  labelData={item.labelData}
                  addTime={item.addTime}
                  onEdit={handleEdit} />
                <DeleteConfirm id={item.id} onDelete={handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagination'>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>{language === 'zh' ? '上一页' : 'Previous Page'}</button>
        <span> {currentPage}  /  {totalPages} </span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>{language === 'zh' ? '下一页' : 'Next Page'}</button>
        <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}>
          {[2, 5, 10].map(value => (
            <option key={value} value={value}>{value} {language === 'zh' ? '行 / 页' : 'Rows / Page'}</option>
          ))}
        </select>
      </div>
    </>

  );
};

export type { DataItem };
export default DataView;