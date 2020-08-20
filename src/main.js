import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);
  const taskComponentElement = taskComponent.getElement();
  const taskEditComponentElement = taskEditComponent.getElement();

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponentElement, taskComponentElement);
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponentElement, taskEditComponentElement);
  };

  taskComponentElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  taskEditComponentElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskListElement, taskComponentElement, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
const boardComponentElement = boardComponent.getElement();
render(siteMainElement, boardComponentElement, RenderPosition.BEFOREEND);
render(boardComponentElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

const taskListComponent = new TaskListView();
render(boardComponentElement, taskListComponent.getElement(), RenderPosition.BEFOREEND);

const minTasksLength = Math.min(tasks.length, TASK_COUNT_PER_STEP);

for (let i = 0; i < minTasksLength; i++) {
  renderTask(taskListComponent.getElement(), tasks[i]);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  const loadMoreButtonComponent = new LoadMoreButtonView();
  const loadMoreButtonComponentElement = loadMoreButtonComponent.getElement();

  render(boardComponentElement, loadMoreButtonComponentElement, RenderPosition.BEFOREEND);

  loadMoreButtonComponentElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTask(taskListComponent.getElement(), task));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButtonComponentElement.remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}
