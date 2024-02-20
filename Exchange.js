// #0 констатнты
const API_KEY = "16db09cd05df8127e37aec85";
const getUrl = (currency) =>
  `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`;

// #1 Получаем элементы
const mainBlock = document.querySelector(".main");
const leftBlock = document.querySelector(".left-panel");
const rightBlock = document.querySelector(".right-panel");
const leftInput = document.querySelector(".left-input");
const rightInput = document.querySelector(".right-input");
const revers = document.querySelector(".revers");
const calcDate = document.querySelector(".calc__period");
const switchBtn = document.querySelector(".switch__slider");
const iconCurrencyLeft = document.querySelector(".icon-currency-left");
const iconCurrencyRight = document.querySelector(".icon-currency-right");

let leftPanelBlock;
let rightPanelBlock;

// switch
switchBtn.addEventListener("click", () =>
  document.body.classList.toggle("dark-theme")
);

// #2 Состояние
const leftPanelCurrencies = [
  {
    currency: "USD",
    checked: true,
  },
  {
    currency: "EUR",
    checked: false,
  },
  {
    currency: "GBP",
    checked: false,
  },
  {
    currency: "RUB",
    checked: false,
  },
];

const rightPanelCurrencies = [
  {
    currency: "RUB",
    checked: true,
  },
  {
    currency: "USD",
    checked: false,
  },
  {
    currency: "EUR",
    checked: false,
  },
  {
    currency: "GBP",
    checked: false,
  },
];

let CONVERSION_RATES;
let isLeftModalOpen = false;
let isRightModalOpen = false;

// #3 Вспомогательные функции
const getLeftSelectedCurrency = () =>
  leftPanelCurrencies.filter(({ checked }) => checked)[0].currency;

const getRightSelectedCurrency = () =>
  rightPanelCurrencies.filter(({ checked }) => checked)[0].currency;

// Отрисовка 4-х валют с сево
const rerenderLeftPanel = () => {
  const left = document.querySelector(".currency-left");
  const content = `
            ${leftPanelCurrencies
              .map(
                ({ currency, checked }) =>
                  `<div data-currency="${currency}" class="currency__item ${
                    checked ? "currency-checked" : ""
                  }">${currency}</div>`
              )
              .join("")}
     
            <div class="currency__item material-symbols-outlined left__arrow__down">arrow_downward</div>
            `;

  if (left) {
    left.innerHTML = content;
  } else {
    return `<div class="currency-left">${content}</div>`;
  }
};

// Отрисовка leftBox панели
const renderLeftBox = () => {
  const leftBox = document.createElement("div");
  leftBox.classList.add("box-currency-left");

  leftBox.innerHTML = `
        <h4 class="title_h4"> У меня есть</h4>
        ${rerenderLeftPanel()}
     `;

  leftBlock.insertAdjacentElement("afterbegin", leftBox);

  leftPanelBlock = leftBox;
};

// Отрисовка 4-х валют с право
const rerenderRightPanel = () => {
  const right = document.querySelector(".currency-right");
  const content = `
        ${rightPanelCurrencies
          .map(
            ({ currency, checked }) =>
              `<div data-currency="${currency}" class="currency__item ${
                checked ? "currency-checked" : ""
              }">${currency}</div>`
          )
          .join("")}
    
        <div class="currency__item material-symbols-outlined right__arrow__down">arrow_downward</div>
        `;

  if (right) {
    right.innerHTML = content;
  } else {
    return `<div class="currency-right">${content}</div>`;
  }
};

// Отрисовка  rightBox
const renderRightBox = () => {
  const rightBox = document.createElement("div");
  rightBox.classList.add("box-currency-right");

  rightBox.innerHTML = `
        <h4 class="title_h4">Хочу приобрести</h4>

        ${rerenderRightPanel()}
        </div>    
`;

  rightPanelBlock = rightBox;
  rightBlock.insertAdjacentElement("afterbegin", rightBox);
};

renderRightBox();
renderLeftBox();

// All-Currency
const allCurrency = {
  RUB: "Российский рубль",
  USD: "Доллар США",
  EUR: "Евро",
  GBP: "Фунт стерлингов",
  AUD: "Австралийский доллар",
  AZN: "Азербаджанский манат",
  AMD: "Армянский драм",
  BYN: "Белорусский рубль",
  BGN: "Болгарский лев",
  BRL: "Бразильский реал",
  HUF: "Венгерский форинт",
  KRW: "Вон Республики Корея",
  DKK: "Датская крона",
  INR: "Индийская рупия",
  KZT: "Казахстанский тенге",
  CAD: "Канадский доллар",
  KGS: "Киргизский сом",
  CNY: "Китайский юань",
  MDL: "Молдавсский лей",
  RON: "Новый румынский лей",
  TMT: "Новый туркменский манат",
  NOK: "Норвежская крона",
  PLN: "Польский злотый",
  SGD: "Сингапурский доллар",
  TJS: "Таджикский сомони",
  UZS: "Узбекский сум",
  UAH: "Украинская гривна",
  CZK: "Чешская крона",
  SEK: "Шведская крона",
  CHF: "Швецарский франк",
  ZAR: "Южноафриканский ренд",
  JPY: "Японская иена",
};

// #4 Основные функции, отвечающие за логику приложения
const getData = async () => {
  try {
    const leftSelectedCurrency = getLeftSelectedCurrency();
    const rightSelectedCurrency = getRightSelectedCurrency();

    const URL = getUrl(leftSelectedCurrency);
    const response = await fetch(URL);
    const { conversion_rates } = await response.json();
    CONVERSION_RATES = conversion_rates;
    rightInput.value = (
      leftInput.value * CONVERSION_RATES[rightSelectedCurrency]
    ).toFixed(2);
  } catch (e) {
    console.log(e, "Error");
  }
  renderInputsInfo();
};
getData();

// Обработчик события на leftPanelBlock и left__arrow__down(modalWindow)
function handleClickLeft(event) {
  // Если нажатый элемент currency-checked и не нажато на кнопку left__arrow__down то выходим!
  if (
    event.target.classList.contains("currency-checked") &&
    !event.target.classList.contains("left__arrow__down")
  ) {
    return;
  } else if (!event.target.closest(".currency-left")) {
    return;
  }

  // Если нажата стрелка вниз с лево, то она checked и меняем направление стрелки (вверх).
  if (event.target.classList.contains("left__arrow__down")) {
    isLeftModalOpen = !isLeftModalOpen;
    event.target.classList.add("currency-checked");
    event.target.innerHTML = "arrow_upward";

    //isLeftModalOpen === true
    if (isLeftModalOpen) {
      // isRightModalOpen == true, делаем false и отрисовываем правую панель
      if (isRightModalOpen) {
        isRightModalOpen = false;
        rerenderRightPanel();
        // а если isRightModalOpen === false, значит создаем modalWindow
      } else {
        mainBlock.insertAdjacentHTML(
          "afterend",
          '<div class="modalWindow"></div>'
        );
        renderBlockWindow();
      }

      //isLeftModalOpen === false (если второй раз нажали на left__arrow__down), отрисовка левой панели и закрытие модального окна
    } else {
      rerenderLeftPanel();
      closeBlockWindow();
    }

    // Выбор из 4-х базовых валют в слючае если не нажата кнопка-стрелка вниз с лево
  } else {
    const selectedCurrency = event.target.dataset.currency;
    leftPanelCurrencies.forEach(
      ({ currency }, index) =>
        (leftPanelCurrencies[index].checked = currency === selectedCurrency)
    );
    rerenderLeftPanel();
    getData();
  }
}
leftPanelBlock.addEventListener("click", handleClickLeft);

// Обработчик события на rightPanelBlock и right__arrow__down(modalWindow)
function handleClickRight(event) {
  // Если нажатый элемент currency-checked и не нажато на кнопку right__arrow__down то выходим!
  if (
    event.target.classList.contains("currency-checked") &&
    !event.target.classList.contains("right__arrow__down")
  ) {
    return;
  } else if (!event.target.closest(".currency-right")) {
    return;
  }

  // Если нажата стрелка вниз с право
  if (event.target.classList.contains("right__arrow__down")) {
    isRightModalOpen = !isRightModalOpen;
    event.target.classList.add("currency-checked");
    event.target.innerHTML = "arrow_upward";

    //isRightModalOpen === true ? тогда кнопка currency-checked, создаем modalWindow и отрисовываем renderBlockWindow
    if (isRightModalOpen) {
      // isLeftModalOpen == true, делаем false и отрисовываем левую панель
      if (isLeftModalOpen) {
        isLeftModalOpen = false;
        rerenderLeftPanel();

        // а если isLeftModalOpen == false, значит создаем modalWindow
      } else {
        mainBlock.insertAdjacentHTML(
          "afterend",
          '<div class="modalWindow"></div>'
        );
        renderBlockWindow();
      }

      //isRightModalOpen === false то удаляем modalWindow и отрисовка правой панели заново
    } else {
      rerenderRightPanel();
      closeBlockWindow();
    }

    // Выбор из 4-х базовых валют в слючае если не создано modalWindow
  } else {
    const selectedCurrency = event.target.dataset.currency;
    rightPanelCurrencies.forEach(
      ({ currency }, index) =>
        (rightPanelCurrencies[index].checked = currency === selectedCurrency)
    );
    // Отображение информации о конвертации НА ПРАВОМ rightInput
    rightInput.value = (
      leftInput.value * CONVERSION_RATES[selectedCurrency]
    ).toFixed(2);
    rerenderRightPanel();
    getData();
  }
}
rightPanelBlock.addEventListener("click", handleClickRight);

// new Intl.NumberFormat currency
setInterval(() => {
  let leftNumber = leftInput.value;
  const formatterLeft = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: getLeftSelectedCurrency(),
  });
  const formattedNumberLeft = formatterLeft.format(leftNumber);
  iconCurrencyLeft.textContent = formattedNumberLeft;

  let rightNumber = rightInput.value;
  const formatterRight = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: getRightSelectedCurrency(),
  });
  const formattedNumberRight = formatterRight.format(rightNumber);
  iconCurrencyRight.textContent = formattedNumberRight;
}, 1000);

//  BUTTON <> REVERS
revers.addEventListener("click", () => {
  // Меняем местами значения input
  const tempInputValue = leftInput.value;
  leftInput.value = rightInput.value;
  rightInput.value = tempInputValue;

  // Переменные для хнанения состояния
  let oldRightCurrency = getRightSelectedCurrency();
  let oldLeftCurrency = getLeftSelectedCurrency();

  // Меняем местами панели валют

  // Правая сторона выбора валюты
  rightPanelCurrencies.forEach((i) => (i.checked = false));

  // Левая сторона выбора валюты
  leftPanelCurrencies.forEach((i) => (i.checked = false));
  rerenderLeftPanel();
  rerenderRightPanel();

  // на правой панели сравниваем, есть ли такая валюта с левой стороны
  rightPanelCurrencies.forEach((item) => {
    // если есть checked = true
    if (item.currency === oldLeftCurrency) item.checked = true;
    // записываем есть вабранная валюта с лево, с панелью на правой стороне
    const rightPanelIncludeCurrencie = rightPanelCurrencies.find(
      (item) => item.currency === oldLeftCurrency
    );
    //если на правой панели нет такой же валюты как на левой стороне выбранной, то на правой стороне последнюю ячейку отрисовываем с выбранной валютой с лево
    if (!rightPanelIncludeCurrencie) {
      rightPanelCurrencies[rightPanelCurrencies.length - 1] = {
        currency: oldLeftCurrency,
        checked: true,
      };
    }
  });

  leftPanelCurrencies.forEach((item) => {
    if (item.currency === oldRightCurrency) item.checked = true;
    const leftPanelIncludeCurrencie = leftPanelCurrencies.find(
      (item) => item.currency === oldRightCurrency
    );

    if (!leftPanelIncludeCurrencie) {
      leftPanelCurrencies[leftPanelCurrencies.length - 1] = {
        currency: oldRightCurrency,
        checked: true,
      };
    }
  });

  // Повторно отрендерим обе панели
  rerenderLeftPanel();
  rerenderRightPanel();
  renderInputsInfo();
  getData();
});

// Render INFO inputs
function renderInputsInfo() {
  const currencyInfoLeft = document.querySelector(
    ".js-converter-rate-from-left"
  );
  const currencyInfoRight = document.querySelector(
    ".js-converter-rate-from-right"
  );
  let divideTheLeftCurrencyByTheRightCurrency =
    CONVERSION_RATES[getLeftSelectedCurrency()] /
    CONVERSION_RATES[getRightSelectedCurrency()];

  currencyInfoLeft.innerHTML = `1 ${getLeftSelectedCurrency()} = ${CONVERSION_RATES[
    getRightSelectedCurrency()
  ].toFixed(2)} ${" " + getRightSelectedCurrency()}`;
  currencyInfoRight.innerHTML = `1  ${getRightSelectedCurrency()} = ${divideTheLeftCurrencyByTheRightCurrency.toFixed(
    2
  )} ${" " + getLeftSelectedCurrency()}`;

  // Date now and looking
  const currentDate = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // dateStyle: 'short',
  }).format(new Date());

  calcDate.innerHTML = `Данные актуальны на ${currentDate}<hr>`;
}

// Обработчик события на leftInput
leftInput.addEventListener("input", () => {
  const rightCurrency = getRightSelectedCurrency();
  const newValue = leftInput.value;
  rightInput.value = (newValue * CONVERSION_RATES[rightCurrency]).toFixed(2);
});

// Функция создания modalWindow
function renderBlockWindow() {
  const modalWindow = document.querySelector(".modalWindow");

  Object.keys(allCurrency).forEach((item, index) => {
    const value = allCurrency[item];
    const cssClass =
      index <= 10
        ? "leftOpenModal"
        : index <= 20
        ? "centrOpenModal"
        : "rightOpenModal";

    modalWindow.innerHTML += ` <div class="${cssClass}" data-currency="${item}" >${value}
                <span class="leftOpenModal bold" data-currency="${item}">${item}</span>
                </div>
         `;
  });

  // Выбор валюты из модального окна !
  modalWindow.addEventListener("click", (event) => {
    // Если клик был не на валюту то выходим
    if (!event.target.dataset.currency) return;

    // в константу записываем валюту которая выбрана из модального окна
    const selectedCurrencyModalWindow = event.target.dataset.currency;

    // Записываем базовые валюты с левой стороны
    const leftCurrencies = leftPanelCurrencies.map(({ currency }) => currency);

    // Записываем базовые валюты с правой стороны
    const rightCurrencies = rightPanelCurrencies.map(
      ({ currency }) => currency
    );

    // isLeftModalOpen == true и выбранная валюта сейчас не содержится с левой(leftCurrencies) стороны (базавые 4 валюты)
    if (
      isLeftModalOpen &&
      !leftCurrencies.includes(selectedCurrencyModalWindow)
    ) {
      leftPanelCurrencies.forEach((item) => (item.checked = false));
      leftPanelCurrencies[leftPanelCurrencies.length - 1] = {
        currency: selectedCurrencyModalWindow,
        checked: true,
      };

      rerenderLeftPanel();
      getData();
      // isLeftModalOpen == true и выбранная валюта сейчас содержится с левой(leftCurrencies) стороны (базавые 4 валюты)
      // тогда checked = true, а остальные checked = false
    } else if (
      isLeftModalOpen &&
      leftCurrencies.includes(selectedCurrencyModalWindow)
    ) {
      leftPanelCurrencies.forEach((item) => {
        if (item.currency === selectedCurrencyModalWindow) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    }
    // isRightModalOpen == true, и выбранная валюта сейчас не содержится с правой(rightCurrencies) стороны (базавые 4 валюты)
    if (
      isRightModalOpen &&
      !rightCurrencies.includes(selectedCurrencyModalWindow)
    ) {
      rightPanelCurrencies.forEach((item) => (item.checked = false));
      rightPanelCurrencies[rightPanelCurrencies.length - 1] = {
        currency: selectedCurrencyModalWindow,
        checked: true,
      };

      rerenderRightPanel();
      getData();
      // isRightModalOpen == true, и выбранная валюта сейчас содержится с правой(rightCurrencies) стороны (базавые 4 валюты)
      // тогда checked = true, а остальные checked = false
    } else if (
      isRightModalOpen &&
      rightCurrencies.includes(selectedCurrencyModalWindow)
    ) {
      rightPanelCurrencies.forEach((item) => {
        if (item.currency === selectedCurrencyModalWindow) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    }
    closeBlockWindow();
    renderInputsInfo();
  });
}

// ф-я закрывает modalWindow.
function closeBlockWindow() {
  const modalWindow = document.querySelector(".modalWindow");

  isLeftModalOpen = false;
  isRightModalOpen = false;

  modalWindow.remove();
  rerenderLeftPanel();
  rerenderRightPanel();
}

// Запрет ввода букв и символов
leftInput.setAttribute("onkeypress", "return onlyNumbers(event)");
rightInput.setAttribute("onkeypress", "return onlyNumbers(event)");

function onlyNumbers(event) {
  const key = event.keyCode || event.which;
  const allowedKeys = [8, 9, 13, 27, 46]; // разрешенные клавиши: backspace, tab, enter, esc, delete
  if (allowedKeys.includes(key)) {
    return true;
  }
  if (key < 48 || key > 57) {
    // разрешены только цифры
    event.preventDefault();
    return false;
  }
  if (leftInput.value.length >= 15 || rightInput.value.length >= 15) {
    // максимальное количество символов
    event.preventDefault();
    return false;
  }
}

// Обработчик события на документ, скрывает modalWindow если клик был на другую область!
document.addEventListener("click", (event) => {
  if (isLeftModalOpen || isRightModalOpen) {
    if (
      event.target.classList.contains("left__arrow__down") ||
      event.target.classList.contains("right__arrow__down")
    )
      return;

    if (!event.target.closest(".modalWindow")) {
      isLeftModalOpen = false;
      isRightModalOpen = false;

      closeBlockWindow();
    }
  }
});