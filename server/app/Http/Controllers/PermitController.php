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
}
