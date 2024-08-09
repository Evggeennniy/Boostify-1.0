import { staticPath, apiUrlCreate } from "../../Config";
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
  } = useGlobalContext();
  const [currentPrice, setPrice] = useState(0);
  const confirmButtonRef = useRef(null);
  const card = "5375 4115 9012 5097";

  const handleConfirm = () => {
    const api = new URL(apiUrlCreate);
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
        }
      });
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(card);
    addNotification("Скопійовано!", "ok");
    confirmButtonRef.current.disabled = false;
  };

  const getFullPrice = () => {
    let price = 0;
    currentOrdersList.map((item) => {
      price += +item.details.price;
    });

    return price;
  };

  useEffect(() => {
    const totalPrice = getFullPrice();
    setPrice(totalPrice);
    confirmButtonRef.current.disabled = true;
  }, []);

  return (
    <div className="wrap">
      <section className="payment">
        <div className="payment__wrapper container workplace_container">
          <div className="payment__item">
            <div className="payment__item-data">
              <p className="payment__item-card">{card}</p>
              <p className="payment__item-price">{currentPrice}₴</p>
            </div>
            <button className="payment__item-copy" onClick={handleCopyCard}>
              <img
                src={`${staticPath}/svg/copy_icon.svg`}
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
                src={`${staticPath}/svg/cancel_icon.svg`}
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
