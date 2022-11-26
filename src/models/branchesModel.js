const {
  createBranch,
  checkBranchNameExist,
} = require("../repositories/branches");

const insertBranch = async (data) => {
  const { name: branchName } = data;

  const checkIfExistBranch = await checkBranchNameExist(branchName);

  if (checkIfExistBranch) {
    return {
      status: 404,
      message: `Branch '${branchName}' already exists`,
    };
  }

  const response = createBranch(data);

  if (response) {
    return {
      status: 201,
      message: `Branch '${branchName}' created`,
    };
  } else {
    return {
      status: 409,
      message: `Something went wrong creating branch '${branchName}'`,
    };
  }
};

module.exports = {
  insertBranch,
};
