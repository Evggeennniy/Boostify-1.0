import { PaymentSteps } from "../Steps";
import { useGlobalContext } from "../../context/GlobalContext";
import { useCashbackContext } from "../../context/CashbackContext";
import { CashbackCard } from "../CashbackCard";
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
  const { cashback } = useCashbackContext();

  const [currentPrice, setPrice] = useState(0);
  const [isVisiblePayCashback, setPayCashback] = useState(false);

  const confirmButtonRef = useRef(null);
  const card = "4441 1110 6714 1931";

  const handleConfirm = (is_cashback_pay) => {
    const api = new URL(`${process.env.REACT_APP_CREATE_ORDER_API_URI}`);
    fetch(api, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_cashback_pay: is_cashback_pay,
        items: [...currentOrdersList],
      }),
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

  useEffect(() => {
    if (cashback >= currentPrice) {
      setPayCashback(true);
    } else {
      setPayCashback(false);
    }
  }, [cashback, currentPrice]);

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
          <CashbackCard balance={cashback} />
          <div className="payment__menu">
            {isVisiblePayCashback && (
              <button
                className="payment__menu-button"
                onClick={() => {
                  handleConfirm(true);
                }}
              >
                Оплата кешбеком
              </button>
            )}
            <button
              className="payment__menu-button"
              onClick={() => {
                handleConfirm(false);
              }}
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
