<?php
// kheirallah
namespace App\Http\Controllers;

use App\Models\Citizen;
use Illuminate\Http\Request as HttpRequest;
use App\Models\Request as RequestModel;


class RequestController extends Controller
{
    // 1. Get all requests for a citizen (with optional filters)
    public function index(HttpRequest $request, $citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // Only owner can view their own requests
        if ($request->user()->id !== $citizen->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

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

    // 2. Create a new request
    public function store(HttpRequest $request, $citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // Only owner can create their own request
        if ($request->user()->id !== $citizen->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|string|max:50',
        ]);

        $newRequest = RequestModel::create([
            'citizen_id' => $citizenId, 
            'type' => $validated['type'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Request submitted successfully',
            'request' => $newRequest
        ], 201);
    }

    //3. Update request status (for admin later)
    public function updateStatus(HttpRequest $request, $requestId)
    {
        $req = RequestModel::findOrFail($requestId);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed'
        ]);

        $req->status = $validated['status'];

        if ($validated['status'] === 'completed') {
            $req->completion_date = now();
        }

        $req->save();

        return response()->json([
            'message' => 'Request status updated',
            'request' => $req
        ], 200);
    }
}
