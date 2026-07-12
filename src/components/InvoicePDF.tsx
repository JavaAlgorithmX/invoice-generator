import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

export interface InvoiceItem {
  id: string;
  productName: string;
  company: string;
  qty: number;
  sku: number;
  ratePerKg: number;
  exp: string;
  dis: number;
  gst: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGSTIN: string; 
  vendorName: string;
  vendorDesc: string;
  vendorTagline: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorGSTIN: string;
  vendorPhone: string;
  bankName: string;
  branch: string;
  accountNo: string;
  ifsc: string;
  upiId: string;
  paymentStatus: string; 
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  gstAmount: number;
  grandTotal: number;
  totalQty: number;
  amountInWords: string;
}

const styles = StyleSheet.create({
  // paddingBottom: 220 reserves the space at the bottom of the page
  page: { padding: 25, paddingBottom: 220, fontSize: 8, fontFamily: 'Helvetica' },
  watermark: { position: 'absolute', top: '30%', left: '20%', width: '60%', opacity: 0.1, zIndex: -1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  logoSpace: { width: 50, height: 50 },
  vendorInfo: { textAlign: 'center', flex: 1 },
  vendorName: { fontSize: 14, fontWeight: 'bold', color: '#b91c1c' },
  vendorDesc: { fontSize: 9, marginBottom: 1 },
  vendorTagline: { fontSize: 7, fontStyle: 'italic', marginBottom: 2, color: '#4b5563' },
  gstTitle: { textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginVertical: 4, textDecoration: 'underline' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' },
  
  table: { width: '100%', borderWidth: 1, borderColor: '#000', marginBottom: 5 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderBottomWidth: 1, fontWeight: 'bold', paddingVertical: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 4 },
  colSn: { width: '4%', textAlign: 'center' },
  colProduct: { width: '26%', paddingLeft: 2 },
  colCompany: { width: '9%', textAlign: 'center' },
  colQty: { width: '7%', textAlign: 'center' },
  colSku: { width: '8%', textAlign: 'center' },
  colRate: { width: '10%', textAlign: 'right' },
  colExp: { width: '10%', textAlign: 'center' },
  colDis: { width: '6%', textAlign: 'center' },
  colGst: { width: '6%', textAlign: 'center' },
  colAmount: { width: '14%', textAlign: 'right', paddingRight: 2 },
  
  absoluteFooter: { position: 'absolute', bottom: 25, left: 25, right: 25 },
  footerGrid: { flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#000', padding: 5, marginTop: 10 },
  bankDetails: { width: '50%' },
  totalsBox: { width: '35%' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  signatureBlock: { marginTop: 25, flexDirection: 'row', justifyContent: 'space-between' },
  signLine: { borderTopWidth: 1, width: 120, textAlign: 'center', paddingTop: 2 }
});

const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      <Image src="/logo.png" style={styles.watermark} fixed />

      <View style={styles.header}>
        <Image src="/logo.png" style={styles.logoSpace} />
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{data.vendorName}</Text>
          <Text style={styles.vendorDesc}>{data.vendorDesc}</Text>
          {data.vendorTagline ? <Text style={styles.vendorTagline}>{data.vendorTagline}</Text> : null}
          <Text>{data.vendorAddress}</Text>
          <Text>E-Mail: {data.vendorEmail}</Text>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.gstTitle}>GST INVOICE</Text>

      <View style={styles.row}>
        <Text><Text style={styles.bold}>GSTIN:</Text> {data.vendorGSTIN}</Text>
        <Text><Text style={styles.bold}>Phone:</Text> {data.vendorPhone}</Text>
      </View>

      <View style={[styles.row, { marginTop: 5, borderWidth: 1, padding: 4 }]}>
        <View style={{ width: '60%' }}>
          <Text style={styles.bold}>Billed To:</Text>
          <Text>{data.customerName}</Text>
          <Text>{data.customerAddress}</Text>
          <Text>PH.NO.: {data.customerPhone}</Text>
          {data.customerGSTIN ? <Text>GSTIN: {data.customerGSTIN}</Text> : null}
        </View>
        <View style={{ width: '40%' }}>
          <Text>Invoice No.: {data.invoiceNo}</Text>
          <Text>Date: {data.date}</Text>
          <Text>Status: <Text style={styles.bold}>{data.paymentStatus}</Text></Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colSn}>S.N</Text>
          <Text style={styles.colProduct}>PRODUCT NAME</Text>
          <Text style={styles.colCompany}>COMPANY</Text>
          <Text style={styles.colQty}>QTY</Text>
          <Text style={styles.colSku}>SKU(KG)</Text>
          <Text style={styles.colRate}>RATE/KG</Text>
          <Text style={styles.colExp}>EXP</Text>
          <Text style={styles.colDis}>DIS%</Text>
          <Text style={styles.colGst}>GST%</Text>
          <Text style={styles.colAmount}>AMOUNT</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={item.id} style={styles.tableRow} wrap={false}>
            <Text style={styles.colSn}>{index + 1}</Text>
            <Text style={styles.colProduct}>{item.productName}</Text>
            <Text style={styles.colCompany}>{item.company}</Text>
            <Text style={styles.colQty}>{item.qty || 0}</Text>
            <Text style={styles.colSku}>{item.sku || 0}</Text>
            <Text style={styles.colRate}>{(item.ratePerKg || 0).toFixed(2)}</Text>
            <Text style={styles.colExp}>{item.exp}</Text>
            <Text style={styles.colDis}>{item.dis || 0}</Text>
            <Text style={styles.colGst}>{item.gst || 0}</Text>
            <Text style={styles.colAmount}>{(item.amount || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* FOOTER RENDER LOGIC: Only show Bank/Signatures/Totals on the last page */}
      <View style={styles.absoluteFooter} fixed>
        <View render={({ pageNumber, totalPages }) => {
          if (pageNumber === totalPages) {
            return (
              <View>
                <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>TOTAL QTY: {data.totalQty}</Text>
                <Text style={{ marginBottom: 4, fontStyle: 'italic' }}>Rs. {data.amountInWords} only</Text>
                
                <View style={styles.footerGrid}>
                  <View style={styles.bankDetails}>
                    <Text style={[styles.bold, { textDecoration: 'underline', marginBottom: 2 }]}>BANK DETAILS</Text>
                    <Text>BANK: {data.bankName}</Text>
                    <Text>BRANCH: {data.branch}</Text>
                    <Text>A/C NO: {data.accountNo}</Text>
                    <Text>IFSC CODE: {data.ifsc}</Text>
                    <Text style={{ marginTop: 4 }}>PAY USING UPI QR:</Text>
                    <Text>{data.upiId}</Text>
                  </View>

                  <View style={styles.totalsBox}>
                    <View style={styles.totalRow}><Text>SUB TOTAL</Text><Text>{data.subTotal.toFixed(2)}</Text></View>
                    <View style={styles.totalRow}><Text>DISCOUNT</Text><Text>{data.discount.toFixed(2)}</Text></View>
                    <View style={styles.totalRow}><Text>GST AMOUNT</Text><Text>{data.gstAmount.toFixed(2)}</Text></View>
                    <View style={[styles.totalRow, { borderTopWidth: 1, paddingTop: 2, fontWeight: 'bold' }]}>
                      <Text>GRAND TOTAL</Text><Text>{data.grandTotal.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.signatureBlock}>
                  <View><Text style={styles.signLine}>Customer Signature</Text></View>
                  <View>
                    <Text style={styles.signLine}>For {data.vendorName}</Text>
                    <Text style={{ textAlign: 'center' }}>Authorised Signatory</Text>
                  </View>
                </View>
              </View>
            );
          } else {
            return (
              <View style={{ borderTopWidth: 1, paddingTop: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontStyle: 'italic' }}>Continued on Page {pageNumber + 1}...</Text>
              </View>
            );
          }
        }} />
        
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} style={{ textAlign: 'center', marginTop: 10, fontSize: 8, color: '#666' }} fixed />
      </View>
      
    </Page>
  </Document>
);

export default InvoicePDF;