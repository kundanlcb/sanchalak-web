import { http, HttpResponse, delay } from 'msw';
import type { FeeCategory, FeeStructure, StudentFeeRecord, PaymentTransaction } from '../../features/finance/types';
import { db, updateItem, deleteItem } from '../db';

export const financeHandlers = [
  // Fee Categories
  http.get('/api/finance/fees/categories', async () => {
    await delay(300);
    return HttpResponse.json(db.fees);
  }),

  http.post('/api/finance/fees/categories', async ({ request }) => {
    await delay(500);
    const newCategory = await request.json() as FeeCategory;
    const categoryWithId = { ...newCategory, id: `F-CAT-${Date.now()}` };
    db.fees.push(categoryWithId);
    return HttpResponse.json(categoryWithId, { status: 201 });
  }),

  http.put('/api/finance/categories/:id', async ({ request, params }) => {
    await delay(500);
    const { id } = params;
    const updates = await request.json() as Partial<FeeCategory>;
    const updated = updateItem(db.fees, id as string, updates);
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/finance/categories/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const deleted = deleteItem(db.fees, id as string);
    if (!deleted) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, id });
  }),

  // Fee Structures
  http.get('/api/finance/structures', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    if (classId) {
      return HttpResponse.json(db.feeStructures.filter(fs => fs.classId === classId));
    }
    return HttpResponse.json(db.feeStructures);
  }),

  http.post('/api/finance/structures', async ({ request }) => {
    await delay(500);
    const newStructure = await request.json() as FeeStructure;
    // Ensure ID exists
    const finalStructure = { ...newStructure, id: newStructure.id || `FS-${Date.now()}` };
    db.feeStructures.push(finalStructure);
    return HttpResponse.json(finalStructure, { status: 201 });
  }),

  http.put('/api/finance/structures/:id', async ({ request, params }) => {
    await delay(500);
    const { id } = params;
    const updates = await request.json() as Partial<FeeStructure>;
    const updated = updateItem(db.feeStructures, id as string, updates);
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/finance/fees/structures/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;

    const deleted = deleteItem(db.feeStructures, id as string);
    if (!deleted) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, id });
  }),


  // Student Fee Ledger (Calculated on the fly for mock)
  http.get('/api/finance/ledger/:studentId', async ({ params }) => {
    await delay(300);
    const { studentId } = params;
    const sid = Number(studentId);

    // In a real app, this would be a complex query. 
    // MOCK: Return a static structure for now or filter transactions
    const studentTransactions = db.transactions.filter(t => t.studentId === sid);

    // Mock ledger record
    const ledger: StudentFeeRecord = {
      id: `SFR-${sid}`,
      studentId: sid,
      feeStructureId: 'FS-2026-G5-001',
      academicYear: '2025-2026',
      totalAmount: 6500,
      paidAmount: studentTransactions.filter(t => t.status === 'Success').reduce((sum, t) => sum + t.amount, 0),
      pendingAmount: 0, // Calculate properly
      status: 'Paid',
      dueDate: '2026-02-10',
      transactions: studentTransactions.map(t => t.id)
    };

    ledger.pendingAmount = ledger.totalAmount - ledger.paidAmount;
    if (ledger.pendingAmount > 0) ledger.status = 'Pending';

    return HttpResponse.json({
      summary: {
        totalDue: ledger.totalAmount,
        totalPaid: ledger.paidAmount,
        totalPending: ledger.pendingAmount
      },
      records: [ledger]
    });
  }),

  // Transactions
  http.get('/api/finance/transactions', async () => {
    await delay(300);
    return HttpResponse.json(db.transactions);
  }),

  // Defaulters list (Aggregated)
  http.get('/api/finance/defaulters', async () => {
    await delay(500);
    // Simple mock calculation: 
    // For every student, check if they have paid "enough".
    // We assume a standard fee of 50000 for calculation if structure missing

    const results = db.students.map(student => {
      const paid = db.transactions
        .filter(t => t.studentId === student.id && t.status === 'Success')
        .reduce((sum, t) => sum + t.amount, 0);

      // Use real structure if available, else static
      // Find structures for this class
      const classStructures = db.feeStructures.filter(fs => fs.classId === student.classID);
      const totalFee = classStructures.reduce((sum, fs) => sum + fs.amount, 0) || 50000;

      const due = totalFee - paid;

      if (due > 0) {
        return {
          id: student.id, // Widget expects 'id'
          studentName: student.name,
          studentId: student.id,
          grade: student.classID, // Ideally map to Class Name using db.classes
          amountDue: due,
          daysOverdue: Math.floor(Math.random() * 60) + 1 // Mock days
        };
      }
      return null;
    }).filter(d => d !== null);

    // Sort by highest due
    // @ts-ignore
    results.sort((a, b) => b.amountDue - a.amountDue);

    return HttpResponse.json(results.slice(0, 5)); // Top 5
  }),

  http.get('/api/finance/transactions/:studentId', async ({ params }) => {
    await delay(300);
    const { studentId } = params;
    return HttpResponse.json(db.transactions.filter(t => t.studentId === Number(studentId)));
  }),

  http.post('/api/finance/transactions', async ({ request }) => {
    await delay(1000); // Simulate gateway delay
    const txn = await request.json() as PaymentTransaction;

    const newTxn: PaymentTransaction = {
      ...txn,
      id: `TXN-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Success', // Mock gateway always succeeds for now
      receiptId: `RCP-${Date.now()}`
    };

    db.transactions.push(newTxn);
    return HttpResponse.json(newTxn, { status: 201 });
  })
];
