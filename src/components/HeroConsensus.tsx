import { members } from "../data/mockData";
import { ReactionAvatar } from "./Avatar";
import { ConsensusMeter } from "./ConsensusMeter";
import {
  ArrowRightIcon,
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  TrophyIcon,
} from "./Icon";
import type { RankedOption } from "../state/useTripStore";

export function HeroConsensus({
  leading,
  onContinue,
  onOpenDetail,
}: {
  leading: RankedOption;
  onContinue: () => void;
  onOpenDetail: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-expedia-line bg-white shadow-hero">
      <div className="flex">
        <div className="relative h-[260px] w-[360px] shrink-0 overflow-hidden">
          <img
            src={leading.image}
            alt={leading.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-expedia-yellow px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-expedia-ink shadow">
            <TrophyIcon size={12} />
            Leading option
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <button
            onClick={onOpenDetail}
            className="text-left font-display text-[22px] font-extrabold leading-tight text-expedia-ink hover:underline"
          >
            {leading.name}
          </button>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px] text-expedia-slate">
            <span className="inline-flex items-center gap-1 rounded-md bg-expedia-blue-soft px-1.5 py-0.5 text-[12px] font-semibold text-expedia-blue">
              <StarIcon size={11} className="text-expedia-yellow" />
              {leading.rating.toFixed(1)}
            </span>
            <span className="font-display text-[18px] font-extrabold text-expedia-ink">
              ${leading.pricePerNight}
              <span className="ml-0.5 text-xs font-semibold text-expedia-slate">
                / night
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPinIcon size={12} /> {leading.location}
            </span>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-[12px] font-semibold text-expedia-slate">
              <span>Group reactions</span>
              <span>
                {leading.yes} Yes · {leading.not} Not for me · {leading.none} no
                reaction yet
              </span>
            </div>
            <div className="mt-2">
              <ConsensusMeter
                yes={leading.yes}
                not={leading.not}
                none={leading.none}
                total={Object.keys(leading.reactionsByMember).length}
                size="lg"
              />
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              {members.map((m) => (
                <ReactionAvatar
                  key={m.id}
                  member={m}
                  reaction={leading.reactionsByMember[m.id] ?? null}
                  size="sm"
                />
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
            <button onClick={onContinue} className="btn-primary">
              Continue to booking
              <ArrowRightIcon size={14} />
            </button>
            <button onClick={onOpenDetail} className="btn-secondary">
              See details
            </button>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-expedia-mute">
              <ShieldIcon size={12} />
              No one is charged yet.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
