import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { EnrichedRecommendation, Session } from "@/types/types"; // Assuming your types are exported in types file

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  text: { fontSize: 12, marginBottom: 5 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  column: { width: "48%" }, // Adjust column width for spacing
  tableHeader: { fontWeight: "bold", marginBottom: 5 },
});

type PdfDocumentProps = {
  session: Session;
  enrichedRecommendations: EnrichedRecommendation[];
};

const PdfDocument: React.FC<PdfDocumentProps> = ({
  session,
  enrichedRecommendations,
}) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Session ID: {session.sessionId}</Text>
        <Text style={styles.text}>
          Timestamp: {new Date(session.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.text}>Recommendations:</Text>

        {enrichedRecommendations.map((rec) => (
          <View key={rec.recommendationId} style={styles.section}>
            <Text style={styles.text}>
              Recommendation ID: {rec.recommendationId}
            </Text>
            <Text style={styles.text}>Variant: {rec.rule.variant}</Text>
            <Text style={styles.text}>Nutrient: {rec.rule.nutrient}</Text>
            <Text style={styles.text}>Mode: {rec.rule.mode}</Text>
            <Text style={styles.text}>Category: {rec.rule.category}</Text>

            {/* Two Column Table */}
            <View style={styles.row}>
              {/* Current Suggestions Column */}
              <View style={styles.column}>
                <Text style={styles.tableHeader}>Current Suggestions:</Text>
                {rec.suggestions.current.map((product) => (
                  <View key={product.gtins[0]} style={styles.section}>
                    <Text style={styles.text}>
                      Product ID: {product.gtins[0]}
                    </Text>
                    <Text style={styles.text}>
                      Product Name: {product.de.name}
                    </Text>
                    <Image src={product.imageUrl} />
                  </View>
                ))}
              </View>

              {/* Alternative Suggestions Column */}
              <View style={styles.column}>
                <Text style={styles.tableHeader}>Alternative Suggestions:</Text>
                {rec.suggestions.alternatives.map((product) => (
                  <View key={product.gtins[0]} style={styles.section}>
                    <Text style={styles.text}>
                      Product ID: {product.gtins[0]}
                    </Text>
                    <Text style={styles.text}>
                      Product Name: {product.de.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
