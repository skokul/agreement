import {
  Document,
  Page,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import type { AgreementDocumentModel } from "@/lib/agreement-template";

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 30,
    fontSize: 10,
    lineHeight: 1.5,
    color: "#0f172a"
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 6
  },
  subtitle: {
    fontSize: 9,
    textAlign: "center",
    color: "#475569",
    marginBottom: 18
  },
  section: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4
  },
  paragraph: {
    marginBottom: 4,
    textAlign: "justify"
  },
  summaryBox: {
    marginBottom: 10,
    padding: 10,
    border: "1 solid #cbd5e1",
    borderRadius: 6
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2
  },
  value: {
    fontSize: 9,
    marginBottom: 8
  },
  signatureGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  signatureCard: {
    width: "48%",
    border: "1 solid #cbd5e1",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8
  },
  signatureLine: {
    marginTop: 8,
    fontSize: 9
  }
});

export function AgreementPdfDocument({ model }: { model: AgreementDocumentModel }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{model.title}</Text>
        <Text style={styles.subtitle}>{model.subtitle}</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.label}>Licensor</Text>
          <Text style={styles.value}>{model.parties.licensor.name || "Not specified"}</Text>
          <Text style={styles.label}>Licensee</Text>
          <Text style={styles.value}>{model.parties.licensee.name || "Not specified"}</Text>
          <Text style={styles.label}>Property</Text>
          <Text style={styles.value}>{model.property.description || "Not specified"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preamble</Text>
          {model.preamble.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {model.clauses.map((clause) => (
          <View key={clause.number} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {clause.number}. {clause.title}
            </Text>
            {clause.paragraphs.map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule of the Property</Text>
          {model.property.scheduleLines.map((line, index) => (
            <Text key={index} style={styles.paragraph}>
              {line}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Closing and Signatures</Text>
          {model.closing.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
          {model.signatures.map((signature) => (
            <View key={signature.role} style={styles.signatureCard}>
              <Text style={styles.label}>{signature.role}</Text>
              <Text style={styles.value}>{signature.name || "Not specified"}</Text>
              <Text style={styles.value}>{signature.address || "Not specified"}</Text>
              <Text style={styles.value}>{signature.mobile || "Not specified"}</Text>
              <Text style={styles.signatureLine}>Signature: ______________________</Text>
            </View>
          ))}
          {model.witnesses.map((witness, index) => (
            <View key={index} style={styles.signatureCard}>
              <Text style={styles.label}>Witness {index + 1}</Text>
              <Text style={styles.value}>{witness.name || "Not specified"}</Text>
              <Text style={styles.value}>{witness.address || "Not specified"}</Text>
              <Text style={styles.signatureLine}>Signature: ______________________</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
