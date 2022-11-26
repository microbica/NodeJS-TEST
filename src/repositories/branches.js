const branchesRepository = require("../schemas/branches");

const createBranch = async (data) => {
  return await branchesRepository.create(data);
};

const checkBranchNameExist = async (name) => {
  return await branchesRepository.findOne({ name: name });
};

const checkBranchIDExist = async (id) => {
  return await branchesRepository.findById(id);
};

module.exports = {
  createBranch,
  checkBranchNameExist,
  checkBranchIDExist,
};
