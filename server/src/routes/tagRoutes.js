const Router = require('@koa/router');
const { koaBody } = require('koa-body');
const fs = require('fs');
const path = require('path');
const router = new Router();
const { getLabelById, getLabelByName } = require('../utils/getData');

router.post('/api/label', async (ctx) => {

  // const { label } = ctx.request.query;
  const labelPath = path.join(__dirname, '../../data/labels.json');
  const labelData = JSON.parse(fs.readFileSync(labelPath));
  ctx.body = labelData;
});


router.delete('/api/label/delete', async (ctx) => {
  const { labelid } = ctx.request.query;
  console.log("id to delete: " + labelid);
  const { labelPath, labelData, label } = getLabelById('../../data/labels.json', labelid);
  // console.log("label: " + label);
  if (label && label.usersid && label.usersid.length > 0) {
    ctx.throw(400, '标签已被使用，不能删除');
  } else {
    const index = labelData.findIndex(label => label.labelid == labelid);
    if (index !== -1) {

      labelData.splice(index, 1);
    }
    fs.writeFileSync(labelPath, JSON.stringify(labelData));
    ctx.body = labelData;
  }
});

router.put('/api/label/edit', async (ctx) => {
  const { labelid, labelname } = ctx.request.body;
  console.log("id to edit: " + labelid);
  console.log("name to edit: " + labelname);
  const { labelPath, labelData, item } = getLabelById('../../data/labels.json', labelid);
  // if (item) {
  //   item.labelname = labelname;
  // }
  const label = labelData.find(label => label.labelid == labelid);
  const usersid = label.usersid;
  if (label)
    label.labelname = labelname;
  fs.writeFileSync(path.join(__dirname, '../../data/labels.json'), JSON.stringify(labelData), 'utf8');

  // 修改数据中用到的这个标签
  const dataPath = path.join(__dirname, '../../data/data.json');
  usersData = JSON.parse(fs.readFileSync(dataPath));
  usersData.forEach(user => {
    if (usersid.includes(user.id)) {
      user.labelData.forEach(label => {
        if (label.labelid === labelid) {
          label.labelname = labelname;
        }
      });
    }
  });
  fs.writeFileSync(dataPath, JSON.stringify(usersData), 'utf8');
  ctx.body = { message: 'Label updated successfully!' }
});

router.post('/api/label/add', async (ctx) => {
  const { labelname } = ctx.request.body;
  console.log("add labelname: " + labelname);

  const { labelPath, labelData, item } = getLabelByName('../../data/labels.json', labelname);
  // 读取文件
  const labelidPath = path.resolve(__dirname, '../../data/labelid.txt'); 
  let labelid = Number(fs.readFileSync(labelidPath, 'utf-8'));
  const label = {
    labelid: labelid.toString(),
    labelname: labelname, 
    usersid: []
  };
  labelid += 1;
  // 将新的 labelid 写入文件
  fs.writeFileSync(labelidPath, labelid.toString());

  labelData.push(label);
  fs.writeFileSync(labelPath, JSON.stringify(labelData));
  ctx.body = labelData;
});

module.exports = router;