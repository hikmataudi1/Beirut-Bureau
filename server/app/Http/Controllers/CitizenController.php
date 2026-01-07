<?php
// kheirallah
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Citizen;
use Illuminate\Support\Facades\Hash;

class CitizenController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|min:6',
            'national_id' => 'required|string|max:20|unique:citizens,national_id',
            'address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
        ]);

        // 2. Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // encrypted password
        ]);

        // 3. Create citizen linked to user
        $citizen = Citizen::create([
            'user_id' => $user->id,
            'national_id' => $validated['national_id'],
            'address' => $validated['address'] ?? null,
            'contact' => $validated['contact'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Citizen registered successfully',
            'token' => $token,
            'user' => $user,
            'citizen' => $citizen
        ], 201);
    }

    public function login(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Find user
        $user = User::where('email', $request->email)->first();

        // User not found OR incorrect password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Create token
     $token = $user->createToken('auth_token')->plainTextToken;
      
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'role' => $user->role,
            'citizen' => $user->citizen
        ], 200);
    }

        public function update(Request $request, $citizenId)
    {
        $citizen = Citizen::findOrFail($citizenId);

        // Check: Is the logged-in user allowed to edit this profile?
        // if ($request->user()->id !== $citizen->user_id) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        // Validate
        $validated = $request->validate([
            'address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
        ]);

        // Update citizen
        $citizen->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'citizen' => $citizen
        ], 200);
    }
        public function logout(Request $request)
    {
        // Revoke the current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
    
    public function index()
    {
        // 🔒 Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $citizens = Citizen::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($citizens, 200);
    }
}