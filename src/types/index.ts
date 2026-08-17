





// 1. Defina a interface do objeto Proposal completo
export interface ProposalData {
  id: string;
  title: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  clientId: string;
  signedAt: Date | null;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  audit: {
    id: string;
    signedAt: Date;
    proposalId: string;
    signerName: string;
    signerEmail: string;
    signatureImageUrl: string;
    ipAddress: string;
    userAgent: string;
    pdfUrl: string | null;
  } | null;
  // Se houver mais campos que o TypeScript escondeu no "... 7 more ...", adicione-os aqui se precisar
}
    // 2. Defina a propriedade que o componente espera receber
    export interface ProposalDocumentProps {
      proposal: ProposalData;
    }

