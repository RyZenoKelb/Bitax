import jsPDF from 'jspdf';

export function generatePDF(transactions: any[]) {
  const doc = new jsPDF();

  // Watermark
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.text('BITAX', 35, 150, { angle: 45 });

  // Titre
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('Rapport Fiscal Crypto - Version Gratuite', 20, 30);

  // Liste des transactions
  doc.setFontSize(10);
  let y = 50;

  transactions.slice(0, 10).forEach((tx, index) => {
    const hash = tx.hash ? `${tx.hash.substring(0, 10)}...` : 'Non disponible';
    const date = tx.timeStamp ? new Date(Number(tx.timeStamp) * 1000).toLocaleDateString() : 'Non disponible';
    const value = tx.value ? (Number(tx.value) / 1e18).toFixed(4) + ' ETH' : 'Non disponible';

    doc.text(`${index + 1}. ${hash} | ${date} | ${value}`, 20, y);
    y += 10;
  });

  // Mention gratuite
  doc.setTextColor(150, 0, 0);
  doc.text('⚠️ Ceci est un rapport d\'aperçu incomplet. Débloquez la version complète sur Bitax.', 20, y + 20);

  doc.save('bitax_rapport_apercu.pdf');
}
