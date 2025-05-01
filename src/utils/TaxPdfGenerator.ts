import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TaxSummary, TaxableEvent } from './TaxCalculator';

interface GenerateTaxReportOptions {
  includeWatermark?: boolean;
  includeLogo?: boolean;
  isPremiumUser: boolean;
  year?: string;
  currency?: 'EUR' | 'USD';
  walletAddress?: string;
}

/**
 * Génère un rapport fiscal en PDF à partir des données de calcul fiscal
 */
export function generateTaxReport(
  taxSummary: TaxSummary, 
  options: GenerateTaxReportOptions
): void {
  const { 
    includeWatermark = true, 
    includeLogo = true, 
    isPremiumUser = false,
    year = 'Toutes les années',
    currency = 'EUR',
    walletAddress = ''
  } = options;
  
  const doc = new jsPDF();
  
  // Watermark pour version gratuite
  if (includeWatermark && !isPremiumUser) {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.text('BITAX', 35, 150, { angle: 45 });
  }
  
  // En-tête
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('Rapport Fiscal Crypto', 20, 30);
  
  // Sous-titre
  doc.setFontSize(12);
  doc.text(`Année fiscale: ${year}`, 20, 40);
  
  if (walletAddress) {
    doc.text(`Wallet: ${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)}`, 20, 48);
  }
  
  doc.text(`Date du rapport: ${new Date().toLocaleDateString()}`, 20, 56);
  
  // Informations sur les résultats fiscaux
  doc.setFontSize(14);
  doc.text('Récapitulatif Fiscal', 20, 70);
  
  doc.setFontSize(10);
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  const summaryData = [
    ['Plus-values totales', formatter.format(taxSummary.totalGains)],
    ['Moins-values totales', formatter.format(taxSummary.totalLosses)],
    ['Résultat net', formatter.format(taxSummary.netGainOrLoss)],
    ['Plus-values long terme (>1 an)', formatter.format(taxSummary.longTermGains)],
    ['Plus-values court terme (<1 an)', formatter.format(taxSummary.shortTermGains)],
    ['Nombre d\'événements taxables', taxSummary.taxableEvents.length.toString()]
  ];
  
  // Utilisez la méthode autoTable correctement
  (doc as any).autoTable({
    startY: 75,
    head: [['Description', 'Montant']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Détail des transactions taxables
  doc.setFontSize(14);
  
  // Accéder à la position finale du tableau précédent
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.text('Détail des Plus/Moins-Values', 20, finalY + 15);
  
  // Nombre d'événements taxables à inclure
  const maxEvents = isPremiumUser ? taxSummary.taxableEvents.length : Math.min(10, taxSummary.taxableEvents.length);
  
  // Préparer les données pour le tableau
  const tableRows = taxSummary.taxableEvents.slice(0, maxEvents).map(event => [
    new Date(event.date).toLocaleDateString(),
    event.token,
    formatter.format(event.acquisitionCost),
    formatter.format(event.proceeds),
    formatter.format(event.gainOrLoss),
    event.isLongTerm ? 'Long terme' : 'Court terme'
  ]);
  
  // Utilisez la méthode autoTable correctement
  (doc as any).autoTable({
    startY: finalY + 20,
    head: [['Date', 'Token', 'Coût d\'acquisition', 'Produit de cession', 'Gain/Perte', 'Type']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Graphique simple pour la répartition des plus/moins-values
  if (isPremiumUser) {
    // Accéder à la position finale du dernier tableau
    const chartsY = (doc as any).lastAutoTable.finalY + 20 || 220;
    
    doc.setFontSize(14);
    doc.text('Répartition des Plus/Moins-Values', 20, chartsY);
    
    // Dessiner un graphique en camembert simple
    const centerX = 105;
    const centerY = chartsY + 50;
    const radius = 30;
    
    // Calculer les angles du camembert
    const total = taxSummary.totalGains + taxSummary.totalLosses;
    const gainsAngle = (taxSummary.totalGains / total) * 360;
    
    // Dessiner la partie des gains (vert)
    doc.setFillColor(16, 185, 129); // Vert
    doc.circle(centerX, centerY, radius, 'F');
    
    // Dessiner la partie des pertes (rouge)
    if (taxSummary.totalLosses > 0) {
      doc.setFillColor(239, 68, 68); // Rouge
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.1);
      
      // Convertir les angles en radians
      const startAngle = 0;
      const endAngle = (gainsAngle * Math.PI) / 180;
      
      // Dessiner le secteur des pertes
      doc.lines(
        [
          [radius * Math.cos(endAngle), radius * Math.sin(endAngle)],
          [0, 0],
          [radius, 0]
        ],
        centerX, centerY, [1, 1], 'F'
      );
    }
    
    // Légende
    doc.setFontSize(10);
    doc.setDrawColor(0, 0, 0);
    
    // Légende des gains
    doc.setFillColor(16, 185, 129);
    doc.rect(centerX - 60, centerY + 30, 10, 10, 'F');
    doc.text('Plus-values: ' + formatter.format(taxSummary.totalGains), centerX - 45, centerY + 37);
    
    // Légende des pertes
    doc.setFillColor(239, 68, 68);
    doc.rect(centerX + 30, centerY + 30, 10, 10, 'F');
    doc.text('Moins-values: ' + formatter.format(taxSummary.totalLosses), centerX + 45, centerY + 37);
  }
  
  // Mention pour la version gratuite
  if (!isPremiumUser) {
    // Accéder à la position finale du dernier tableau
    const lastTableY = (doc as any).lastAutoTable.finalY || 250;
    
    doc.setTextColor(150, 0, 0);
    doc.setFontSize(12);
    doc.text(
      '⚠️ Ceci est un rapport d\'aperçu incomplet. Débloquez la version complète sur Bitax.',
      20,
      lastTableY + 15
    );
  }
  
  // Informations légales
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text(
    'Ce rapport est fourni à titre informatif uniquement et ne constitue pas un conseil fiscal. Veuillez consulter un professionnel pour toute question fiscale.',
    20,
    280
  );
  
  // Pied de page
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} sur ${pageCount}`, 190, 285, { align: 'right' });
    doc.text('Bitax - Rapport Fiscal Crypto', 20, 285);
  }
  
  // Sauvegarder le PDF
  const filename = isPremiumUser 
    ? `bitax_rapport_fiscal_${year}.pdf` 
    : 'bitax_rapport_apercu.pdf';
  
  doc.save(filename);
}

/**
 * Formate une liste d'événements taxables pour l'export CSV
 * @param taxableEvents Liste des événements taxables
 * @param currency Devise (EUR, USD)
 * @returns Chaîne au format CSV
 */
export function formatTaxEventsForCSV(taxableEvents: TaxableEvent[], currency: string = 'EUR'): string {
  const headers = [
    'Date',
    'Token',
    'Coût d\'acquisition',
    'Produit de cession',
    'Gain/Perte',
    'Type',
    'Hash de transaction'
  ].join(',');
  
  const rows = taxableEvents.map(event => {
    return [
      new Date(event.date).toLocaleDateString(),
      event.token,
      event.acquisitionCost.toFixed(2),
      event.proceeds.toFixed(2),
      event.gainOrLoss.toFixed(2),
      event.isLongTerm ? 'Long terme' : 'Court terme',
      event.transaction.hash
    ].join(',');
  });
  
  return [headers, ...rows].join('\n');
}

/**
 * Génère et télécharge un fichier CSV des événements taxables
 * @param taxSummary Résumé fiscal
 * @param currency Devise (EUR, USD)
 * @param filename Nom du fichier CSV
 */
export function downloadTaxCSV(
  taxSummary: TaxSummary, 
  currency: string = 'EUR',
  filename: string = 'bitax_rapport_fiscal.csv'
): void {
  const csvContent = formatTaxEventsForCSV(taxSummary.taxableEvents, currency);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Formatage des données pour export Excel
 * @param taxSummary Résumé fiscal
 * @param currency Devise (EUR, USD)
 * @returns Données formatées pour Excel
 */
export function formatTaxDataForExcel(taxSummary: TaxSummary, currency: string = 'EUR'): any[] {
  // Formatter pour les montants
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Transformer les événements en format Excel
  return taxSummary.taxableEvents.map(event => {
    return {
      'Date': new Date(event.date).toLocaleDateString(),
      'Token': event.token,
      "Coût d'acquisition": event.acquisitionCost,
      'Produit de cession': event.proceeds,
      'Gain/Perte': event.gainOrLoss,
      'Type': event.isLongTerm ? 'Long terme' : 'Court terme',
      'Transaction': event.transaction.hash
    };
  });
}

/**
 * Génère et télécharge un fichier Excel complet avec plusieurs onglets
 * @param taxSummary Résumé fiscal
 * @param transactions Transactions brutes
 * @param walletAddress Adresse du wallet
 * @param currency Devise (EUR, USD)
 * @param isPremiumUser Si l'utilisateur est premium
 */
export async function generateExcelReport(
  taxSummary: TaxSummary,
  transactions: any[],
  walletAddress: string,
  currency: string = 'EUR',
  isPremiumUser: boolean = false
): Promise<void> {
  try {
    // Import dynamique de SheetJS
    const XLSX = await import('xlsx');
    
    // Créer un nouveau classeur
    const workbook = XLSX.utils.book_new();
    
    // Ajouter une feuille avec le résumé
    const summaryData = [
      ['Rapport Fiscal Crypto - Bitax', ''],
      ['', ''],
      ['Wallet', walletAddress],
      ['Date du rapport', new Date().toLocaleDateString()],
      ['', ''],
      ['Résumé Fiscal', ''],
      ['Plus-values totales', taxSummary.totalGains],
      ['Moins-values totales', taxSummary.totalLosses],
      ['Résultat net', taxSummary.netGainOrLoss],
      ['Plus-values long terme (>1 an)', taxSummary.longTermGains],
      ['Plus-values court terme (<1 an)', taxSummary.shortTermGains],
      ['Nombre d\'événements taxables', taxSummary.taxableEvents.length]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');
    
    // Ajouter une feuille avec les événements taxables
    const taxEvents = formatTaxDataForExcel(taxSummary, currency);
    const taxEventsSheet = XLSX.utils.json_to_sheet(taxEvents);
    XLSX.utils.book_append_sheet(workbook, taxEventsSheet, 'Événements Taxables');
    
    // Si premium, ajouter des onglets supplémentaires
    if (isPremiumUser && transactions.length > 0) {
      // Onglet des transactions brutes
      const transactionsData = transactions.map(tx => ({
        'Date': tx.block_timestamp ? new Date(tx.block_timestamp).toLocaleDateString() : '',
        'Hash': tx.hash,
        'Type': tx.type || 'Inconnu',
        'Token': tx.tokenSymbol || 'ETH',
        'Montant': tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0),
        'De': tx.from_address,
        'À': tx.to_address
      }));
      
      const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
      XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
      
      // Onglet d'analyse par mois
      const monthlyData: Record<string, { gains: number, losses: number, count: number }> = {};
      
      taxSummary.taxableEvents.forEach(event => {
        const date = new Date(event.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { gains: 0, losses: 0, count: 0 };
        }
        
        if (event.gainOrLoss > 0) {
          monthlyData[monthYear].gains += event.gainOrLoss;
        } else {
          monthlyData[monthYear].losses += Math.abs(event.gainOrLoss);
        }
        
        monthlyData[monthYear].count += 1;
      });
      
      const monthlyAnalysisData = Object.entries(monthlyData).map(([month, data]) => ({
        'Mois': month,
        'Plus-values': data.gains,
        'Moins-values': data.losses, 
        'Résultat': data.gains - data.losses,
        'Nb Événements': data.count
      }));
      
      const monthlySheet = XLSX.utils.json_to_sheet(monthlyAnalysisData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Analyse Mensuelle');
      
      // Onglet d'analyse par token
      const tokenAnalysisData = Object.entries(taxSummary.taxableEventsByToken).map(([token, events]) => {
        const totalGains = events.reduce((sum, event) => sum + (event.gainOrLoss > 0 ? event.gainOrLoss : 0), 0);
        const totalLosses = events.reduce((sum, event) => sum + (event.gainOrLoss < 0 ? Math.abs(event.gainOrLoss) : 0), 0);
        
        return {
          'Token': token,
          'Plus-values': totalGains,
          'Moins-values': totalLosses,
          'Résultat Net': totalGains - totalLosses,
          'Nb Transactions': events.length
        };
      });
      
      const tokenSheet = XLSX.utils.json_to_sheet(tokenAnalysisData);
      XLSX.utils.book_append_sheet(workbook, tokenSheet, 'Analyse par Token');
    }
    
    // Générer le fichier Excel et le télécharger
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const filename = isPremiumUser 
      ? `bitax_rapport_fiscal_excel_complet.xlsx` 
      : 'bitax_rapport_fiscal_simple.xlsx';
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport Excel:', error);
    alert('Une erreur est survenue lors de la génération du rapport Excel. Veuillez réessayer.');
  }
}

/**
 * Génère et télécharge un rapport complet (PDF + Excel + CSV)
 */
export async function generateCompleteReport(
  taxSummary: TaxSummary,
  transactions: any[],
  walletAddress: string,
  year: string = 'Toutes les années',
  currency: string = 'EUR',
  isPremiumUser: boolean = false
): Promise<void> {
  // Générer le rapport PDF
  generateTaxReport(taxSummary, {
    isPremiumUser,
    year,
    currency: currency as 'EUR' | 'USD',
    walletAddress
  });
  
  // Générer le rapport Excel
  await generateExcelReport(
    taxSummary,
    transactions,
    walletAddress,
    currency,
    isPremiumUser
  );
  
  // Générer le CSV (pour les utilisateurs qui préfèrent ce format)
  if (isPremiumUser) {
    downloadTaxCSV(
      taxSummary,
      currency,
      `bitax_rapport_fiscal_${year.replace(' ', '_')}.csv`
    );
  }
}