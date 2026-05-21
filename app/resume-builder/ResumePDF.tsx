import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontSize: 11, 
    fontFamily: 'Helvetica' 
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center' as const,
    marginBottom: 6 
  },
  subheader: { 
    fontSize: 14, 
    color: '#444', 
    textAlign: 'center' as const,
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginTop: 20, 
    marginBottom: 8, 
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #ddd',
    paddingBottom: 4,
    color: '#111'
  },
  company: { 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  date: { 
    color: '#666', 
    marginBottom: 6,
    fontSize: 10.5
  },
  text: { 
    marginBottom: 6, 
    lineHeight: 1.4 
  }
});

export default function ResumePDF({ formData, template = 'classic' }: { formData: any; template?: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{formData.fullName || "Your Name"}</Text>
        <Text style={styles.subheader}>{formData.headline}</Text>

        {formData.summary && (
          <>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{formData.summary}</Text>
          </>
        )}

        {formData.experiences?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Experience</Text>
            {formData.experiences.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={styles.company}>{exp.role} — {exp.company}</Text>
                <Text style={styles.date}>{exp.duration}</Text>
                {exp.description && <Text style={styles.text}>{exp.description}</Text>}
              </View>
            ))}
          </>
        )}

        {formData.education?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            {formData.education.map((edu: any, i: number) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={styles.company}>{edu.degree}</Text>
                <Text style={styles.date}>{edu.school} • {edu.year}</Text>
              </View>
            ))}
          </>
        )}

        {formData.projects?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Projects</Text>
            {formData.projects.map((proj: any, i: number) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={styles.company}>{proj.title}</Text>
                {proj.tech && <Text style={styles.date}>Tech: {proj.tech}</Text>}
                {proj.description && <Text style={styles.text}>{proj.description}</Text>}
              </View>
            ))}
          </>
        )}

        {formData.skills && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.text}>{formData.skills}</Text>
          </>
        )}
      </Page>
    </Document>
  );
}