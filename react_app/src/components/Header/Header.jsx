export const Header = function () {
  return (
    <header className="header">
      <div className="header-wrap container">
        <div className="logotype">
          <img
            src={`${process.env.PUBLIC_URL}/img/logotype.png`}
            alt="logotype"
            className="logotype__img"
          />
          <h2 className="logotype__cmp-name">Capilike</h2>
        </div>
        <div className="nav">
          <ul className="nav__list">
            <li className="nav__item">
              <a
                href="https://t.me/Evgeniy_DevX"
                target="_blank"
                rel="noreferrer"
                className="nav__link"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/svg/support_icon.svg`}
                  alt="icon"
                  className="nav__link-icon"
                />
                <span className="nav__link-title">Підтримка</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
