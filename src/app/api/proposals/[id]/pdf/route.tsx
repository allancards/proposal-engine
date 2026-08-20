import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { ProposalDocument } from "@/components/pdf/ProposalDocument";
import React from "react";
import {ProposalDocumentProps} from "@/types/index";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        client: true,
        user: true,
        audit: true,
      },
    });

    if (!proposal) {
      return new NextResponse("Proposta não encontrada", { status: 404 });
    }

    // Renderiza o PDF para um NodeStream
    const stream = await renderToStream(
      <ProposalDocument proposal={proposal as any} />
    );

    // Converte o NodeStream para Web ReadableStream compativel com NextResponse
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="proposta-${proposal.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return new NextResponse("Erro ao gerar PDF", { status: 500 });
  }
}