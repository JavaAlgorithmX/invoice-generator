
// 'use client';

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import InvoicePDF, { InvoiceData, InvoiceItem } from '../components/InvoicePDF';

// const PDFDownloadLink = dynamic(
//   () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
//   { ssr: false }
// );

// const numberToWords = (num: number): string => {
//   if (num === 0) return 'Zero';
//   const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
//   const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
//   const convert = (n: number): string => {
//     if (n < 20) return a[n];
//     if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
//     if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? convert(n % 100) : '');
//     if (n < 10000) return convert(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
//     if (n < 100000) return convert(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
//     if (n < 10000000) return convert(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? convert(n % 100000) : '');
//     return convert(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? convert(n % 10000000) : '');
//   };
//   return convert(Math.floor(num)).trim();
// };

// export default function InvoiceGenerator() {
//   const [data, setData] = useState<InvoiceData>({
//     invoiceNo: 'OFC000087',
//     date: '24-06-2026',
//     dueDate: '24-06-2026',
//     customerName: 'M/s SOURABH JI KEMIN',
//     customerAddress: '10-BIHAR',
//     customerPhone: '8709623528',
    
//     vendorName: 'BIHAR DAIRY SOLUTIONS',
//     vendorDesc: 'All Veterinary Medicine and Semen Supplier',
//     vendorAddress: 'TIWARI DAIRY DHANAUTI, MASHRAKH, CHAPRA (SARAN) PIN CODE - 841417',
//     vendorEmail: 'bihardairysolutions@gmail.com',
//     vendorGSTIN: '10AHWPT4906D2Z9',
//     vendorPhone: '+91-9065577100, 9527899402',
    
//     bankName: 'HDFC BANK',
//     branch: 'MASHRAK',
//     accountNo: '50200087214728',
//     ifsc: 'HDFC0009869',
//     upiId: 'vyapar.169126383165@hdfcbank',
    
//     paymentStatus: 'Due',
//     amountPaid: 0,
    
//     items: [
//       { id: '1', productName: 'KEMTRACE MAXIM DRY', breed: 'KEMIN', qty: 1, mfr: 'KEMIN', mrp: 5860, rate: 5860, exp: '-', dis: 0, gst: 0, amount: 5860 },
//     ],
//     subTotal: 0, discount: 0, gstAmount: 0, grandTotal: 0, totalQty: 0, amountInWords: ''
//   });

//   useEffect(() => {
//     let newSubTotal = 0;
//     let newTotalQty = 0;
//     data.items.forEach(item => {
//       newSubTotal += item.amount;
//       newTotalQty += Number(item.qty);
//     });
//     const newGrandTotal = newSubTotal - Number(data.discount) + Number(data.gstAmount);
    
//     setData(prev => ({
//       ...prev,
//       subTotal: newSubTotal,
//       grandTotal: newGrandTotal,
//       totalQty: newTotalQty,
//       amountInWords: numberToWords(newGrandTotal)
//     }));
//   }, [data.items, data.discount, data.gstAmount]);

//   const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
//     const updatedItems = [...data.items];
//     const item = { ...updatedItems[index], [field]: value };
    
//     if (field === 'qty' || field === 'rate') {
//       const qty = field === 'qty' ? Number(value) : item.qty;
//       const rate = field === 'rate' ? Number(value) : item.rate;
//       item.amount = qty * rate;
//     }
//     updatedItems[index] = item;
//     setData({ ...data, items: updatedItems });
//   };

//   const addRow = () => setData({ ...data, items: [...data.items, { id: Date.now().toString(), productName: '', breed: '', qty: 1, mfr: '', mrp: 0, rate: 0, exp: '', dis: 0, gst: 0, amount: 0 }] });
//   const removeRow = (index: number) => setData({ ...data, items: data.items.filter((_, i) => i !== index) });

//   // Reusable input class for high visibility
//   const highVisInput = "w-full p-3 border-2 border-slate-400 bg-slate-50 text-slate-900 rounded shadow-sm focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-colors";
//   const highVisTableInput = "w-full p-2 border-2 border-slate-400 bg-slate-50 text-slate-900 rounded focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-colors";

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-200 min-h-screen">
//       <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-slate-300">
//         <h1 className="text-3xl font-extrabold mb-8 text-slate-900 border-b-4 border-slate-800 pb-2">Invoice Generator</h1>
        
//         {/* Vendor Configuration */}
//         <div className="mb-8 p-6 bg-blue-100 border-4 border-blue-300 rounded-xl">
//           <h2 className="text-lg font-bold text-blue-900 uppercase mb-4 tracking-wider">Vendor Configuration</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
//               <input type="text" name="vendorName" value={data.vendorName} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//             <div>
//               <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
//               <input type="text" name="vendorAddress" value={data.vendorAddress} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//             <div>
//               <label className="block text-sm font-bold text-slate-700 mb-1">GSTIN</label>
//               <input type="text" name="vendorGSTIN" value={data.vendorGSTIN} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//           </div>
//         </div>

//         {/* Customer & Invoice Info */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 p-6 bg-slate-100 border-4 border-slate-300 rounded-xl">
//           <div>
//             <label className="block text-sm font-bold text-slate-700 mb-1">Customer Name</label>
//             <input type="text" name="customerName" value={data.customerName} onChange={handleGeneralChange} className={highVisInput} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-slate-700 mb-1">Invoice No</label>
//             <input type="text" name="invoiceNo" value={data.invoiceNo} onChange={handleGeneralChange} className={highVisInput} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
//             <input type="text" name="date" value={data.date} onChange={handleGeneralChange} className={highVisInput} />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-slate-700 mb-1">Payment Status</label>
//             <select name="paymentStatus" value={data.paymentStatus} onChange={handleGeneralChange} className={`${highVisInput} cursor-pointer`}>
//               <option value="Due">Due</option>
//               <option value="Cash">Cash</option>
//               <option value="Online">Online</option>
//             </select>
//           </div>
//         </div>

//         {/* Dynamic Table with all Columns */}
//         <div className="overflow-x-auto mb-4 border-4 border-slate-300 rounded-lg">
//           <table className="w-full text-left border-collapse text-sm">
//             <thead>
//               <tr className="bg-slate-800 text-white uppercase tracking-wider">
//                 <th className="p-3 border-r border-slate-600">Product</th>
//                 <th className="p-3 border-r border-slate-600 w-20 text-center">Qty</th>
//                 <th className="p-3 border-r border-slate-600 w-28 text-center">MRP</th>
//                 <th className="p-3 border-r border-slate-600 w-28 text-center">Rate</th>
//                 <th className="p-3 border-r border-slate-600 w-24 text-center">Exp</th>
//                 <th className="p-3 border-r border-slate-600 w-32 text-right">Amount</th>
//                 <th className="p-3 w-16 text-center">Del</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((item, index) => (
//                 <tr key={item.id} className="bg-slate-50 border-b-2 border-slate-300 hover:bg-slate-100 transition-colors">
//                   <td className="p-2 border-r border-slate-300"><input type="text" value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} className={highVisTableInput} /></td>
//                   <td className="p-2 border-r border-slate-300"><input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))} className={`${highVisTableInput} text-center font-bold`} /></td>
//                   <td className="p-2 border-r border-slate-300"><input type="number" value={item.mrp} onChange={(e) => handleItemChange(index, 'mrp', Number(e.target.value))} className={`${highVisTableInput} text-right`} /></td>
//                   <td className="p-2 border-r border-slate-300"><input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))} className={`${highVisTableInput} text-right font-bold text-blue-800`} /></td>
//                   <td className="p-2 border-r border-slate-300"><input type="text" value={item.exp} onChange={(e) => handleItemChange(index, 'exp', e.target.value)} className={`${highVisTableInput} text-center`} /></td>
//                   <td className="p-3 border-r border-slate-300 text-right font-black text-lg text-slate-900 bg-slate-200">{item.amount.toFixed(2)}</td>
//                   <td className="p-2 text-center">
//                     <button onClick={() => removeRow(index)} className="bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-600 hover:text-white font-extrabold px-3 py-2 rounded transition-colors shadow">
//                       X
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <button onClick={addRow} className="mb-10 text-md bg-slate-800 text-white hover:bg-slate-700 px-6 py-3 rounded-lg font-bold transition shadow-lg border-2 border-slate-900">
//           + Add New Row
//         </button>

//         {/* Bank & Totals Section */}
//         <div className="flex flex-col md:flex-row gap-8 mb-8">
//           <div className="flex-1 p-6 bg-green-50 border-4 border-green-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
//             <h3 className="col-span-1 md:col-span-2 font-black text-green-900 text-lg uppercase border-b-2 border-green-200 pb-2">Bank Details</h3>
//             <div>
//               <label className="block text-xs font-bold text-green-800 mb-1 uppercase">Bank Name</label>
//               <input type="text" name="bankName" value={data.bankName} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-green-800 mb-1 uppercase">Account No</label>
//               <input type="text" name="accountNo" value={data.accountNo} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-green-800 mb-1 uppercase">IFSC Code</label>
//               <input type="text" name="ifsc" value={data.ifsc} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-green-800 mb-1 uppercase">UPI ID</label>
//               <input type="text" name="upiId" value={data.upiId} onChange={handleGeneralChange} className={highVisInput} />
//             </div>
//           </div>

//           <div className="w-full md:w-1/3 p-6 bg-slate-800 text-white rounded-xl shadow-inner border-4 border-slate-900">
//              <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-slate-300 font-bold">Total Qty:</span> <span className="font-bold text-xl">{data.totalQty}</span></div>
//              <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-slate-300 font-bold">Sub Total:</span> <span className="font-bold text-xl">{data.subTotal.toFixed(2)}</span></div>
//              <div className="flex justify-between text-2xl font-black pt-4 mt-2">
//                <span className="text-white">Grand Total:</span> <span className="text-green-400">₹{data.grandTotal.toFixed(2)}</span>
//              </div>
//              <p className="text-sm text-slate-300 mt-4 italic capitalize text-right border-t border-slate-600 pt-3">{data.amountInWords} Only</p>
//           </div>
//         </div>

//         {/* Generate PDF Action */}
//         <div className="flex justify-center border-t-4 border-slate-200 pt-10">
//           <PDFDownloadLink document={<InvoicePDF data={data} />} fileName={`Invoice_${data.invoiceNo}.pdf`} className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-800 hover:shadow-2xl transition-all border-4 border-blue-900 transform hover:-translate-y-1">
//             {({ loading }) => (loading ? 'Generating Document...' : 'DOWNLOAD OFFICIAL PDF INVOICE')}
//           </PDFDownloadLink>
//         </div>
//       </div>
//     </div>
//   );
// }



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
  const [data, setData] = useState<InvoiceData>({
    invoiceNo: 'OFC000087',
    date: '24-06-2026',
    dueDate: '24-06-2026',
    customerName: 'M/s SOURABH JI KEMIN',
    customerAddress: '10-BIHAR',
    customerPhone: '8709623528',
    
    vendorName: 'BIHAR DAIRY SOLUTIONS',
    vendorDesc: 'All Veterinary Medicine and Semen Supplier',
    vendorAddress: 'TIWARI DAIRY DHANAUTI, MASHRAKH, CHAPRA (SARAN) PIN CODE - 841417',
    vendorEmail: 'bihardairysolutions@gmail.com',
    vendorGSTIN: '10AHWPT4906D2Z9',
    vendorPhone: '+91-9065577100, 9527899402',
    
    bankName: 'HDFC BANK',
    branch: 'MASHRAK',
    accountNo: '50200087214728',
    ifsc: 'HDFC0009869',
    upiId: 'vyapar.169126383165@hdfcbank',
    
    paymentStatus: 'Due',
    amountPaid: 0,
    
    items: [
      { id: '1', productName: 'KEMTRACE MAXIM DRY', breed: 'KEMIN', qty: 1, mfr: 'KEMIN', mrp: 5860, rate: 5860, exp: '-', dis: 0, gst: 0, amount: 5860 },
    ],
    subTotal: 0, discount: 0, gstAmount: 0, grandTotal: 0, totalQty: 0, amountInWords: ''
  });

  useEffect(() => {
    let newSubTotal = 0;
    let newTotalQty = 0;
    data.items.forEach(item => {
      newSubTotal += item.amount;
      newTotalQty += Number(item.qty);
    });
    const newGrandTotal = newSubTotal - Number(data.discount) + Number(data.gstAmount);
    
    setData(prev => ({
      ...prev,
      subTotal: newSubTotal,
      grandTotal: newGrandTotal,
      totalQty: newTotalQty,
      amountInWords: numberToWords(newGrandTotal)
    }));
  }, [data.items, data.discount, data.gstAmount]);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...data.items];
    const item = { ...updatedItems[index], [field]: value };
    
    if (field === 'qty' || field === 'rate') {
      const qty = field === 'qty' ? Number(value) : item.qty;
      const rate = field === 'rate' ? Number(value) : item.rate;
      item.amount = qty * rate;
    }
    updatedItems[index] = item;
    setData({ ...data, items: updatedItems });
  };

  const addRow = () => setData({ ...data, items: [...data.items, { id: Date.now().toString(), productName: '', breed: '', qty: 1, mfr: '', mrp: 0, rate: 0, exp: '', dis: 0, gst: 0, amount: 0 }] });
  const removeRow = (index: number) => setData({ ...data, items: data.items.filter((_, i) => i !== index) });

  const highVisInput = "w-full p-3 border-2 border-slate-400 bg-slate-50 text-slate-900 rounded shadow-sm focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-colors";
  const highVisTableInput = "w-full p-2 border-2 border-slate-400 bg-slate-50 text-slate-900 rounded focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-colors";

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-200 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-slate-300">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-900 border-b-4 border-slate-800 pb-2">Invoice Generator</h1>
        
        <div className="mb-8 p-6 bg-blue-100 border-4 border-blue-300 rounded-xl">
          <h2 className="text-lg font-bold text-blue-900 uppercase mb-4 tracking-wider">Vendor Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
              <input type="text" name="vendorName" value={data.vendorName} onChange={handleGeneralChange} className={highVisInput} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
              <input type="text" name="vendorAddress" value={data.vendorAddress} onChange={handleGeneralChange} className={highVisInput} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">GSTIN</label>
              <input type="text" name="vendorGSTIN" value={data.vendorGSTIN} onChange={handleGeneralChange} className={highVisInput} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 p-6 bg-slate-100 border-4 border-slate-300 rounded-xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Customer Name</label>
            <input type="text" name="customerName" value={data.customerName} onChange={handleGeneralChange} className={highVisInput} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Invoice No</label>
            <input type="text" name="invoiceNo" value={data.invoiceNo} onChange={handleGeneralChange} className={highVisInput} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
            <input type="text" name="date" value={data.date} onChange={handleGeneralChange} className={highVisInput} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Payment Status</label>
            <select name="paymentStatus" value={data.paymentStatus} onChange={handleGeneralChange} className={`${highVisInput} cursor-pointer`}>
              <option value="Due">Due</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mb-4 border-4 border-slate-300 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800 text-white uppercase tracking-wider">
                <th className="p-3 border-r border-slate-600">Product</th>
                <th className="p-3 border-r border-slate-600 w-20 text-center">Qty</th>
                <th className="p-3 border-r border-slate-600 w-28 text-center">MRP</th>
                <th className="p-3 border-r border-slate-600 w-28 text-center">Rate</th>
                <th className="p-3 border-r border-slate-600 w-24 text-center">Exp</th>
                <th className="p-3 border-r border-slate-600 w-32 text-right">Amount</th>
                <th className="p-3 w-16 text-center">Del</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className="bg-slate-50 border-b-2 border-slate-300 hover:bg-slate-100 transition-colors">
                  <td className="p-2 border-r border-slate-300"><input type="text" value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} className={highVisTableInput} /></td>
                  <td className="p-2 border-r border-slate-300"><input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))} className={`${highVisTableInput} text-center font-bold`} /></td>
                  <td className="p-2 border-r border-slate-300"><input type="number" value={item.mrp} onChange={(e) => handleItemChange(index, 'mrp', Number(e.target.value))} className={`${highVisTableInput} text-right`} /></td>
                  <td className="p-2 border-r border-slate-300"><input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))} className={`${highVisTableInput} text-right font-bold text-blue-800`} /></td>
                  <td className="p-2 border-r border-slate-300"><input type="text" value={item.exp} onChange={(e) => handleItemChange(index, 'exp', e.target.value)} className={`${highVisTableInput} text-center`} /></td>
                  <td className="p-3 border-r border-slate-300 text-right font-black text-lg text-slate-900 bg-slate-200">{item.amount.toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => removeRow(index)} className="bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-600 hover:text-white font-extrabold px-3 py-2 rounded transition-colors shadow">
                      X
                    </button>
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
            <div>
              <label className="block text-xs font-bold text-green-800 mb-1 uppercase">Bank Name</label>
              <input type="text" name="bankName" value={data.bankName} onChange={handleGeneralChange} className={highVisInput} />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-800 mb-1 uppercase">Account No</label>
              <input type="text" name="accountNo" value={data.accountNo} onChange={handleGeneralChange} className={highVisInput} />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-800 mb-1 uppercase">IFSC Code</label>
              <input type="text" name="ifsc" value={data.ifsc} onChange={handleGeneralChange} className={highVisInput} />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-800 mb-1 uppercase">UPI ID</label>
              <input type="text" name="upiId" value={data.upiId} onChange={handleGeneralChange} className={highVisInput} />
            </div>
          </div>

          <div className="w-full md:w-1/3 p-6 bg-slate-800 text-white rounded-xl shadow-inner border-4 border-slate-900">
             <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-slate-300 font-bold">Total Qty:</span> <span className="font-bold text-xl">{data.totalQty}</span></div>
             <div className="flex justify-between mb-3 border-b border-slate-600 pb-2"><span className="text-slate-300 font-bold">Sub Total:</span> <span className="font-bold text-xl">{data.subTotal.toFixed(2)}</span></div>
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