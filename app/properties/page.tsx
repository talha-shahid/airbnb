import EmptyState from "../components/EmptyState";
import ClientsOnly from "../components/ClientsOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import PropertiesClient from "./PropertiesClient";
import getListings from "../actions/getListings";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientsOnly>
        <EmptyState title="Unauthorized" subtitle="Please Login" />
      </ClientsOnly>
    );
  }

  const listings = await getListings({
    userId: currentUser.id,
  });

  if (listings.length === 0) {
    return (
      <ClientsOnly>
        <EmptyState
          title="No Properties Found"
          subtitle="You have no properties"
        />
      </ClientsOnly>
    );
  }

  return (
    <ClientsOnly>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </ClientsOnly>
  );
};

export default PropertiesPage;
