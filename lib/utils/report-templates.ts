export const REPORT_STYLES = {
    colors: {
        primary: [15, 82, 186] as [number, number, number], // #0F52BA (Deep Sapphire)
        secondary: [16, 185, 129] as [number, number, number], // #10B981 (Emerald Reef)
        text: [51, 65, 85] as [number, number, number], // Slate 700
        muted: [148, 163, 184] as [number, number, number], // Slate 400
        white: [255, 255, 255] as [number, number, number],
        border: [226, 232, 240] as [number, number, number], // Slate 200
    },
    fonts: {
        bold: "helvetica-bold",
        normal: "helvetica",
    },
    margins: {
        top: 20,
        bottom: 20,
        left: 15,
        right: 15,
    },
};

export const TABLE_STYLES = {
    headStyles: {
        fillColor: REPORT_STYLES.colors.primary,
        textColor: REPORT_STYLES.colors.white,
        fontStyle: "bold" as "bold",
        fontSize: 10,
        halign: "center" as "center",
    },
    bodyStyles: {
        textColor: REPORT_STYLES.colors.text,
        fontSize: 9,
        valign: "middle" as "middle",
    },
    alternateRowStyles: {
        fillColor: [248, 250, 252] as [number, number, number], // Slate 50
    },
    margin: { left: REPORT_STYLES.margins.left, right: REPORT_STYLES.margins.right },
};
