const newResObj = () => {
  function ResObj() {}
  ResObj.prototype.status = jest.fn().mockReturnThis();
  ResObj.prototype.end = jest.fn().mockReturnThis();
  ResObj.prototype.json = jest.fn().mockReturnThis();
  ResObj.prototype.send = jest.fn().mockReturnThis();
  ResObj.prototype.sendStatus = jest.fn();
  return new ResObj();
};

module.exports = {
  newResObj,
};
