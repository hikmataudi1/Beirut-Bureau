<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Request as ServiceRequest; 
use App\Models\Citizen;
class ServiceRequestController extends Controller
{
    //used on get with no parameters to show all service requests
    public function index()
    {
        return response()->json(ServiceRequest::all());
    }

   

    //store function by kheirallah 
         public function store(Request $request, $citizenId)
        {
            $citizen = Citizen::findOrFail($citizenId);

            // Only owner can create their own request
            // if ($request->user()->id !== $citizen->user_id) {
            //     return response()->json(['message' => 'Unauthorized'], 403);
            // }

            $validated = $request->validate([
                'type' => 'required|string|max:50',
            ]);

            $newRequest = ServiceRequest::create([
                'citizen_id' => $citizenId, 
                'type' => $validated['type'],
                'status' => 'pending',

            ]);
        }

    //show a specific service request by id of request
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

    
    //get citizen requests by id and filter
    // was index() by kheirallah now getCitizenRequests() by yehya
    public function getCitizenRequests(Request $request, $citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // Only owner can view their own requests
        // if ($request->user()->id !== $citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        // Filters: ?status=pending&type=garbage&date=2025-11-24
        $query = $citizen->requests();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('date')) {
            $query->whereDate('submission_date', $request->date);
        }

        return response()->json($query->orderBy('submission_date', 'desc')->get(), 200);
    }

    //update status by kheirallah
      public function updateStatus(Request $request, $requestId)
    {
        $req = ServiceRequest::findOrFail($requestId);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $req->status = $validated['status'];

        if ($validated['status'] === 'approved') {
            $req->completion_date = now();
        }

        $req->save();

        return response()->json([
            'message' => 'Request status updated',
            'request' => $req
        ], 200);
    }
}

