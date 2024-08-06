import { staticPath } from "../../Config";

export const WorkSteps = function () {
  return (
    <section className="steps">
      <div className="steps-wrap container">
        <h4 className="steps__title">
          Як оформити&nbsp;
          <span className="steps__title steps__title--highlight">
            замовлення
          </span>
        </h4>
        <div className="steps__explain">
          <div className="steps__item">
            <img
              src={`${staticPath}/svg/copy_icon.svg`}
              alt="copy-icon"
              className="steps__item-icon"
            />
            <p className="steps__item-title">
              ВСТАВТЕ
              <br />
              ПОСИЛАННЯ
            </p>
          </div>
          <div className="steps__item">
            <img
              src={`${staticPath}/svg/category_icon.svg`}
              alt="category-icon"
              className="steps__item-icon"
            />
            <p className="steps__item-title">
              ОБЕРІТЬ
              <br />
              КАТЕГОРІЮ
            </p>
          </div>
          <div className="steps__item">
            <img
              src={`${staticPath}/svg/payment_icon.svg`}
              alt="payment-icon"
              className="steps__item-icon"
            />
            <p className="steps__item-title">
              ЗРОБІТЬ
              <br />
              ОПЛАТУ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const PaymentSteps = () => {
  return (
    <section className="payment-steps">
      <div className="payment-steps-wrap container">
        <h4 className="payment-steps__title">
          Як оплатити&nbsp;
          <span className="payment-steps__title payment-steps__title--highlight">
            замовлення
          </span>
        </h4>
        <div className="payment-steps__explain">
          <div className="payment-steps__item">
            <img
              src={`${staticPath}/svg/payment_icon.svg`}
              alt="copy-icon"
              className="payment-steps__item-icon"
            />
            <p className="payment-steps__item-title">
              ОПЛАТІТЬ
              <br />
              ЗАМОВЛЕННЯ
            </p>
          </div>
          <div className="payment-steps__item">
            <img
              src={`${staticPath}/svg/click_icon.svg`}
              alt="category-icon"
              className="payment-steps__item-icon"
            />
            <p className="payment-steps__item-title">
              НАТИСНІТЬ
              <br />
              ПІДТВЕРДИТИ
            </p>
          </div>
          <div className="payment-steps__item">
            <img
              src={`${staticPath}/svg/loading_icon.svg`}
              alt="payment-icon"
              className="payment-steps__item-icon"
            />
            <p className="payment-steps__item-title">
              ОЧІКУЙТЕ
              <br />
              15 ХВИЛИН
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
