<?php
// kheirallah
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    //ADMIN: Create a department
    public function store(Request $request)
    {
        //Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:departments,name',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Department created successfully',
            'department' => $department
        ], 201);
    }

    //ADMIN: Update department
    public function update(Request $request, $departmentId)
    {
        //Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $department = Department::findOrFail($departmentId);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:departments,name,' . $departmentId,
        ]);

        $department->update($validated);

        return response()->json([
            'message' => 'Department updated successfully',
            'department' => $department
        ], 200);
    }

    //Get all departments
    public function index()
    {
        $departments = Department::orderBy('name')->get();

        return response()->json($departments, 200);
    }

    //Get single department with projects
    public function show($departmentId)
    {
        $department = Department::with('projects')->findOrFail($departmentId);

        return response()->json([
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
            ],
            'projects' => $department->projects
        ], 200);
    }
}
