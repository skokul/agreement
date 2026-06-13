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
          ])
        ]
      }
    ]
  });

  return Packer.toBlob(doc);
}
