'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import InvoicePDF, { InvoiceData, InvoiceItem } from '../components/InvoicePDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? convert(n % 10000000) : '');
  };
  return convert(Math.floor(num)).trim();
};

export default function InvoiceGenerator() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<InvoiceData>({
    invoiceNo: 'OFC000087',
    date: '24-06-2026',
    customerName: 'Name',
    customerAddress: 'Address',
    customerPhone: 'Mobile',
    customerGSTIN: '', 
    vendorName: 'CLOVERFIELD CREAMERY & ORGANICS',
    vendorDesc: 'FROM NATURE TO NUTRITION',
    vendorTagline: '',
    vendorAddress: 'Raghopur, Near Karikh Asthan Salempur, Muzaffarpur Bihar PIN 842004',
    vendorEmail: 'Ccorganics@gmail.com',
    vendorGSTIN: 'NA',
    vendorPhone: '+91',
    bankName: 'HDFC BANK',
    branch: 'ZERO MILE',
    accountNo: '50100727604862',
    ifsc: 'HDFC0009031',
    upiId: '7004062912@axl',
    // paymentStatus: 'Due',
    items: [
      { id: '1', productName: 'KEMTRACE MAXIM DRY', company: 'KEMIN', qty: 5, sku: 25, ratePerKg: 100, exp: '-', dis: 0, gst: 0, amount: 12500 },
    ],
    subTotal: 0, discount: 0, gstAmount: 0, grandTotal: 0, totalQty: 0, amountInWords: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('cloverfieldInvoice');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.items) {
          parsedData.items = parsedData.items.map((item: any) => ({
            ...item,
            ratePerKg: item.ratePerKg || item.rate || 0,
            sku: item.sku || 0,
            company: item.company || item.breed || '',
            amount: item.amount || 0
          }));
        }
        setData(parsedData);
      } catch (err) {
        console.error("Could not load invoice data");
      }
    }
    setIsLoaded(true);
  }, []);

  // MASTER MATH CALCULATOR (Includes Dis% and GST%)
  useEffect(() => {
    if (!isLoaded) return;
    
    let newSubTotal = 0;
    let newDiscountTotal = 0;
    let newGstTotal = 0;
    let newGrandTotal = 0;
    let newTotalQty = 0;

    data.items.forEach(item => {
      const qty = Number(item.qty) || 0;
      const sku = Number(item.sku) || 0;
      const rate = Number(item.ratePerKg) || 0;
      const disPercent = Number(item.dis) || 0;
      const gstPercent = Number(item.gst) || 0;

      const baseAmount = qty * sku * rate;
      const disAmount = baseAmount * (disPercent / 100);
      const afterDiscount = baseAmount - disAmount;
      const gstAmount = afterDiscount * (gstPercent / 100);
      const finalAmount = afterDiscount + gstAmount;

      newSubTotal += baseAmount;
      newDiscountTotal += disAmount;
      newGstTotal += gstAmount;
      newGrandTotal += finalAmount;
      newTotalQty += qty;
    });

    localStorage.setItem('cloverfieldInvoice', JSON.stringify(data));
    
    if (data.subTotal !== newSubTotal || data.grandTotal !== newGrandTotal || data.discount !== newDiscountTotal || data.gstAmount !== newGstTotal) {
      setData(prev => ({
        ...prev,
        subTotal: newSubTotal,
        discount: newDiscountTotal,
        gstAmount: newGstTotal,
        grandTotal: newGrandTotal,
        totalQty: newTotalQty,
        amountInWords: numberToWords(newGrandTotal)
      }));
    }
  }, [data.items, isLoaded]);

  // NEW INVOICE BUTTON LOGIC
  const handleGenerateNewInvoice = () => {
    const currentNo = data.invoiceNo;
    const prefixMatch = currentNo.match(/^[a-zA-Z]+/);
    const numMatch = currentNo.match(/\d+$/);
    
    let nextNo = currentNo;
    if (prefixMatch && numMatch) {
      const prefix = prefixMatch[0];
      const numStr = numMatch[0];
      const nextNum = parseInt(numStr, 10) + 1;
      const nextNumStr = nextNum.toString().padStart(numStr.length, '0');
      nextNo = prefix + nextNumStr;
    } else {
      nextNo = currentNo + '-NEW';
    }

    if (confirm("Are you sure you want to clear all items and start a new invoice?")) {
      setData({
        ...data,
        invoiceNo: nextNo,
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerGSTIN: '',
        items: [{ id: Date.now().toString(), productName: '', company: '', qty: 1, sku: 0, ratePerKg: 0, exp: '', dis: 0, gst: 0, amount: 0 }]
      });
    }
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...data.items];
    const item = { ...updatedItems[index], [field]: value };
    
    // Live calculation for the specific row being edited
    const qty = field === 'qty' ? Number(value) : Number(item.qty);
    const sku = field === 'sku' ? Number(value) : Number(item.sku);
    const ratePerKg = field === 'ratePerKg' ? Number(value) : Number(item.ratePerKg);
    const dis = field === 'dis' ? Number(value) : Number(item.dis);
    const gst = field === 'gst' ? Number(value) : Number(item.gst);
    
    const baseAmount = qty * sku * ratePerKg;
    const afterDiscount = baseAmount - (baseAmount * (dis / 100));
    item.amount = afterDiscount + (afterDiscount * (gst / 100));

    updatedItems[index] = item;
    setData({ ...data, items: updatedItems });
  };

  const addRow = () => setData({ ...data, items: [...data.items, { id: Date.now().toString(), productName: '', company: '', qty: 1, sku: 0, ratePerKg: 0, exp: '', dis: 0, gst: 0, amount: 0 }] });
  const removeRow = (index: number) => setData({ ...data, items: data.items.filter((_, i) => i !== index) });

  const highVisInput = "w-full p-3 border-2 border-slate-400 bg-slate-50 text-slate-900 rounded shadow-sm focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-colors";
  const highVisTableInput = "w-full p-2 border-2 border-slate-400 bg-slate-50 text-slate-900 rounded focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-colors";

  if (!isLoaded) return null;

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-8 bg-slate-200 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-slate-300">
        
        {/* NEW INVOICE BUTTON UI */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-slate-800 pb-4 gap-4">
           <h1 className="text-3xl font-extrabold text-slate-900">Invoice Generator</h1>
           <button onClick={handleGenerateNewInvoice} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg border-2 border-red-800 transition transform hover:scale-105">
             + Generate Next Invoice ({data.invoiceNo})
           </button>
        </div>
        
        <div className="mb-8 p-6 bg-blue-100 border-4 border-blue-300 rounded-xl">
          <h2 className="text-lg font-bold text-blue-900 uppercase mb-4 tracking-wider">Vendor Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label><input type="text" name="vendorName" value={data.vendorName} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Description</label><input type="text" name="vendorDesc" value={data.vendorDesc} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Tagline</label><input type="text" name="vendorTagline" value={data.vendorTagline} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Address</label><input type="text" name="vendorAddress" value={data.vendorAddress} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Email</label><input type="text" name="vendorEmail" value={data.vendorEmail} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Phone Numbers</label><input type="text" name="vendorPhone" value={data.vendorPhone} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">GSTIN</label><input type="text" name="vendorGSTIN" value={data.vendorGSTIN} onChange={handleGeneralChange} className={highVisInput} /></div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-slate-100 border-4 border-slate-300 rounded-xl">
          <h2 className="text-lg font-bold text-slate-800 uppercase mb-4 tracking-wider">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Customer Name</label><input type="text" name="customerName" value={data.customerName} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Address</label><input type="text" name="customerAddress" value={data.customerAddress} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">Mobile No</label><input type="text" name="customerPhone" value={data.customerPhone} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">GSTIN</label><input type="text" name="customerGSTIN" value={data.customerGSTIN} onChange={handleGeneralChange} className={highVisInput} placeholder="Optional" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-6 bg-slate-100 border-4 border-slate-300 rounded-xl">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Invoice No</label><input type="text" name="invoiceNo" value={data.invoiceNo} onChange={handleGeneralChange} className={highVisInput} /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Date</label><input type="text" name="date" value={data.date} onChange={handleGeneralChange} className={highVisInput} /></div>
          {/* <div><label className="block text-sm font-bold text-slate-700 mb-1">Payment Status</label>
            <select name="paymentStatus" value={data.paymentStatus} onChange={handleGeneralChange} className={`${highVisInput} cursor-pointer`}>
              <option value="Due">Due</option><option value="Cash">Cash</option><option value="Online">Online</option>
            </select>
          </div> */}
        </div>

        <div className="overflow-x-auto mb-4 border-4 border-slate-300 rounded-lg">
          <table className="w-full text-left border-collapse text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-slate-800 text-white uppercase tracking-wider text-xs">
                <th className="p-2 border-r border-slate-600">Product</th>
                <th className="p-2 border-r border-slate-600 w-24">Company</th>
                <th className="p-2 border-r border-slate-600 w-16 text-center">Qty</th>
                <th className="p-2 border-r border-slate-600 w-24 text-center">SKU(KG)</th>
                <th className="p-2 border-r border-slate-600 w-24 text-center">Rate/KG</th>
                <th className="p-2 border-r border-slate-600 w-20 text-center">Exp</th>
                <th className="p-2 border-r border-slate-600 w-16 text-center">Dis%</th>
                <th className="p-2 border-r border-slate-600 w-16 text-center">GST%</th>
                <th className="p-2 border-r border-slate-600 w-32 text-right">Amount</th>
                <th className="p-2 w-12 text-center">Del</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className="bg-slate-50 border-b-2 border-slate-300 hover:bg-slate-100 transition-colors">
                  <td className="p-1 border-r border-slate-300"><input type="text" value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} className={highVisTableInput} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="text" value={item.company} onChange={(e) => handleItemChange(index, 'company', e.target.value)} className={highVisTableInput} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))} className={`${highVisTableInput} text-center font-bold`} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="number" value={item.sku} onChange={(e) => handleItemChange(index, 'sku', Number(e.target.value))} className={`${highVisTableInput} text-center text-blue-800`} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="number" value={item.ratePerKg} onChange={(e) => handleItemChange(index, 'ratePerKg', Number(e.target.value))} className={`${highVisTableInput} text-right text-green-700`} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="text" value={item.exp} onChange={(e) => handleItemChange(index, 'exp', e.target.value)} className={`${highVisTableInput} text-center`} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="number" value={item.dis} onChange={(e) => handleItemChange(index, 'dis', Number(e.target.value))} className={`${highVisTableInput} text-center`} /></td>
                  <td className="p-1 border-r border-slate-300"><input type="number" value={item.gst} onChange={(e) => handleItemChange(index, 'gst', Number(e.target.value))} className={`${highVisTableInput} text-center`} /></td>
                  <td className="p-2 border-r border-slate-300 text-right font-black text-base text-slate-900 bg-slate-200">{item.amount.toFixed(2)}</td>
                  <td className="p-1 text-center">
                    <button onClick={() => removeRow(index)} className="bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-600 hover:text-white font-extrabold px-2 py-1 rounded transition-colors shadow">X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addRow} className="mb-10 text-md bg-slate-800 text-white hover:bg-slate-700 px-6 py-3 rounded-lg font-bold transition shadow-lg border-2 border-slate-900">
          + Add New Row
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1 p-6 bg-green-50 border-4 border-green-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-1 md:col-span-2 font-black text-green-900 text-lg uppercase border-b-2 border-green-200 pb-2">Bank Details</h3>
            <div><label className="block text-xs font-bold text-green-800 mb-1 uppercase">Bank Name</label><input type="text" name="bankName" value={data.bankName} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-xs font-bold text-green-800 mb-1 uppercase">Branch</label><input type="text" name="branch" value={data.branch} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-xs font-bold text-green-800 mb-1 uppercase">Account No</label><input type="text" name="accountNo" value={data.accountNo} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div><label className="block text-xs font-bold text-green-800 mb-1 uppercase">IFSC Code</label><input type="text" name="ifsc" value={data.ifsc} onChange={handleGeneralChange} className={highVisInput} /></div>
            <div className="md:col-span-2"><label className="block text-xs font-bold text-green-800 mb-1 uppercase">UPI ID</label><input type="text" name="upiId" value={data.upiId} onChange={handleGeneralChange} className={highVisInput} /></div>
          </div>

          <div className="w-full md:w-1/3 p-6 bg-slate-800 text-white rounded-xl shadow-inner border-4 border-slate-900 flex flex-col justify-end">
             <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-slate-300 font-bold">Total Qty:</span> <span className="font-bold text-xl">{data.totalQty}</span></div>
             <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-slate-300 font-bold">Base Sub-Total:</span> <span className="font-bold text-lg text-slate-300">₹{data.subTotal.toFixed(2)}</span></div>
             <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-red-400 font-bold">Total Discount:</span> <span className="font-bold text-lg text-red-400">-₹{data.discount.toFixed(2)}</span></div>
             <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-blue-400 font-bold">Total GST:</span> <span className="font-bold text-lg text-blue-400">+₹{data.gstAmount.toFixed(2)}</span></div>
             
             <div className="flex justify-between text-2xl font-black pt-4 mt-2">
               <span className="text-white">Grand Total:</span> <span className="text-green-400">₹{data.grandTotal.toFixed(2)}</span>
             </div>
             <p className="text-sm text-slate-300 mt-4 italic capitalize text-right border-t border-slate-600 pt-3">{data.amountInWords} Only</p>
          </div>
        </div>

        <div className="flex justify-center border-t-4 border-slate-200 pt-10">
          <PDFDownloadLink document={<InvoicePDF data={data} />} fileName={`Invoice_${data.invoiceNo}.pdf`} className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-800 hover:shadow-2xl transition-all border-4 border-blue-900 transform hover:-translate-y-1">
            {({ loading }) => (loading ? 'Generating Document...' : 'DOWNLOAD OFFICIAL PDF INVOICE')}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}