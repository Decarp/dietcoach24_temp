"use client";

import { useSyncPatientId } from "@/hooks/useSyncPatientId";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  useSyncPatientId();
  return <>{children}</>;
};

export default ClientWrapper;
