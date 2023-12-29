import React from "react";

const DataViewHeader = ({language}) => {
  if (language == 'zh') {
    return (
      <tr>
        <th>编号</th>
        <th>名字</th>
        <th>描述</th>
        <th>添加时间</th>
        <th>标签</th>
        <th>操作</th>
      </tr>
    )
  } else if (language == 'en') { 
    return (
      <tr>
        <th>Index</th>
        <th>Name</th>
        <th>Description</th>
        <th>Add Time</th>
        <th>Labels</th>
        <th>Actions</th>
      </tr>
    )
  }
}

export default DataViewHeader;