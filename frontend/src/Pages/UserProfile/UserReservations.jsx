import React, { useEffect, useState } from "react";
import api from "../../backend";
import { useNavigate, useParams } from "react-router-dom";
import backIcon from "../../assets/basicIcon/backIcon.png";
import toast from "react-hot-toast";
import UserReservationsList from "./reservations/UserReservationsList";
import UserReservationsData from "./reservations/UserReservationsData";

export const UserReservations = () => {
  const [data, setdata] = useState([]);

  const getData = async () => {
    const response = await api.get("/reservations/get_customer_reservations");
    console.log("====================================");
    console.log(response.data);
    setdata(response.data);
    console.log("====================================");
  };

  useEffect(() => {
    getData();
  }, []);

  const location = useNavigate();

  const [activePage, setActivePage] = useState(1);
  const active = JSON.parse(sessionStorage.getItem("reservationsPage"));

  // =====================================================================================
  const { id } = useParams();

  var redirect = () => {
    toast.error("Please, Login or SignUp");
    navigate("/");
  };
  useEffect(() => {
    if (id === "undefined") {
      redirect();
    }
    return () => {
      redirect = null;
    };
  }, []);
  // ========================================================================================

  useEffect(() => {
    const activePageNumber = JSON.parse(sessionStorage.getItem("reservations"));
    if (activePageNumber !== activePage) {
      setActivePage(activePageNumber);
    }
  }, [activePage]);

  return (
    <>
      <section className=" max-w-[1200px] mx-auto px-4 sm:px-8 md:px-10 xl:px-20 py-5 md:py-12">
        <div
          onClick={() => {
            location("/");
          }}
          className=" cursor-pointer hover:rounded-full hover:bg-[#f1f1f1] inline-block p-4 -ml-4">
          <img src={backIcon} alt="back" className=" w-4 mix-blend-darken" />
        </div>
        <>
          <UserReservationsList active={active} setActivePage={setActivePage} />
        </>
        <>
          <UserReservationsData active={active} data={data} />
        </>
      </section>
    </>
  );
};
