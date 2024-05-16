import { useDispatch, useSelector } from "react-redux";
import UserAllReservations from "./UserAllReservations";
import UserCompletedReservations from "./UserCompletedReservations";
import UserUpcomingReservation from "./UserUpcomingReservation";
import { useEffect, useState } from "react";
import { removeDuplicates } from "../../../hooks/useRemoveDuplicates";
import { getAuthorReservations } from "../../../redux/actions/reservationsActions";

/* eslint-disable react/prop-types */
const UserReservationsData = ({ active, data }) => {
  // const authorReservations = useSelector(
  //   (state) => state.reservations.authorReservations
  // );
  const [reservations, setReservations] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);
  const dispatch = useDispatch();

  // getting authors reservation
  // useEffect(() => {
  //   dispatch(getAuthorReservations());
  // }, []);

  // removing duplicates
  useEffect(() => {
    setReservations(removeDuplicates(data, "checkIn", "checkOut"));
  }, [data]);

  // setting upcoming and completed reservations
  useEffect(() => {
    const currentDate = new Date().toISOString();

    const upcoming = reservations.filter(
      (reservation) => reservation.checkIn > currentDate
    );
    const completed = reservations.filter(
      (reservation) => reservation.checkOut < currentDate
    );

    setUpcomingReservations(upcoming);
    setCompletedReservations(completed);
  }, [reservations]);

  return (
    <section className="  py-10 flex justify-center items-center overflow-x-auto pl-10 sm:pl-44 lg:pl-0">
      <div className=" text-xl font-semibold">
        {active === 1 ? (
          <>
            <UserUpcomingReservation data={upcomingReservations} />
          </>
        ) : active === 2 ? (
          <>
            <UserCompletedReservations data={completedReservations} />
          </>
        ) : active === 3 ? (
          <>{/* <UserCancelledReservations /> */}</>
        ) : (
          <>
            <UserAllReservations />
          </>
        )}
      </div>
    </section>
  );
};

export default UserReservationsData;
