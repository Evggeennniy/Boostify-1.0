import { PaymentSteps } from "../Steps";
import { useGlobalContext } from "../../context/GlobalContext";
import { useState, useEffect, useRef } from "react";

export const Payment = () => {
  const {
    addNotification,
    moveToOrdering,
    currentOrdersList,
    setOrdersList,
    setOrderId,
    getFullPrice,
  } = useGlobalContext();
  const [currentPrice, setPrice] = useState(0);
  const confirmButtonRef = useRef(null);
  const card = "4441 1110 6714 1931";

  const handleConfirm = () => {
    const api = new URL(`${process.env.REACT_APP_CREATE_ORDER_API_URI}`);
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...currentOrdersList]),
    })
      .then((response) => {
        if (response.ok) return;
        throw new Error(response.status);
      })
      .then(() => {
        addNotification("Замовлення в обробці!", "loading");
        setOrdersList([]);
        setOrderId(0);
        moveToOrdering();
      })
      .catch((error) => {
        switch (+error.message) {
          case 204:
            return addNotification("Не отримано сервером", "error");
          case 500:
            return addNotification("Помилка сервера", "error");
          default:
            return addNotification("Помилка", "error");
        }
      });
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(card);
    addNotification("Скопійовано!", "ok");
    confirmButtonRef.current.disabled = false;
  };

  useEffect(() => {
    setPrice(() => getFullPrice());
    confirmButtonRef.current.disabled = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrap">
      <section className="payment">
        <div className="payment__wrapper container workplace_container">
          <div className="payment__item">
            <div className="payment__item-data unselectable">
              <p className="payment__item-card">{card}</p>
              <p className="payment__item-price">{currentPrice}₴</p>
            </div>
            <button className="payment__item-copy" onClick={handleCopyCard}>
              <img
                src={`${process.env.PUBLIC_URL}/svg/copy_icon.svg`}
                alt="copy-icon"
                className="payment__item-icon"
              />
            </button>
          </div>
          <div className="payment__menu">
            <button
              className="payment__menu-button"
              onClick={handleConfirm}
              ref={confirmButtonRef}
            >
              Відправив(ла)
            </button>
            <button className="payment__menu-button" onClick={moveToOrdering}>
              <img
                src={`${process.env.PUBLIC_URL}/svg/cancel_icon.svg`}
                alt="cancel-icon"
                className="payment__menu-icon"
              />
            </button>
          </div>
        </div>
      </section>

      <PaymentSteps />
    </div>
  );
};
