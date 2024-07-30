"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCounterStore } from "@/providers/useStoreProvider";

export const useSyncPatientId = () => {
  const pathname = usePathname();
  const setPatientId = useCounterStore((state) => state.setPatientId);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const patientId = pathSegments[2] || null;
    setPatientId(patientId);
  }, [pathname, setPatientId]);
};
