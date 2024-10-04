import React, { useState } from "react";
import {
  EnrichedRecommendation,
  Patient,
  Session,
  DatabaseProduct,
} from "@/types/types";
import { pdf } from "@react-pdf/renderer";
import PdfDocument from "./PdfDocument";
import { DocumentArrowDownIcon } from "@heroicons/react/20/solid";
import { Spinner } from "@/components/Spinner";
import Button from "@/components/Button";
import toast from "react-hot-toast";

type PdfDownloadButtonProps = {
  sessionData: Session;
  enrichedRecommendations: EnrichedRecommendation[];
  patient: Patient;
};

const fetchBase64Image = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `/api/images?url=${encodeURIComponent(imageUrl)}`
    );
    if (!response.ok) {
      console.error("Error fetching base64 image:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data.dataUrl as string;
  } catch (error) {
    console.error("Error fetching base64 image:", error);
    return null;
  }
};

const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  sessionData,
  enrichedRecommendations,
  patient,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadClick = async () => {
    setLoading(true);

    const enrichedRecommendationsWithBase64: EnrichedRecommendation[] =
      await Promise.all(
        enrichedRecommendations.map(async (rec) => {
          const currentProductsWithBase64 = await Promise.all(
            rec.suggestions.current.map(async (product) => {
              const base64Image =
                (await fetchBase64Image(product.imageUrl)) || "";
              const updatedProduct: DatabaseProduct = {
                ...product,
                base64Image,
              };
              return updatedProduct;
            })
          );

          const alternativeProductsWithBase64 = await Promise.all(
            rec.suggestions.alternatives.map(async (product) => {
              const base64Image =
                (await fetchBase64Image(product.imageUrl)) || "";
              const updatedProduct: DatabaseProduct = {
                ...product,
                base64Image,
              };
              return updatedProduct;
            })
          );

          return {
            ...rec,
            suggestions: {
              current: currentProductsWithBase64,
              alternatives: alternativeProductsWithBase64,
            },
          };
        })
      );

    const pdfDoc = (
      <PdfDocument
        session={sessionData}
        enrichedRecommendations={enrichedRecommendationsWithBase64}
        patient={patient}
      />
    );

    // Generate PDF and trigger download
    const asPdf = pdf();
    asPdf.updateContainer(pdfDoc);
    const blob = await asPdf.toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session_${sessionData.sessionId}_recommendations.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("PDF erfolgreich heruntergeladen", {
      duration: 3000,
    });

    setLoading(false);
  };

  return (
    <Button
      onClick={handleDownloadClick}
      icon={<DocumentArrowDownIcon className="h-5 w-5" />}
      loading={loading}
      loadingIcon={<Spinner className="h-5 w-5" />}
      loadingText="PDF wird generiert..."
    >
      PDF herunterladen
    </Button>
  );
};

export default PdfDownloadButton;
