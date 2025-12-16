<?php
//kheirallah
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permit;
use App\Models\Citizen;

class PermitController extends Controller
{
    // Citizen submits a permit request
    public function store(Request $request, $citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // If authentication enabled later:
        // if ($request->user()->id !== $citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $request->validate([
            'type' => 'required|string|max:50',
            'data' => 'required|array'
        ]);

        //Dynamic validation based on permit TYPE
        $requiredFields = [

            // Business permit
            'business' => ['business_name','location','owner_name'],

            // Construction permit
            'construction' => ['property_id','engineer_name','blueprint_number'],

            // Vehicle permit
            'vehicle' => ['plate_number','vehicle_type','model_year'],

            // Event permit
            'event' => ['event_name','event_date','expected_crowd'],

            // Add more types later as needed
        ];

        // If type exists in our list, enforce its rules
        if (isset($requiredFields[$request->type])) {
            foreach ($requiredFields[$request->type] as $field) {
                if (!isset($request->data[$field])) {
                    return response()->json([
                        'message' => "Missing required field: $field"
                    ], 422);
                }
            }
        }
        //Create the permit
        $permit = Permit::create([
            'type' => $request->type,
            'applicant_id' => $citizenId,
            'status' => 'pending', // initial status
            'related_documents' => $request->data
        ]);

        //Return
        return response()->json([
            'message' => 'Permit submitted successfully',
            'permit' => $permit
        ], 201);
    }
    //Get all permits for a specific citizen
    public function getCitizenPermits(Request $request, $citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // If authentication enabled later:
        // if ($request->user()->id !== $citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $permits = $citizen->permits()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'citizen' => [
                'id' => $citizen->id,
                'name' => $citizen->user->name,
                'email' => $citizen->user->email,
                'contact' => $citizen->contact,
            ],
            'permits' => $permits
        ], 200);
    }



    //admin approves or rejects a permit
     public function decide(Request $request, $permitId)
    {
        //fina baaden nzid reason for rejection
        
        // If authentication enabled later:
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }
        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
            // 'reason' => 'nullable|string|max:255'
        ]);

        $permit = Permit::findOrFail($permitId);

        if ($validated['status'] === 'accepted') {
            $permit->status = 'approved';
            // $permit->rejection_reason = null;
        } else {
            $permit->status = 'rejected';
            // $permit->rejection_reason = $validated['reason'] ?? null;
        }

        $permit->save();

        return response()->json([
            'message' => 'Permit decision updated successfully',
            'permit' => $permit
        ], 200);
    }
    // ADMIN: Get all pending permits
    public function getPending(Request $request)
    {
        // If authentication enabled later:
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $permits = Permit::where('status', 'pending')
            ->with(['citizen.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        $result = $permits->map(function ($permit) {
            return [
                'permit_id' => $permit->id,
                'type' => $permit->type,
                'submitted_data' => $permit->related_documents,
                'submitted_at' => $permit->created_at,

                'applicant' => [
                    'citizen_id' => $permit->citizen->id,
                    'name' => $permit->citizen->user->name,
                    'contact' => $permit->citizen->contact,
                    'email' => $permit->citizen->user->email,
                ]
            ];
        });

        return response()->json($result, 200);
    }
}