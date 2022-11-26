const ObjectId = require("mongoose").Types.ObjectId;
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);

const {
  createMechanic,
  checkMechanicNameExist,
  checkMechanicEmailExist,
  getAllMechanics,
  getMechanicSchedules,
  saveMechanicSchedule,
} = require("../repositories/mechanics");

const {
  checkBranchNameExist,
  checkBranchIDExist,
} = require("../repositories/branches");

const { validateEmail } = require("../utils/email");

const insertMechanic = async (name, email, branch) => {
  let validateBranch = false;

  const checkMechanicName = await checkMechanicNameExist(name);
  if (checkMechanicName) {
    return {
      status: 404,
      message: `Mechanic name '${name}' already exists`,
    };
  }

  const checkEmailFormat = await validateEmail(email);
  if (!checkEmailFormat) {
    return {
      status: 404,
      message: `Incorrect email format: '${email}'`,
    };
  }

  const checkMechanicEmail = await checkMechanicEmailExist(email);
  if (checkMechanicEmail) {
    return {
      status: 404,
      message: `Mechanic email '${email}' already exists`,
    };
  }

  if (ObjectId.isValid(branch)) {
    validateBranch = await checkBranchIDExist(branch);
  } else {
    validateBranch = await checkBranchNameExist(branch);
  }

  if (!validateBranch) {
    return {
      status: 404,
      message: `Branch '${branch}' not found`,
    };
  }

  const { _id } = validateBranch;

  const response = await createMechanic({
    name,
    email,
    branchId: _id,
  });

  if (response) {
    return {
      status: 201,
      message: `Mechanic '${name}' created`,
    };
  } else {
    return {
      status: 409,
      message: `Something went wrong creating mechanic '${name}'`,
    };
  }
};

const scheduleMechanic = async (mechanic, name, email, date) => {
  const { branchId } = await checkMechanicNameExist(mechanic);
  if (!branchId) {
    return {
      status: 400,
      message: `Mechanic name '${mechanic}' does not exist`,
    };
  }

  const { opening, closing, days } = await checkBranchIDExist(branchId);

  if (days.indexOf(dayjs(date).day()) === -1) {
    return {
      status: 404,
      message: `Date day is not accepted by the branch`,
    };
  }
  const openingDestruct = opening.split(":");
  const closingDestruct = closing.split(":");
  const todayOpeningHour = dayjs()
    .set("hour", openingDestruct[0])
    .set("minute", openingDestruct[1]);

  const todayClosingHour = dayjs()
    .set("hour", closingDestruct[0])
    .set("minute", closingDestruct[1]);

  const diffTodayDate = dayjs()
    .set("hour", dayjs(date).hour())
    .set("minute", dayjs(date).minute());

  if (diffTodayDate.diff(todayOpeningHour, "minute", true) < 0) {
    return {
      status: 404,
      message: `You can't use this time because the branch starts at: ${opening}`,
    };
  }

  if (todayClosingHour.diff(diffTodayDate, "minute", true) < 20) {
    return {
      status: 404,
      message: `You can't use this time because the branch closing at: ${closing}`,
    };
  }

  const mechanicAvailable = await checkMechanicAvailability(mechanic, date);

  if (mechanicAvailable) {
    await saveMechanicSchedule({
      mechanic,
      name,
      email,
      date,
    });

    return {
      status: 200,
      message: `Mechanic '${mechanic}' is assigned to the scheduled '${date}'`,
    };
  } else {
    return {
      status: 400,
      message: `Mechanic '${mechanic} with date '${date}' is not available`,
    };
  }
};

const checkMechanicAvailability = async (name, date) => {
  let availableSchedule = true;
  const dayStart = dayjs(date).startOf("day");
  const dayEnd = dayjs(date).endOf("day");

  const schedules = await getMechanicSchedules(name, dayStart, dayEnd);
  await schedules.map((schedule) => {
    if (dayjs(schedule.date).diff(dayjs(date), "minute") < 20) {
      availableSchedule = false;
    }
  });

  return availableSchedule;
};

module.exports = {
  insertMechanic,
  scheduleMechanic,
};
