<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Citizen;

class PaymentController extends Controller
{
    public function storePropertyTax(Request $request)
    {
        //Admin authentication check (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'citizen_id'   => 'nullable|array',
            'amount'        => 'required|numeric|min:0',
            'payment_type'  => 'required|string|max:50',
        ]);

        // Decide which citizens to target
        if (!empty($validated['citizen_id'])) {
            // Specific citizens
            $citizenIds = $validated['citizen_id'];
        } else {
            // All citizens
            $citizenIds = Citizen::pluck('id')->toArray();
        }

        $createdPayments = [];

        foreach ($citizenIds as $citizenId) {
            $createdPayments[] = Payment::create([
                'citizen_id'   => $citizenId,
                'amount'       => $validated['amount'],
                'payment_type' => $validated['payment_type'],
                'status'       => 'pending',
                'date'         => now(),
            ]);
        }

        return response()->json([
            'message' => 'Property tax records created successfully',
        ], 201);
    }




    public function getPropertyTax($citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // Authentication check
        // if ($request->user()->id !== $citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $payments = Payment::where('citizen_id', $citizenId)->get();

        return response()->json([
            'payments'   => $payments
        ], 200);
    }

    

        public function pay(Request $request)
    {
        $validated = $request->validate([
            'paymentId' => 'required|integer',
            'citizen_id'    => 'required|integer'
        ]);

        $payment = Payment::findOrFail($validated['paymentId']);

        // 🔒 Authentication check
        // if ($request->user()->id !== $payment->citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        // Validate that payment belongs to the user
        if ($payment->citizen_id != $validated['citizen_id']) {
            return response()->json([
                'message' => 'User is not allowed to pay this tax'
            ], 403);
        }

        // If already paid
        if ($payment->status === 'completed') {
            return response()->json([
                'message' => 'Payment already completed'
            ], 409);
        }

        // Apply payment
        $payment->status = 'completed';
        $payment->date = now();
        $payment->save();

        return response()->json([
            'status'     => 'SUCCESS',
            'paymentId'  => $payment->id,
            'paidAt'     => $payment->date,
        ], 200);
    }

    public function generateReceipt($paymentId)
    {
        $payment = Payment::with(['citizen.user'])->findOrFail($paymentId);

        // 🔒 Authentication check
        // if ($request->user()->id !== $payment->citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        if ($payment->status !== 'completed') {
            return response()->json([
                'message' => 'Cannot generate receipt for unpaid payment'
            ], 400);
        }

        return response()->json([
            'payment_id' => $payment->id,
            'citizen' => [
                'id'     => $payment->citizen->id,
                'name'   => $payment->citizen->user->name,
                'email'  => $payment->citizen->user->email,
                'contact'=> $payment->citizen->contact,
            ],
            'amount'        => $payment->amount,
            'payment_type'  => $payment->payment_type,
            'status'        => $payment->status,
            'paid_at'       => $payment->payment_date,
        ], 200);
    }
}
