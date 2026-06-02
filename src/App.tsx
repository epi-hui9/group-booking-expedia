import { useEffect, useMemo, useState } from "react";
import { TopNav } from "./components/TopNav";
import { SearchResults } from "./screens/SearchResults";
import { EmptyDashboard } from "./screens/EmptyDashboard";
import { Dashboard } from "./screens/Dashboard";
import { ReadyToBook } from "./screens/ReadyToBook";
import {
  currentUserId,
  rankOptions,
  useTripStore,
} from "./state/useTripStore";
import { Toast } from "./components/Toast";
import { OptionDetailModal } from "./components/OptionDetailModal";
import { DemoNav } from "./components/DemoNav";

function useDevMode(): boolean {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("dev") === "1";
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d") && e.altKey) {
        setEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return enabled;
}

export default function App() {
  const store = useTripStore();
  const devMode = useDevMode();

  const ranked = useMemo(() => rankOptions(store.options), [store.options]);
  const detailOption = store.detailOptionId
    ? ranked.find((o) => o.id === store.detailOptionId)
    : null;

  const renderedScreen =
    store.screen === "dashboard" && store.options.length === 0
      ? "empty"
      : store.screen;

  return (
    <div className="min-h-full bg-white text-expedia-body">
      <TopNav screen={store.screen} onNavigate={store.setScreen} />

      <div key={store.screen} className="animate-fadeIn">
        {renderedScreen === "search" && <SearchResults store={store} />}
        {renderedScreen === "empty" && <EmptyDashboard store={store} />}
        {renderedScreen === "dashboard" && <Dashboard store={store} />}
        {renderedScreen === "ready" && <ReadyToBook store={store} />}
      </div>

      {detailOption && (
        <OptionDetailModal
          option={detailOption}
          currentUserId={currentUserId}
          onClose={() => store.setDetailOptionId(null)}
          onReact={(v) =>
            store.setReaction(detailOption.id, currentUserId, v)
          }
          onSetReason={(reason) =>
            store.setNotForMeReason(detailOption.id, currentUserId, reason)
          }
        />
      )}

      {store.toast && (
        <Toast
          key={store.toast.id}
          title={store.toast.title}
          onClose={store.dismissToast}
          onAction={
            store.toast.action === "view_trip"
              ? () => {
                  store.dismissToast();
                  store.setScreen("dashboard");
                }
              : undefined
          }
        />
      )}

      {devMode && (
        <DemoNav
          screen={store.screen}
          onNavigate={(s) => {
            if (s === "empty") {
              store.resetTrip();
              store.setScreen("empty");
            } else if (s === "dashboard" && store.options.length === 0) {
              store.restoreDemo();
              store.setScreen("dashboard");
            } else {
              store.setScreen(s);
            }
          }}
          onOpenDrawer={() => {
            if (store.options.length === 0) {
              store.restoreDemo();
            }
            if (store.screen === "search" || store.screen === "empty") {
              store.setScreen("dashboard");
            }
            setTimeout(() => store.setDetailOptionId("wynn"), 100);
          }}
        />
      )}
    </div>
  );
}
