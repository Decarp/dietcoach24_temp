import { EnrichedRecommendation, Patient, Session } from "@/types/types";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import { base64Logo, styles } from "./PdfConstants";

type PdfDocumentProps = {
  session: Session;
  enrichedRecommendations: EnrichedRecommendation[];
  patient: Patient;
};

const PdfDocument: React.FC<PdfDocumentProps> = ({
  session,
  enrichedRecommendations,
  patient,
}) => {
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Ernährungsempfehlungen</Text>
      <Text style={styles.textGray}>
        {`${new Date().toLocaleDateString("de-DE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}, ${new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })} Uhr`}
        {"  ·  "}
        {`${patient?.profile.firstName} ${patient?.profile.lastName}`}
        {"  ·  "}
        {`Sitzung ${session.index}`}
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer} fixed>
      <View style={styles.footerLeft}>
        <Image src={base64Logo} style={styles.footerLogo} />
        <Text style={styles.footerBrand}>DietCoach</Text>
      </View>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          `Seite ${pageNumber} von ${totalPages}`
        }
      />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}

        <View style={styles.section}>
          {enrichedRecommendations.map((rec, index) => {
            const currentProductsEmpty = rec.suggestions.current.length === 0;
            const alternativeProductsEmpty =
              rec.suggestions.alternatives.length === 0;

            return (
              <View key={rec.recommendationId} style={{ marginBottom: 20 }}>
                <Text style={[styles.heading, { fontWeight: 700 }]}>
                  Empfehlung {index + 1}:{" "}
                  {rec.rule.variant === "VAR1" && (
                    <>
                      {rec.rule.mode}
                      <Text style={{ color: "gray" }}> der Zufuhr von </Text>
                      {rec.rule.nutrient}
                      <Text style={{ color: "gray" }}> aus </Text>
                      {rec.rule.category}
                    </>
                  )}
                  {rec.rule.variant === "VAR2" && (
                    <>
                      {rec.rule.mode}
                      <Text style={{ color: "gray" }}> der Zufuhr von </Text>
                      {rec.rule.category}
                    </>
                  )}
                  {rec.rule.variant === "FREITEXT" && <>{rec.rule.text}</>}
                </Text>

                {rec.notes && (
                  <Text style={styles.text}>
                    <Text style={styles.subheading}>Notiz:</Text> {rec.notes}
                  </Text>
                )}

                {/* Check if both lists are empty */}
                {currentProductsEmpty && alternativeProductsEmpty ? (
                  <Text style={styles.text}>Keine Produkte selektiert</Text>
                ) : (
                  <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                      <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>
                          Gekaufte Produkte
                        </Text>
                      </View>
                      <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>
                          Alternative Produkte
                        </Text>
                      </View>
                    </View>

                    {/* Table Rows */}
                    <View style={styles.tableRow}>
                      {/* Current Product */}
                      <View style={styles.tableCol}>
                        {!currentProductsEmpty &&
                          rec.suggestions.current.map((currentProduct, idx) => (
                            <View key={idx}>
                              <Text style={styles.tableCell}>
                                <Text style={styles.subheading}>
                                  {currentProduct.de.name}
                                </Text>
                              </Text>
                              <View style={styles.productRow}>
                                {currentProduct.base64Image && (
                                  <Image
                                    src={currentProduct.base64Image}
                                    style={styles.image}
                                  />
                                )}
                                <View>
                                  <Text style={styles.tableCell}>
                                    Kohlenhydrate:{" "}
                                    {currentProduct.nutrients.carbohydrates}g
                                    <Text
                                      style={{ fontWeight: 700, color: "gray" }}
                                    >
                                      {" "}
                                      / 100g
                                    </Text>
                                  </Text>
                                  <Text style={styles.tableCell}>
                                    Fett: {currentProduct.nutrients.fats}g
                                    <Text
                                      style={{ fontWeight: 700, color: "gray" }}
                                    >
                                      {" "}
                                      / 100g
                                    </Text>
                                  </Text>
                                  <Text style={styles.tableCell}>
                                    Protein: {currentProduct.nutrients.proteins}
                                    g
                                    <Text
                                      style={{ fontWeight: 700, color: "gray" }}
                                    >
                                      {" "}
                                      / 100g
                                    </Text>
                                  </Text>
                                  <Text style={styles.tableCell}>
                                    Ballaststoffe:{" "}
                                    {currentProduct.nutrients.fibers}g
                                    <Text
                                      style={{ fontWeight: 700, color: "gray" }}
                                    >
                                      {" "}
                                      / 100g
                                    </Text>
                                  </Text>
                                  <Text style={styles.tableCell}>
                                    Zucker: {currentProduct.nutrients.sugars}g
                                    <Text
                                      style={{ fontWeight: 700, color: "gray" }}
                                    >
                                      {" "}
                                      / 100g
                                    </Text>
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>

                      {/* Alternative Product */}
                      <View style={styles.tableCol}>
                        {!alternativeProductsEmpty &&
                          rec.suggestions.alternatives.map(
                            (alternativeProduct, idx) => (
                              <View key={idx}>
                                <Text style={styles.tableCell}>
                                  <Text style={styles.subheading}>
                                    {alternativeProduct.de.name}
                                  </Text>
                                </Text>
                                <View style={styles.productRow}>
                                  {alternativeProduct.base64Image && (
                                    <Image
                                      src={alternativeProduct.base64Image}
                                      style={styles.image}
                                    />
                                  )}
                                  <View>
                                    <Text style={styles.tableCell}>
                                      Kohlenhydrate:{" "}
                                      {
                                        alternativeProduct.nutrients
                                          .carbohydrates
                                      }
                                      g
                                      <Text
                                        style={{
                                          fontWeight: 700,
                                          color: "gray",
                                        }}
                                      >
                                        {" "}
                                        / 100g
                                      </Text>
                                    </Text>
                                    <Text style={styles.tableCell}>
                                      Fett: {alternativeProduct.nutrients.fats}g
                                      <Text
                                        style={{
                                          fontWeight: 700,
                                          color: "gray",
                                        }}
                                      >
                                        {" "}
                                        / 100g
                                      </Text>
                                    </Text>
                                    <Text style={styles.tableCell}>
                                      Protein:{" "}
                                      {alternativeProduct.nutrients.proteins}g
                                      <Text
                                        style={{
                                          fontWeight: 700,
                                          color: "gray",
                                        }}
                                      >
                                        {" "}
                                        / 100g
                                      </Text>
                                    </Text>
                                    <Text style={styles.tableCell}>
                                      Ballaststoffe:{" "}
                                      {alternativeProduct.nutrients.fibers}g
                                      <Text
                                        style={{
                                          fontWeight: 700,
                                          color: "gray",
                                        }}
                                      >
                                        {" "}
                                        / 100g
                                      </Text>
                                    </Text>
                                    <Text style={styles.tableCell}>
                                      Zucker:{" "}
                                      {alternativeProduct.nutrients.sugars}g
                                      <Text
                                        style={{
                                          fontWeight: 700,
                                          color: "gray",
                                        }}
                                      >
                                        {" "}
                                        / 100g
                                      </Text>
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            ),
                          )}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {renderFooter()}
      </Page>
    </Document>
  );
};

export default PdfDocument;
