import { useGlobalContext } from "../../context/GlobalContext";

export const Notifications = () => {
  const { currentNotifications } = useGlobalContext();

  return (
    <div className="notification">
      <div className="notification-wrap">
        {currentNotifications.map((item) => (
          <div className="notification__item" key={item.notificationId}>
            <img
              src={`${process.env.PUBLIC_URL}/svg/${item.type}_icon.svg`}
              alt="icon"
              className="notification__icon"
            />
            <p className="notification__title">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
