export const REPORT_STYLES = {
    colors: {
        primary: [26, 54, 93] as [number, number, number], // #1a365d (Navy/Purple)
        secondary: [255, 154, 98] as [number, number, number], // #FF9A62 (Secondary Orange)
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
