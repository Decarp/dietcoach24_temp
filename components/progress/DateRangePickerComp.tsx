import { useCounterStore } from "@/providers/useStoreProvider";
import { Basket, Patient, Sessions } from "@/types/types";
import { fetchBaskets } from "@/utils/fetchBaskets";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import { fetchSessions } from "@/utils/fetchSessions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LicenseInfo } from "@mui/x-license";
import { useQuery } from "@tanstack/react-query";
import { addWeeks, fromUnixTime, getUnixTime, subWeeks } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de"; // Import the German locale
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI ?? "");

const getUnixTimestamp = (date: Dayjs | null): string =>
  date ? date.unix().toString() : "N/A";

export default function DateRangePickerComp({
  range1ProductCount,
  range2ProductCount,
  range1BasketCount,
  range2BasketCount,
}: {
  range1ProductCount: number;
  range2ProductCount: number;
  range1BasketCount: number;
  range2BasketCount: number;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { setSelectedBasketIds, setSelectedComparisonBasketIds } =
    useCounterStore((state) => state);

  const { data: patient } = useQuery<Patient>({
    queryKey: ["participant", patientId],
    queryFn: () => fetchPatientDetails(patientId, session?.accessToken || ""),
  });

  const { data: sessions } = useQuery<Sessions>({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId, session?.accessToken || ""),
  });

  const ffqTimestamp = patient?.medicalHistory.ffqDate || 0;

  const ffqTimestampMinus8Weeks = getUnixTime(
    subWeeks(fromUnixTime(ffqTimestamp || 0), 8)
  );

  const ffqTimestampPlus8Weeks = getUnixTime(
    addWeeks(fromUnixTime(ffqTimestamp || 0), 8)
  );

  const [range1Dates, setRange1Dates] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [range2Dates, setRange2Dates] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (sessions && sessions.length > 1 && patient) {
      const range1Start = dayjs.unix(ffqTimestampMinus8Weeks);
      const range1End = dayjs.unix(ffqTimestamp);
      setRange1Dates([range1Start, range1End]);

      const range2Start = dayjs.unix(ffqTimestamp);
      const range2End = dayjs.unix(ffqTimestampPlus8Weeks);
      setRange2Dates([range2Start, range2End]);
    }
  }, [sessions, patient, ffqTimestampMinus8Weeks, ffqTimestampPlus8Weeks]);

  const {
    isLoading,
    error,
    data: range1Baskets,
  } = useQuery<Basket[]>({
    queryKey: ["baskets", patientId, range1Dates[0], range1Dates[1]],
    queryFn: () =>
      fetchBaskets(
        patientId,
        getUnixTimestamp(range1Dates[0]),
        getUnixTimestamp(range1Dates[1]),
        session?.accessToken || ""
      ),
    enabled: !!session?.accessToken && !!range1Dates[0] && !!range1Dates[1],
  });

  const {
    isLoading: isLoading2,
    error: error2,
    data: range2Baskets,
  } = useQuery<Basket[]>({
    queryKey: ["baskets", patientId, range2Dates[0], range2Dates[1]],
    queryFn: () =>
      fetchBaskets(
        patientId,
        getUnixTimestamp(range2Dates[0]),
        getUnixTimestamp(range2Dates[1]),
        session?.accessToken || ""
      ),
    enabled: !!session?.accessToken && !!range2Dates[0] && !!range2Dates[1],
  });

  useEffect(() => {
    if (range1Baskets) {
      setSelectedBasketIds(range1Baskets.map((basket) => basket.basketId));
    }
  }, [range1Baskets, setSelectedBasketIds]);

  useEffect(() => {
    if (range2Baskets) {
      setSelectedComparisonBasketIds(
        range2Baskets.map((basket) => basket.basketId)
      );
    }
  }, [range2Baskets, setSelectedComparisonBasketIds]);

  // Set the locale to German
  dayjs.locale("de");

  // Function to calculate the number of weeks between two dates
  const calculateWeeks = (start: Dayjs | null, end: Dayjs | null) => {
    if (start && end) {
      return end.diff(start, "week", true).toFixed(1);
    }
    return "0";
  };

  const range1Weeks = calculateWeeks(range1Dates[0], range1Dates[1]);
  const range2Weeks = calculateWeeks(range2Dates[0], range2Dates[1]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <div className="grid grid-cols-2 gap-28 mt-6">
        <section className="space-y-2">
          <h3 className="text-md font-medium">Zeitfenster 1</h3>
          <DateRangePicker
            value={range1Dates}
            onChange={(newValue) => setRange1Dates(newValue)}
          />
          <p className="text-xs text-gray-500">
            {range1Weeks} Wochen ausgewählt, darin {range1BasketCount} Einkäufe
            mit {range1ProductCount} Lebensmitteln
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-md font-medium">Zeitfenster 2</h3>
          <DateRangePicker
            value={range2Dates}
            onChange={(newValue) => setRange2Dates(newValue)}
          />
          <p className="text-xs text-gray-500">
            {range2Weeks} Wochen ausgewählt, darin {range2BasketCount} Einkäufe,{" "}
            {range2ProductCount} Lebensmitteln
          </p>
        </section>
      </div>
    </LocalizationProvider>
  );
}
