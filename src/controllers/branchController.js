const dayjs = require("dayjs");
const _ = require("lodash");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const { insertBranch } = require("../models/branchesModel");

const createBranch = async (
  branchName = null,
  opening = null,
  closing = null,
  days = null
) => {
  if (!isNaN(branchName)) {
    return {
      status: 404,
      message: `Branch name is required`,
    };
  }

  let dataInsert = { name: branchName };

  if (!isNaN(opening) && !isNaN(closing)) {
    const openingFormat = dayjs(opening, "HH:mm", true);
    const closingFormat = dayjs(closing, "HH:mm", true);

    if (openingFormat.isValid() && closingFormat.isValid()) {
      const minuteDiff = closingFormat.diff(openingFormat, "minute", true);

      if (minuteDiff < 0) {
        return { status: 404, message: `Invalid time range` };
      }

      if (minuteDiff > 0 && minuteDiff < 20) {
        return { status: 404, message: `Time range required min 20 minutes` };
      }

      dataInsert.opening = opening;
      dataInsert.closing = closing;
    }
  }

  if (!isNaN(days) && _.isArray(days)) {
    dataInsert.opening = opening;
  }

  return await insertBranch(dataInsert);
};

module.exports = {
  createBranch,
};
