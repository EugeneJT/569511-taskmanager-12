import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import NoTaskView from "./view/no-task.js";
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

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponentElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponentElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponentElement, RenderPosition.BEFOREEND);
};


const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const boardComponentElement = boardComponent.getElement();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponentElement, RenderPosition.BEFOREEND);
  render(boardComponentElement, taskListComponent.getElement(), RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponentElement, new NoTaskView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponentElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

  const minTasksLength = Math.min(tasks.length, TASK_COUNT_PER_STEP);

  boardTasks
    .slice(0, minTasksLength)
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));


  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    const loadMoreButtonComponentElement = loadMoreButtonComponent.getElement();

    render(boardComponentElement, loadMoreButtonComponentElement, RenderPosition.BEFOREEND);

    loadMoreButtonComponentElement.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreButtonComponentElement.remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};


render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
