<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Request as ServiceRequest; 

class ServiceRequestController extends Controller
{
    //used on get with no parameters to show all service requests
    public function index()
    {
        return response()->json(ServiceRequest::all());
    }

    //used on post to add a service request
    public function store(Request $request)
    {
        //validate data
        $validated = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'type' => 'required|string|max:50',
            'status' => 'nullable|in:pending,approved,rejected',
            'submission_date' => 'nullable|date',
            'completion_date' => 'nullable|date',

        ]);
        $serviceRequest = ServiceRequest::create([
            'citizen_id' => $validated['citizen_id'],
            'type' => $validated['type'],
            'status' => $validated['status'] ?? 'pending',
            'submission_date' => now(),
        ]);
        return response()->json($serviceRequest, 201);
    }

    //show a specific service request
    //id corresponds to url params  serviceRequest/'5' <--
        public function show($id)
        {
            $serviceRequest = ServiceRequest::find($id);
            if (!$serviceRequest) return response()->json(['message' => 'Not found'], 404);
            return response()->json($serviceRequest);
        }   

    //update a specific request.
    public function update(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::find($id);
        if (!$serviceRequest) return response()->json(['message' => 'Not found'], 404);
        $serviceRequest->update($request->all());
        return response()->json($serviceRequest);
    }

    //delete a specific request
    public function destroy($id)
    {
        $serviceRequest = ServiceRequest::find($id);
        if (!$serviceRequest) return response()->json(['message' => 'Not found'], 404);
        $serviceRequest->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    //depending on a citizens id get all service requests for rhis citizen
    public function getByCitizen($citizenId)
    {
        $serviceRequests = ServiceRequest::where('citizen_id',$citizenId)->get();
        return response()->json($serviceRequests);
    }
}

