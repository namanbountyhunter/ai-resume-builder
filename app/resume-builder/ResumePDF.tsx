import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const getStyles = (template: string) => {
  const base = {
    page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
    subheader: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },
  };

  if (template === 'modern') {
    return StyleSheet.create({
      ...base,
      page: { ...base.page, backgroundColor: '#FAFAFA' },
      header: { ...base.header, color: '#1E40AF' },
      sectionTitle: { ...base.sectionTitle, color: '#1E40AF', borderBottom: '2px solid #1E40AF' },
    });
  } 
  else if (template === 'creative') {
    return StyleSheet.create({
      ...base,
      page: { ...base.page, backgroundColor: '#F0F9FF' },
      header: { ...base.header, color: '#4338CA' },
      sectionTitle: { ...base.sectionTitle, color: '#4338CA', borderBottom: '2px solid #4338CA' },
    });
  } 
  else {
    // Classic
    return StyleSheet.create({
      ...base,
      page: { ...base.page, backgroundColor: '#FFFFFF' },
      header: { ...base.header, color: '#111827' },
      sectionTitle: { ...base.sectionTitle, color: '#111827', borderBottom: '1px solid #111827' },
    });
  }
};

export default function ResumePDF({ formData, template = 'classic' }: { formData: any; template?: string }) {
  const styles = getStyles(template);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>{formData.fullName || "Your Name"}</Text>
        <Text style={styles.subheader}>{formData.headline}</Text>

        {/* Summary */}
        {formData.summary && (
          <>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ lineHeight: 1.5, marginBottom: 12 }}>{formData.summary}</Text>
          </>
        )}

        {/* Experience */}
        {formData.experiences?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Experience</Text>
            {formData.experiences.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={{ fontWeight: 'bold' }}>{exp.role} — {exp.company}</Text>
                <Text style={{ color: '#555', fontSize: 10.5, marginBottom: 4 }}>{exp.duration}</Text>
                {exp.description && <Text style={{ lineHeight: 1.4 }}>{exp.description}</Text>}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {formData.education?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            {formData.education.map((edu: any, i: number) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                <Text style={{ color: '#555' }}>{edu.school} • {edu.year}</Text>
              </View>
            ))}
          </>
        )}

        {/* Projects */}
        {formData.projects?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Projects</Text>
            {formData.projects.map((proj: any, i: number) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={{ fontWeight: 'bold' }}>{proj.title}</Text>
                {proj.tech && <Text style={{ color: '#555', fontSize: 10.5 }}>Tech: {proj.tech}</Text>}
                {proj.description && <Text style={{ lineHeight: 1.4, marginTop: 4 }}>{proj.description}</Text>}
              </View>
            ))}
          </>
        )}

        {/* Skills */}
        {formData.skills && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={{ lineHeight: 1.5 }}>{formData.skills}</Text>
          </>
        )}
      </Page>
    </Document>
  );
}