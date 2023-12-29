const fs = require('fs');
const path = require('path');

function getLabelById(relativePath, labelid) {
  const labelPath = path.join(__dirname, relativePath);
  const labelData = JSON.parse(fs.readFileSync(labelPath));
  const label = labelData.find(label => label.labelid == labelid);
  return {labelPath, labelData, label};
}
function getLabelByName(relativePath, labelname) {
  const labelPath = path.join(__dirname, relativePath);
  const labelData = JSON.parse(fs.readFileSync(labelPath));
  const label = labelData.find(label => label.labelname == labelname);
  return {labelPath, labelData, label};
}

function getDataById(relativePath, userid) {
  const userPath = path.join(__dirname, relativePath);
  const userData = JSON.parse(fs.readFileSync(userPath));
  const user = userData.find(user => user.userid == userid);
  return {userPath, userData, user};
}

module.exports = {
  getLabelById, 
  getDataById, 
  getLabelByName
}