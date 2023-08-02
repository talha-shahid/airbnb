"use client";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "./ListingHead";
import ListingInfo from "./ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Range } from "react-date-range";

//initial Date Range
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

//Interface
interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

//Listing Client
const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  //disabled Dates
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    /*
      // Each day between 6 October 2014 and 10 October 2014:

      var result = eachDayOfInterval({
        start: new Date(2014, 9, 6),
        end: new Date(2014, 9, 10)
      })

      //=> [
      //   Mon Oct 06 2014 00:00:00,
      //   Tue Oct 07 2014 00:00:00,
      //   Wed Oct 08 2014 00:00:00,
      //   Thu Oct 09 2014 00:00:00,
      //   Fri Oct 10 2014 00:00:00
      // ]
    */

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  //onCreateReservation
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing.id,
      })
      .then(() => {
        toast.success("Listing Reserved");
        setDateRange(initialDateRange);

        //Redirect to /trips
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  //category
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-4">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
