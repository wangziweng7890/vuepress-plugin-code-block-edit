const { cloneDeep, mergeWith } = require("lodash");

// TODO: Mysterious Name
const customizer = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    const newValue = new Set(objValue.concat(srcValue));
    return Array.from(newValue);
  }
};

// TODO: Mysterious Parameter Name
const merge = (object, other) => {
  const newObj = cloneDeep(object);
  mergeWith(newObj, other, customizer);
  return newObj;
};

module.exports = {
  customizer,
  merge,
};