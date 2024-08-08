import React, { createContext, useContext, useState } from "react";
import { currentDataTime } from "../utils";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [pageState, setPageState] = useState("ordering");
  const [pageIsActive, setPageIsActive] = useState(false);
  const [currentNotifications, setNotifications] = useState([]);
  const [currentNotificationsId, setNotificationsId] = useState(0);
  const [currentOrdersList, setOrdersList] = useState([]);
  const [currentOrderId, setOrderId] = useState(0);
  const [currentApiData, setApiData] = useState({});

  const addNotification = (text, type) => {
    const newNotification = {
      message: text,
      type: type,
      notificationId: currentNotificationsId,
      created: currentDataTime(),
    };

    setNotifications((prevState) => [...prevState, newNotification]);
    setNotificationsId((prevId) => prevId + 1);

    setTimeout(() => {
      setNotifications((prevState) => {
        if (prevState.length > 0) {
          return prevState.slice(1);
        }
        return prevState;
      });
    }, 4000);
  };

  const moveToPayment = () => {
    if (currentOrdersList.length >= 1) {
      setPageState("payment");
    } else {
      addNotification("Кошик порожній", "error");
    }
  };

  const moveToOrdering = () => {
    setPageState("ordering");
  };

  return (
    <GlobalContext.Provider
      value={{
        moveToPayment,
        moveToOrdering,
        pageState,
        pageIsActive,
        setPageIsActive,
        currentNotifications,
        addNotification,
        currentOrdersList,
        setOrdersList,
        currentOrderId,
        setOrderId,
        currentApiData,
        setApiData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
