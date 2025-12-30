<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    //ADMIN: Create a project
    public function store(Request $request)
    {
        // Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'name'          => 'required|string|max:150',
            'department_id' => 'nullable|exists:departments,id',
            'budget'        => 'nullable|numeric|min:0',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
        ]);

        $project = Project::create([
            'name'          => $validated['name'],
            'department_id' => $validated['department_id'] ?? null,
            'budget'        => $validated['budget'] ?? null,
            'start_date'    => $validated['start_date'] ?? null,
            'end_date'      => $validated['end_date'] ?? null,
            'status'        => 'planned',
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project
        ], 201);
    }
    //ADMIN: Update project info
    public function update(Request $request, $projectId)
    {
        // Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'name'          => 'nullable|string|max:150',
            'department_id' => 'nullable|exists:departments,id',
            'budget'        => 'nullable|numeric|min:0',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project
        ], 200);
    }

    //ADMIN: Update project status only
    public function updateStatus(Request $request, $projectId)
    {
        // Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'status' => 'required|in:planned,ongoing,completed,cancelled',
        ]);

        $project = Project::findOrFail($projectId);
        $project->status = $validated['status'];
        $project->save();

        return response()->json([
            'message' => 'Project status updated',
            'project' => $project
        ], 200);
    }

    public function show($id)
    {
        $project = Project::with(['department', 'tasks'])->findOrFail($id);

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'status' => $project->status,
                'budget' => $project->budget,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
            ],
            'department' => $project->department ? [
                'id' => $project->department->id,
                'name' => $project->department->name,
            ] : null,
            'tasks' => $project->tasks
        ], 200);
    }

    //Get all projects (public / admin dashboard)
    public function index()
    {
        $projects = Project::with('department')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($projects, 200);
    }
}
