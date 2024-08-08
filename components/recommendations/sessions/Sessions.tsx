import { getBaskets } from "@/api/getBaskets";
import { useCounterStore } from "@/providers/useStoreProvider";
import { classNames } from "@/utils/classNames";
import { formatDate } from "@/utils/formatDate";
import { mapBasketsResponse } from "@/utils/mapBasketsResponse";
import {
  PencilSquareIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import SessionsHeader from "./SessionsHeader";
import { useState } from "react";
import { getSessions } from "@/api/getSessions";

const Sessions = () => {
  const sessionsResponse = getSessions();

  const { selectedSessionId, setSelectedSessionId } = useCounterStore(
    (state) => state
  );

  const handleBasketCheckboxChange = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  return (
    <div className="pt-6 -ml-8 bg-white border-x flex flex-col border-b border-gray-300 xl:w-64 xl:shrink-0 h-[calc(100vh-183px)]">
      <SessionsHeader />

      <div className="bg-white flex-1 overflow-y-auto min-h-0 min-h-8 shadow-inner">
        <ul aria-label="Sessions List" className="overflow-y-auto">
          {sessionsResponse.map((session) => (
            <li
              key={session.sessionId}
              className={classNames(
                "pl-8 flex items-center gap-x-4 px-3 py-5",
                selectedSessionId === session.sessionId
                  ? "bg-primary text-white"
                  : ""
              )}
            >
              <PencilSquareIcon
                className={classNames(
                  "border border-gray-300 h-12 w-12 p-2 flex-none rounded-md",
                  selectedSessionId === session.sessionId
                    ? "bg-white text-primary"
                    : "bg-gray-50 text-primary"
                )}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={classNames(
                    "text-base font-semibold leading-6",
                    selectedSessionId === session.sessionId
                      ? "text-white"
                      : "text-gray-900"
                  )}
                >
                  Sitzung {session.index}
                </p>
                <p
                  className={classNames(
                    "truncate text-sm leading-5",
                    selectedSessionId === session.sessionId
                      ? "text-white"
                      : "text-gray-500"
                  )}
                >
                  {formatDate(session.timestamp)}
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 mr-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedSessionId === session.sessionId}
                onChange={() => handleBasketCheckboxChange(session.sessionId)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sessions;
