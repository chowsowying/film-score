import moment from "moment";

export const antDValidationError = [
  {
    message: "Required",
    required: true,
  },
];

export const getDateFormat = (date) => {
  return moment(date).format("MMM Do YYYY");
};

export const getDateTimeFormat = (date) => {
  return moment(date).format("MMM Do YYYY, h:mm:ss a");
};

export const getYear = (date) => {
  return moment(date).format("YYYY");
};
