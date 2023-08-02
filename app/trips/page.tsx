import EmptyState from "../components/EmptyState";
import ClientsOnly from "../components/ClientsOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientsOnly>
        <EmptyState title="Unauthorized" subtitle="Please Login" />
      </ClientsOnly>
    );
  }

  const reservations = await getReservations({
    userId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientsOnly>
        <EmptyState title="No Trips" subtitle="You have no trips" />
      </ClientsOnly>
    );
  }

  return (
    <ClientsOnly>
      <TripsClient reservations={reservations} currentUser={currentUser} />
    </ClientsOnly>
  );
};

export default TripsPage;
