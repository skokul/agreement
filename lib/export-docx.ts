import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { AgreementDocumentModel } from "@/lib/agreement-template";

function clauseParagraphs(text: string[]) {
  return text.map(
    (paragraph) =>
      new Paragraph({
        text: paragraph,
        spacing: { after: 120, line: 280 },
        alignment: AlignmentType.JUSTIFIED
      })
  );
}

export async function createAgreementDocxBlob(model: AgreementDocumentModel) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: model.title, bold: true, size: 32 })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 }
          }),
          new Paragraph({
            children: [new TextRun({ text: model.subtitle, italics: true, size: 20 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 260 }
          }),
          ...model.clauses.flatMap((clause) => [
            new Paragraph({
              text: `${clause.number}. ${clause.title}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 120 }
            }),
            ...clauseParagraphs(clause.paragraphs)
          ]),
          new Paragraph({
            text: "SCHEDULE OF THE PROPERTY",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 260, after: 120 }
          }),
          ...(model.property.fullAddress
            ? [
                new Paragraph({
                  text: model.property.fullAddress,
                  spacing: { after: 120, line: 280 },
                  alignment: AlignmentType.JUSTIFIED
                })
              ]
            : []),
          new Paragraph({
            text: "SIGNATURES AND WITNESSES",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 260, after: 120 }
          }),
          ...model.signatures.flatMap(
            (signature) => [
              new Paragraph({
                text: `${signature.role}: ${signature.name}`,
                spacing: { after: 60 }
              }),
              new Paragraph({
                text: `Address: ${signature.address}`,
                spacing: { after: 60 }
              }),
              new Paragraph({
                text: `Mobile: ${signature.mobile}`,
                spacing: { after: 120 }
              })
            ]
          ),
          ...model.witnesses.flatMap(
            (witness, index) => [
              new Paragraph({
                text: `Witness ${index + 1}: ${witness.name}`,
                spacing: { after: 60 }
              }),
              new Paragraph({
                text: `Address: ${witness.address}`,
                spacing: { after: 120 }
              })
            ]
          )
        ]
      }
    ]
  });

  return Packer.toBlob(doc);
}
