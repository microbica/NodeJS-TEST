const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const {
  insertMechanic,
  scheduleMechanic: schedule,
} = require("../models/mechanicModel");

const createMechanic = async (name, email, branch) => {
  if (!isNaN(name)) {
    return {
      status: 404,
      message: "Mechanic name is required",
    };
  }

  if (!isNaN(email)) {
    return {
      status: 404,
      message: "Mechanic email is required",
    };
  }

  if (!isNaN(branch)) {
    return {
      status: 404,
      message: "branch ID or Name is required",
    };
  }

  try {
    return await insertMechanic(name, email, branch);
  } catch (err) {
    console.log(err);
  }
};

const scheduleMechanic = async (
  mechanic = null,
  name = null,
  email = null,
  date = null
) => {
  if (!isNaN(mechanic)) {
    return {
      status: 404,
      message: `Mechanic name is required`,
    };
  }

  if (!isNaN(name)) {
    return {
      status: 404,
      message: `User name is required`,
    };
  }

  if (!isNaN(email)) {
    return {
      status: 404,
      message: `User Email is required`,
    };
  }

  if (!isNaN(date)) {
    return {
      status: 404,
      message: `Date to schedule is required`,
    };
  }

  const dateFormat = dayjs(date, "YYYY-MM-DD H:mm", true);

  if (!dateFormat.isValid()) {
    return {
      status: 404,
      message: `Invalid date format, required YYYY-MM-DD H:mm`,
    };
  }

  return await schedule(mechanic, name, email, date);
};

module.exports = {
  createMechanic,
  scheduleMechanic,
};
