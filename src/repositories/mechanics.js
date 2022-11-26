const mechanicRepository = require("../schemas/mechanic");
const scheduleRepository = require("../schemas/schedule");

const createMechanic = async (data) => {
  return await mechanicRepository.create(data);
};

const checkMechanicNameExist = async (name) => {
  return await mechanicRepository.findOne({ name: name });
};

const checkMechanicEmailExist = async (email) => {
  return await mechanicRepository.findOne({ email: email });
};

const checkMechanicIDExist = async (id) => {
  return await mechanicRepository.findById(id);
};

const getAllMechanics = async () => {
  return await mechanicRepository.find({});
};

const getMechanicSchedules = async (name, dateStart, dateEnd) => {
  return await scheduleRepository.find({
    mechanic: name,
    date: {
      $gte: dateStart,
      $lt: dateEnd,
    },
  });
};

const saveMechanicSchedule = async (data) => {
  return await scheduleRepository.create(data);
};

module.exports = {
  createMechanic,
  checkMechanicNameExist,
  checkMechanicEmailExist,
  checkMechanicIDExist,
  getAllMechanics,
  getMechanicSchedules,
  saveMechanicSchedule,
};
