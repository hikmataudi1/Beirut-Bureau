<?php

namespace App\Http\Controllers;
use App\Models\Request as DbRequest; 
use App\Models\Citizen;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    //funcction to get all requests (certificae and services)
     public function index()
    {
        return response()->json(DbRequest::all());
    }

    //store a request
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

            $newRequest = DbRequest::create([
                'citizen_id' => $citizenId, 
                'type' => $validated['type'],
                'status' => 'pending',

            ]);
        }
        
     //show a specific service request by id of request
    //id corresponds to url params  serviceRequest/'5' <--
        public function show($id)
        {
            $request = DbRequest::find($id);
            if (!$request) return response()->json(['message' => 'Not found'], 404);
            return response()->json($request);
        }   

    //update a specific request.
    public function update(Request $request, $id)
    {
        $request = DbRequest::find($id);
        if (!$request) return response()->json(['message' => 'Not found'], 404);
        $request->update($request->all());
        return response()->json($request);
    }

    //delete a specific request
    public function destroy($id)
    {
        $request = DbRequest::find($id);
        if (!$request) return response()->json(['message' => 'Not found'], 404);
        $request->delete();
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
        $req = DbRequest::findOrFail($requestId);

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
