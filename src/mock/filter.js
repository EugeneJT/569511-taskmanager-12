import {isTaskExpired, isTaskRepeating, isTaskExpiringToday} from "../utils.js";

export const generateFilter = (tasks) => {

  const filter = {
    all: 0,
    overdue: 0,
    today: 0,
    favorites: 0,
    repeating: 0,
    archive: 0
  };

  tasks.forEach((task) => {

    const {isArchive, dueDate, isFavorite, repeating} = task;

    if (isArchive) {
      filter.archive++;
    } else {

      filter.all++;

      if (isTaskExpired(dueDate)) {
        filter.overdue++;
      }

      if (isTaskExpiringToday(dueDate)) {
        filter.today++;
      }

      if (isFavorite) {
        filter.favorites++;
      }

      if (isTaskRepeating(repeating)) {
        filter.repeating++;
      }
    }

  });

  return Object.entries(filter).map(([name, count]) => {
    return {name, count};
  });
};
