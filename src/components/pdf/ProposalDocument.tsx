import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import { ProposalDocumentProps } from "@/types/index";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#18181B",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingBottom: 15,
    marginBottom: 20,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#09090B",
  },
  badge: {
    fontSize: 8,
    backgroundColor: "#ECFDF5",
    color: "#047857",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#09090B",
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  gridColumn: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: "#71717A",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#18181B",
  },
  descriptionBox: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#09090B",
  },
  descriptionText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#3F3F46",
  },
  auditBox: {
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#FAFAFA",
    marginTop: 20,
  },
  auditTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#09090B",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  auditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  auditText: {
    fontSize: 8,
    color: "#52525B",
    marginBottom: 3,
  },
  signatureImage: {
  width: 140,
  height: 50,
  objectFit: "contain",
  backgroundColor: "#09090B", // Fundo escuro para destacar o traço claro da assinatura
  borderRadius: 6,
  padding: 4,
},
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#A1A1AA",
    borderTopWidth: 1,
    borderTopColor: "#F4F4F5",
    paddingTop: 10,
  },
});

export function ProposalDocument({ proposal }: ProposalDocumentProps) {
  const formattedAmount = Number(proposal.amount).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.brand}>ProposalEngine</Text>
          <Text style={styles.badge}>
            {proposal.audit ? "DOCUMENTO ASSINADO DIGITALMENTE" : "PROPOSTA COMERCIAL"}
          </Text>
        </View>

        {/* Título & Valor */}
        <View style={styles.section}>
          <Text style={styles.title}>{proposal.title}</Text>
          <Text style={styles.amount}>Valor Total: {formattedAmount}</Text>
        </View>

        {/* Informações das Partes */}
        <View style={styles.grid}>
          <View style={styles.gridColumn}>
            <Text style={styles.label}>Contratante (Cliente)</Text>
            <Text style={styles.value}>{proposal.client.name}</Text>
            <Text style={{ fontSize: 8, color: "#71717A" }}>
              {proposal.client.email}
            </Text>
          </View>
          <View style={styles.gridColumn}>
            <Text style={styles.label}>Prestador de Serviço</Text>
            <Text style={styles.value}>{proposal.user.name}</Text>
            <Text style={{ fontSize: 8, color: "#71717A" }}>
              {proposal.user.email}
            </Text>
          </View>
        </View>

        {/* Descrição do Escopo */}
        <View style={styles.descriptionBox}>
          <Text style={styles.sectionTitle}>Escopo dos Serviços</Text>
          <Text style={styles.descriptionText}>{proposal.description}</Text>
        </View>

        {/* Carimbo de Auditoria e Assinatura */}
        {proposal.audit && (
          <View style={styles.auditBox}>
            <Text style={styles.auditTitle}>
              Registro de Auditoria e Validade Jurídica
            </Text>
            <View style={styles.auditRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.auditText}>
                  Assinado por: {proposal.audit.signerName} ({proposal.audit.signerEmail})
                </Text>
                <Text style={styles.auditText}>
                  Data/Hora: {new Date(proposal.audit.signedAt).toLocaleString("pt-BR")}
                </Text>
                <Text style={styles.auditText}>
                  Endereço IP: {proposal.audit.ipAddress}
                </Text>
                <Text style={styles.auditText}>
                  Navegador: {proposal.audit.userAgent ? proposal.audit.userAgent.substring(0, 45) : 'N/A'}...
                </Text>
              </View>

              {/* Renderização condicional da Imagem Base64/URL */}
              {proposal.audit.signatureImageUrl && (
                <Image
                  src={proposal.audit.signatureImageUrl}
                  style={styles.signatureImage}
                />
              )}
            </View>
          </View>
        )}

        {/* Rodapé */}
        <Text style={styles.footer}>
          Documento gerado e autenticado por ProposalEngine • ID: {proposal.id}
        </Text>
      </Page>
    </Document>
  );
}