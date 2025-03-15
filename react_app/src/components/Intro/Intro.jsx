export const Intro = function () {
  return (
    <section className="intro">
      <div className="intro-wrap container">
        <h2 className="intro__title">Our services of</h2>
        <img
          src={`${process.env.PUBLIC_URL}/svg/promotion.svg`}
          alt="PROMOTION"
          className="intro__img"
        />
        <h4 className="intro__subtitle">
          Сервіс який дозволяє в один клік
          <br />
          зробити бажаний актив
        </h4>
      </div>
    </section>
  );
};
