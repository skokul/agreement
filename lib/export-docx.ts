import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { AgreementDocumentModel } from "@/lib/agreement-template";

function clauseParagraphs(text: string[]) {
  return text.flatMap((paragraph) =>
    paragraph.split("\n").map(
      (line) =>
        new Paragraph({
          text: line,
          spacing: { after: 120, line: 280 },
          alignment: AlignmentType.JUSTIFIED
        })
    )
  );
}

function textParagraphs(text: string[]) {
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
          new Paragraph({
            text: "PREAMBLE",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 160, after: 120 }
          }),
          ...textParagraphs(model.preamble),
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
            spacing: { before: 240, after: 120 }
          }),
          ...textParagraphs(model.property.scheduleLines),
          new Paragraph({
            text: "CLOSING AND SIGNATURES",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),
          ...textParagraphs(model.closing),
          ...model.signatures.flatMap((signature) => [
            new Paragraph({
              text: `${signature.role}: ${signature.name}`,
              spacing: { before: 120, after: 60 }
            }),
            new Paragraph({
              text: `Address: ${signature.address}`,
              spacing: { after: 60 }
            }),
            new Paragraph({
              text: `Mobile: ${signature.mobile}`,
              spacing: { after: 60 }
            }),
            new Paragraph({
              text: "Signature: ______________________",
              spacing: { after: 120 }
            })
          ]),
          ...model.witnesses.flatMap((witness, index) => [
            new Paragraph({
              text: `Witness ${index + 1}: ${witness.name}`,
              spacing: { before: 120, after: 60 }
            }),
            new Paragraph({
              text: `Address: ${witness.address}`,
              spacing: { after: 60 }
            }),
            new Paragraph({
              text: "Signature: ______________________",
              spacing: { after: 120 }
            })
          ])
        ]
      }
    ]
  });

  return Packer.toBlob(doc);
}
