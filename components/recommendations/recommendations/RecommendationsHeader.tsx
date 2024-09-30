import React, { useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PdfDocument from "./PdfDocument"; // The component you created for PDF rendering
import { EnrichedRecommendation, Session } from "@/types/types";
import { PhoneArrowDownLeftIcon } from "@heroicons/react/24/outline";
import { DocumentArrowDownIcon } from "@heroicons/react/20/solid";

const RecommendationsHeader = ({
  numRecommendations,
  sessionData,
  enrichedRecommendations,
}: {
  numRecommendations: number;
  sessionData: Session | undefined;
  enrichedRecommendations: EnrichedRecommendation[];
}) => {
  return (
    <div className="border-b border-gray-300 -mx-6 flex justify-between pb-8 ">
      <div className="mx-6">
        <h2 className="text-xl font-semibold">Empfehlungen</h2>
        <h3 className="text-xs font-light text-gray-500">
          {numRecommendations}{" "}
          {numRecommendations === 1 ? "Empfehlung" : "Empfehlungen"}
        </h3>
      </div>

      {sessionData && (
        <div className="mx-6">
          <PDFDownloadLink
            document={
              <PdfDocument
                session={sessionData}
                enrichedRecommendations={enrichedRecommendations}
              />
            }
            fileName={`session_${sessionData.sessionId}_recommendations.pdf`}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 hover:scale-105 transition-transform"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            PDF herunterladen
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default RecommendationsHeader;
