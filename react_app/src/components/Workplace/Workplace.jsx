import * as utils from "../../utils";
import { useRef, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";

export const Workplace = function () {
  const {
    moveToPayment,
    pageIsActive,
    setPageIsActive,
    addNotification,
    currentOrdersList,
    setOrdersList,
    currentOrderId,
    setOrderId,
    currentApiData,
    setApiData,
  } = useGlobalContext();

  const constuctorRef = useRef(null);
  const basketButtonRef = useRef(null);

  const [currentWorkplace, setCurrentWorkplace] = useState("constructor");
  const [currentInput, setInput] = useState("");
  const [currentUrl, setUrl] = useState("");
  const [currentInstance, setInstance] = useState({});
  const [currentServices, setServices] = useState([]);
  const [currentQuantity, setQuantity] = useState(0);
  const [currentPrice, setPrice] = useState(0);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setUrl(event.target.value);
  };

  const handleCreateOrder = () => {
    if (!currentInput) return addNotification("Вставте посилання", "error");
    setInput("");
    const instance = utils.identifyUrl(currentUrl);
    if (!instance) return addNotification("Посилання не розпізнане", "error");

    const api = new URL(process.env.REACT_APP_GET_SERVICES_API_URI);
    api.searchParams.append("instance", instance);
    fetch(api, { method: "GET" })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status);
      })
      .then((data) => {
        setApiData(data);
        handleApiData(data);

        if (currentWorkplace !== "constructor") {
          setCurrentWorkplace("constructor");
        }

        if (!pageIsActive) {
          setPageIsActive(true);
        }
      })
      .catch((error) => {
        switch (+error.message) {
          case 404:
            return addNotification("Не знайдено послуг", "error");
          case 500:
            return addNotification("Помилка сервера", "error");
          default:
            return addNotification("Помилка", "error");
        }
      });
  };

  const handleApiData = (apiData) => {
    setInstance(apiData.object);
    setServices(apiData.services);
  };

  const handleChooseService = (itemId) => {
    if (currentServices.length === 1) return;
    const filteredServices = currentServices.filter(
      (item) => item.id === itemId
    );
    setServices(filteredServices);
  };

  const handleChangeQuantity = (event) => {
    let newQuantity = utils.numFilter.exec(event.target.value);
    newQuantity = Math.ceil(newQuantity);
    const pricePerOne = currentServices[0].pricePerOne;
    const newPrice = (newQuantity * pricePerOne).toFixed(2);
    setQuantity(newQuantity);
    setPrice(newPrice);
  };

  const handleAddOrder = () => {
    const minQuantity = currentServices[0].minQuantity;
    if (currentQuantity < minQuantity) {
      return addNotification(`Мінімально ${minQuantity} шт.`, "error");
    }

    const newOrder = {
      id: currentOrderId,
      instance: currentInstance,
      details: {
        ...currentServices[0],
        url: currentUrl,
        quantity: currentQuantity,
        price: currentPrice,
      },
    };

    setOrdersList((prevState) => [newOrder, ...prevState]);
    setOrderId((prevState) => prevState + 1);
    handleResetOrder();
  };

  const handleOpenBasket = () => {
    currentWorkplace === "constructor"
      ? setCurrentWorkplace("basket")
      : setCurrentWorkplace("constructor");
    basketButtonRef.current.classList.toggle("active");
  };

  const handleToggleOrderOptions = (event) => {
    const item = event.target.closest(".basket__item");
    item.classList.toggle("active");
  };

  const handleDeleteOrder = (creationId) => {
    const editedOrderList = currentOrdersList.filter(
      (item) => item.id !== creationId
    );
    setOrdersList(editedOrderList);
  };

  const handleResetOrder = () => {
    setInstance(currentApiData.object);
    setServices(currentApiData.services);
    setQuantity(0);
    setPrice(0);
  };

  const handleRedirect = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="wrap">
      <div className="search container workplace_container">
        <input
          type="text"
          className="search__input"
          placeholder="Укажіть посилання..."
          value={currentInput}
          onChange={handleInputChange}
        />
        <button className="search__button" onClick={handleCreateOrder}>
          <img
            src={`${process.env.PUBLIC_URL}/svg/plus_icon.svg`}
            alt="plus-icon"
            className="search__icon"
          />
        </button>
      </div>

      <section className="workplace">
        <div className="workplace__wrapper container workplace_container">
          <nav className="menu">
            <button
              className="menu__button"
              id="menu__basket-button"
              ref={basketButtonRef}
              onClick={handleOpenBasket}
            >
              <img
                className="menu__icon"
                src={`${process.env.PUBLIC_URL}/svg/arrow_down_icon.svg`}
                alt="arrow"
              />
              <p className="menu__title">Кошик</p>
              <p className="menu__count">{currentOrdersList.length}</p>
            </button>
            <button
              className="menu__button menu__button--white"
              onClick={moveToPayment}
            >
              <img
                className="menu__icon"
                src={`${process.env.PUBLIC_URL}/svg/payment_icon.svg`}
                alt="arrow"
              />
              <p className="menu__title">Оплата</p>
            </button>
            {currentWorkplace === "constructor" && (
              <button
                className="menu__button menu__button--white"
                onClick={handleResetOrder}
              >
                <img
                  className="menu__icon"
                  src={`${process.env.PUBLIC_URL}/svg/reset_icon.svg`}
                  alt="arrow"
                />
              </button>
            )}
          </nav>

          {currentWorkplace === "constructor" && (
            <div className="constructor">
              <div className="constructor__wrap">
                {Object.keys(currentInstance).length === 0 ? (
                  <p className="constructor-empty-message">
                    Конструктор порожній
                  </p>
                ) : (
                  <div>
                    <div className="constructor__object" ref={constuctorRef}>
                      <div className="constructor__object-origin">
                        <img
                          src={`${process.env.REACT_APP_GET_STATIC_URI}/${currentInstance.icon}`}
                          alt="object-icon"
                          className="constructor__object-icon"
                        />
                        <div className="constructor__object-content">
                          <p className="constructor__object-type">
                            {currentInstance.name}
                          </p>
                          <p className="constructor__help-message">
                            Оберіть послугу...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="constructor__services">
                      {currentServices.map((item, index) => (
                        <button
                          key={index}
                          className="constructor__services-item"
                          onClick={() => handleChooseService(item.id)}
                        >
                          <p className="constructor__services-title">
                            {item.name}
                          </p>
                          <img
                            src={`${process.env.REACT_APP_GET_STATIC_URI}/${item.icon}`}
                            alt="service-icon"
                            className="constructor__services-icon"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {currentServices.length === 1 && (
                <div className="constructor__confirm">
                  <p className="constructor__confirm-output">{currentPrice}₴</p>
                  <div className="constructor__confirm-content">
                    <input
                      type="text"
                      className="constructor__confirm-input"
                      placeholder="Введіть к-сть..."
                      value={currentQuantity || ""}
                      onChange={handleChangeQuantity}
                    />
                    <button
                      className="constructor__confirm-button"
                      onClick={handleAddOrder}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/svg/accept_icon.svg`}
                        alt="basket_icon"
                        className="constructor__confirm-icon"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentWorkplace === "basket" && (
            <div className="basket">
              <div className="basket-wrap">
                {currentOrdersList.length === 0 ? (
                  <p className="basket-empty-message">Кошик порожній</p>
                ) : (
                  currentOrdersList.map((item) => (
                    <div
                      className="basket__item"
                      key={item.id}
                      onClick={handleToggleOrderOptions}
                    >
                      <div className="basket__item-wrap">
                        <div className="basket__item-content">
                          <img
                            src={`${process.env.PUBLIC_URL}/svg/arrow_down_icon.svg`}
                            alt="arrow"
                            className="basket__item-arrow"
                          />
                          <img
                            src={`${process.env.REACT_APP_GET_STATIC_URI}/${item.instance.icon}`}
                            alt="icon"
                            className="basket__item-icon"
                          />
                          <p className="basket__item-type">
                            {item.details.name}
                          </p>
                          <p className="basket__item-quantity">
                            {item.details.quantity} шт.
                          </p>
                        </div>
                        <p className="basket__item-price">
                          {item.details.price}₴
                        </p>
                      </div>
                      <div className="basket__item-menu">
                        <button
                          className="basket__menu-button animated_button"
                          onClick={() => handleDeleteOrder(item.id)}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/svg/delete_icon.svg`}
                            alt="icon"
                            className="basket__menu-icon"
                          />
                          <p className="basket__menu-title">Видалити</p>
                        </button>
                        <button
                          className="basket__menu-button"
                          onClick={() => handleRedirect(item.details.url)}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/svg/open_icon.svg`}
                            alt="icon"
                            className="basket__menu-icon"
                          />
                          <p className="basket__menu-title">Перейти</p>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
