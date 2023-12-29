const { formDateWithoutTime } = require('../utils/formDate');
const { getDataById } = require('../utils/getData');

const Router = require('@koa/router');
const { koaBody } = require('koa-body');

const fs = require('fs');
const path = require('path');

const router = new Router();

router.post('/api/data', async (ctx) => {
  // console.log(`search ctx.request.body: ` + `${JSON.stringify(ctx.request.body)}`);
  const { name, labels, time } = ctx.request.query;
  const selectedLabelsId = ctx.request.body;
  // console.log("selectedLabelsId: " + selectedLabelsId);
  const data = fs.readFileSync(path.join(__dirname, '../../data/data.json'), 'utf8');
  // console.log("data: " + data);
  const items = JSON.parse(data);

  const filteredItems = items.filter((item) => {
    if (name && !item.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    if (selectedLabelsId && selectedLabelsId.length > 0) {
      let flag = false;
      console.log("item.labelsid: " + item.labelsid);
      flag = selectedLabelsId.every(labelId => item.labelsid.includes(labelId));
      console.log("flag: " + flag);
      if (!flag)
        return false;
    }

    // console.log("item.addtime: " + item.addTime);
    // console.log("time: " + time);
    if (time && formDateWithoutTime(item.addTime) !== time) {
      return false;
    }
    return true;
  });

  ctx.body = filteredItems;
  // console.log("filteredItems: " + filteredItems);
});

router.delete('/api/data/delete', async (ctx) => {
  const { id } = ctx.request.query;

  const data = fs.readFileSync(path.join(__dirname, '../../data/data.json'), 'utf8');
  let items = JSON.parse(data);

  const index = items.findIndex(item => item.id == id);
  const item = items.find(item => item.id == id);

  // 读取 labels.json 文件
  const labelsData = fs.readFileSync(path.join(__dirname, '../../data/labels.json'), 'utf8');
  let labels = JSON.parse(labelsData);
  // 遍历 labels 数组
  labels.forEach(label => {
    if (label.usersid.includes(item.id)) {
      // 从 usersid 数组中删除 item.id
      label.usersid = label.usersid.filter(userid => userid !== item.id);
    }
  });
  // 遍历 labelsid 数组
  // 将更新后的 labels 数组写回 labels.json 文件
  fs.writeFileSync(path.join(__dirname, '../../data/labels.json'), JSON.stringify(labels, null, 2));

  if (index !== -1) {
    items.splice(index, 1);
  }
  fs.writeFileSync(path.join(__dirname, '../../data/data.json'), JSON.stringify(items), 'utf8');
  ctx.body = { message: 'Data deleted successfully' };
});

router.put('/api/data/edit', async (ctx) => {
  console.log(`edit ctx.request.body: ` + `${JSON.stringify(ctx.request.body)}`);
  const { id, name, description, labelData, addTime } = ctx.request.body;
  // console.log("edit labelData: " + labelData);

  const data = fs.readFileSync(path.join(__dirname, '../../data/data.json'), 'utf8');
  let items = JSON.parse(data);
  // 找到对应的数据条目
  const item = items.find(item => item.id == id);
  if (!item) {
    ctx.body = { message: 'Data not found' };
    return;
  }
  // 更改对应的属性
  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (labelData !== undefined) {
    console.log("labelData: " + labelData);
    item.labelsid = labelData.map(label => label.value);
    item.labelData = labelData.map(label => ({ labelid: label.value, labelname: label.label }));
    console.log("item.labelsid: " + item.labelsid);
    // 读取 labels.json 文件
    const labelsData = fs.readFileSync(path.join(__dirname, '../../data/labels.json'), 'utf8');
    let labels = JSON.parse(labelsData);
    // 遍历 labels 数组
    labels.forEach(label => {
      if (item.labelsid.includes(label.labelid)) {
        // 如果 usersid 数组中还没有 item.id，就将 item.id 添加到 usersid 数组中
        if (!label.usersid.includes(item.id)) {
          label.usersid.push(item.id);
        }
      }
      // 如果 usersid 数组中包含 item.id，但是 item.labelsid 中没有这个 labelid
      else if (label.usersid.includes(item.id)) {
        // 从 usersid 数组中删除 item.id
        label.usersid = label.usersid.filter(userid => userid !== item.id);
      }
    });
    // 遍历 labelsid 数组
    // 将更新后的 labels 数组写回 labels.json 文件
    fs.writeFileSync(path.join(__dirname, '../../data/labels.json'), JSON.stringify(labels, null, 2));
  }
  // console.log("edit label: " + item.label);
  if (addTime !== undefined) item.addTime = addTime;
  fs.writeFileSync(path.join(__dirname, '../../data/data.json'), JSON.stringify(items, null, 2), 'utf8');
  ctx.body = { message: 'Data updated successfully' };
});

router.post('/api/data/add', async (ctx) => {
  const { name, description, labelData, addTime } = ctx.request.body;
  // console.log("add name: " + name);
  // 读取数据
  const data = fs.readFileSync(path.join(__dirname, '../../data/data.json'), 'utf8');
  let items = JSON.parse(data);

  dataidPath = path.join(__dirname, '../../data/dataid.txt');
  let newId = Number(fs.readFileSync(dataidPath, 'utf8'));
  // 生成新的数据条目
  const item = {
    id: newId.toString(),
    name: name,
    description: description,
    labelsid: labelData.map(label => label.value),
    labelData: labelData.map(label => ({ labelid: label.value, labelname: label.label })),
    addTime: addTime,
  };
  newId += 1;
  fs.writeFileSync(dataidPath, newId.toString(), 'utf8');

  // 读取 labels.json 文件
  const labelsData = fs.readFileSync(path.join(__dirname, '../../data/labels.json'), 'utf8');
  let labels = JSON.parse(labelsData);
  // 遍历 labels 数组
  labels.forEach(label => {
    if (item.labelsid.includes(label.labelid)) {
      // 如果 usersid 数组中还没有 item.id，就将 item.id 添加到 usersid 数组中
      if (!label.usersid.includes(item.id)) {
        label.usersid.push(item.id);
      }
    }
  });
  // 将更新后的 labels 数组写回 labels.json 文件
  fs.writeFileSync(path.join(__dirname, '../../data/labels.json'), JSON.stringify(labels, null, 2));

  // 添加新的数据条目
  items.push(item);

  // 写入数据
  fs.writeFileSync(path.join(__dirname, '../../data/data.json'), JSON.stringify(items), 'utf8');

  ctx.body = { message: 'Data added successfully' };
});

module.exports = router;