import EmptyState from "../components/EmptyState";
import ClientsOnly from "../components/ClientsOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getFavouriteListings from "../actions/getFavouriteListings";
import FavouriteClient from "./FavouriteClient";

const ListingPage = async () => {
  const listings = await getFavouriteListings();
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientsOnly>
        <EmptyState
          title="No favourites found"
          subtitle="Looks like you have no favourite listings"
        />
      </ClientsOnly>
    );
  }

  return (
    <ClientsOnly>
      <FavouriteClient listings={listings} currentUser={currentUser} />
    </ClientsOnly>
  );
};

export default ListingPage;
