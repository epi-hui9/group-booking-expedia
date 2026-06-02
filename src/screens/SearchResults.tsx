import { useState } from "react";
import {
  groupTrip,
  hotelCatalog,
  memberById,
  members,
  TRIP_NIGHTS,
  totalForStay,
} from "../data/mockData";
import type { TripStore } from "../state/useTripStore";
import { AvatarStack } from "../components/Avatar";
import { HotelImage } from "../components/HotelImage";
import {
  ArrowRightIcon,
  CheckIcon,
  HeartIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
} from "../components/Icon";

export function SearchResults({ store }: { store: TripStore }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const visibleHotels = hotelCatalog.slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-expedia-surface">
      <div className="border-b border-expedia-line bg-white">
        <div className="mx-auto max-w-[1200px] px-8 py-5">
          <div className="flex items-center gap-3 rounded-full border border-expedia-line bg-white p-1.5 shadow-card">
            <div className="flex flex-1 items-center gap-2 pl-4">
              <SearchIcon size={18} className="text-expedia-slate" />
              <div className="flex items-baseline gap-2 text-sm">
                <span className="font-semibold text-expedia-ink">
                  Las Vegas
                </span>
                <span className="text-expedia-mute">·</span>
                <span className="text-expedia-slate">Aug 15 – 18</span>
                <span className="text-expedia-mute">·</span>
                <span className="text-expedia-slate">6 travelers</span>
              </div>
            </div>
            <button className="rounded-full bg-expedia-yellow px-6 py-2.5 text-sm font-semibold text-expedia-ink transition-colors hover:bg-expedia-yellow-hover">
              Search
            </button>
          </div>

          <button
            onClick={() => store.setScreen("dashboard")}
            className="group mt-4 flex w-full items-center justify-between rounded-2xl border border-expedia-line bg-white p-4 text-left transition-shadow hover:shadow-card"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-expedia-blue-soft text-expedia-blue">
                <PlusIcon size={16} />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold text-expedia-ink">
                  Planning {groupTrip.name} with {groupTrip.guests} friends
                </div>
                <div className="text-[12.5px] text-expedia-slate">
                  Add hotels to the group trip so everyone can react in one
                  place.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AvatarStack members={members} max={6} size="xs" />
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-expedia-blue">
                View group trip
                <ArrowRightIcon size={14} />
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-8 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-expedia-mute">
              Stays · {groupTrip.guests} travelers · {groupTrip.dates}
            </div>
            <h1 className="mt-1 font-display text-[26px] font-extrabold leading-tight text-expedia-ink">
              Las Vegas hotels
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-expedia-slate">
            <span>Showing top picks</span>
          </div>
        </div>

        <div className="space-y-4">
          {visibleHotels.map((hotel) => {
            const added = store.addedIds.includes(hotel.id);
            const adder = memberById(hotel.addedBy);
            const fav = !!favorites[hotel.id];
            return (
              <article
                key={hotel.id}
                className="group flex overflow-hidden rounded-2xl border border-expedia-line bg-white transition-shadow hover:shadow-card"
              >
                <div className="relative h-[200px] w-[280px] shrink-0 overflow-hidden">
                  <HotelImage
                    src={hotel.image}
                    alt={hotel.name}
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {added && (
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-expedia-success px-2.5 py-1 text-[11px] font-semibold text-white">
                      <CheckIcon size={11} strokeWidth={3} />
                      In group trip
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-[19px] font-bold leading-tight text-expedia-ink">
                        {hotel.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3 text-[13px] text-expedia-slate">
                        <span className="inline-flex items-center gap-1 rounded-md bg-expedia-blue-soft px-1.5 py-0.5 text-[12px] font-semibold text-expedia-blue">
                          <StarIcon size={11} className="text-expedia-yellow" />
                          {hotel.rating.toFixed(1)}
                        </span>
                        <span className="text-[12.5px] font-medium">
                          {hotel.reviewCount.toLocaleString()} reviews
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon size={12} />
                          {hotel.location}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 max-w-[460px] text-[13px] leading-relaxed text-expedia-slate">
                        {hotel.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFavorites((f) => ({ ...f, [hotel.id]: !f[hotel.id] }))
                      }
                      className={[
                        "shrink-0 rounded-full p-2 transition-colors",
                        fav
                          ? "text-expedia-danger"
                          : "text-expedia-mute hover:text-expedia-ink",
                      ].join(" ")}
                      aria-label="Save"
                    >
                      <HeartIcon
                        size={20}
                        className={
                          fav ? "fill-current stroke-expedia-danger" : ""
                        }
                      />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-[24px] font-extrabold leading-none text-expedia-ink">
                          ${hotel.pricePerNight}
                        </span>
                        <span className="text-sm font-semibold text-expedia-slate">
                          / night
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-expedia-slate">
                        ${totalForStay(hotel.pricePerNight).toLocaleString()}{" "}
                        total for {TRIP_NIGHTS} nights · taxes &amp; fees
                        included
                      </div>
                    </div>
                    {added ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-expedia-success-soft px-3.5 py-2 text-sm font-semibold text-expedia-success">
                        <CheckIcon size={14} strokeWidth={3} />
                        In group trip
                      </span>
                    ) : (
                      <button
                        onClick={() => store.addOption(hotel.id)}
                        className="btn-yellow"
                      >
                        <PlusIcon size={14} />
                        Add to group trip
                      </button>
                    )}
                  </div>
                  {added && (
                    <div className="mt-3 border-t border-expedia-line pt-2.5 text-[11.5px] text-expedia-mute">
                      {hotel.addedAtLabel.startsWith("Added")
                        ? hotel.addedAtLabel
                        : `Added by ${adder.name}`}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
