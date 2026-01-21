<?php
// kheirallah
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Project;
use App\Models\Employee;

class TaskController extends Controller
{
    /**
     * ADMIN: Create a task for a project
     */
    public function store(Request $request)
    {
        // 🔒 Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $validated = $request->validate([
            'project_id'  => 'required|exists:projects,id',
            'title'       => 'required|string|max:150',
            'assignee_id' => 'nullable|exists:employees,id',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $task = Task::create([
            'project_id'  => $validated['project_id'],
            'title'       => $validated['title'],
            'assignee_id' => $validated['assignee_id'] ?? null,
            'start_date'  => $validated['start_date'] ?? null,
            'end_date'    => $validated['end_date'] ?? null,
            'status'      => 'pending',
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task'    => $task
        ], 201);
    }

    //ADMIN: Update task details
    public function update(Request $request, $taskId)
    {
        // 🔒 Admin authentication (COMMENTED FOR NOW)
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $task = Task::findOrFail($taskId);

        $validated = $request->validate([
            'title'       => 'nullable|string|max:150',
            'assignee_id' => 'nullable|exists:employees,id',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully',
            'task'    => $task
        ], 200);
    }

    //ADMIN / EMPLOYEE: Update task status
    public function updateStatus(Request $request, $taskId)
    {
        // 🔒 Auth logic later (admin or assignee)
        // if (!authorized) { ... }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,on_hold',
        ]);

        $task = Task::findOrFail($taskId);
        $task->status = $validated['status'];
        $task->save();

        return response()->json([
            'message' => 'Task status updated',
            'task'    => $task
        ], 200);
    }
    //Get all tasks for a project
    public function getByProject($projectId)
    {
        $project = Project::findOrFail($projectId);

        $tasks = Task::with('assignee')
            ->where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'project' => [
                'id'   => $project->id,
                'name' => $project->name,
            ],
            'tasks' => $tasks
        ], 200);
    }

    //Get all tasks assigned to an employee
    public function getByEmployee($employeeId)
    {
        $tasks = Task::with('project')
            ->where('assignee_id', $employeeId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'employee_id' => $employeeId,
            'tasks'       => $tasks
        ], 200);
    }

    // ADMIN: Get all tasks (index)
public function index()
{
    // Optionally, you can restrict to admin only
    // if (auth()->user()->role !== 'admin') {
    //     return response()->json(['message' => 'Unauthorized'], 403);
    // }

    $tasks = Task::with(['project', 'assignee'])
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($tasks, 200);
}

// ADMIN: Delete a task
public function destroy($taskId)
{
    // Optionally, restrict to admin
    // if (auth()->user()->role !== 'admin') {
    //     return response()->json(['message' => 'Unauthorized'], 403);
    // }

    $task = Task::find($taskId);
    if (!$task) {
        return response()->json(['message' => 'Task not found'], 404);
    }

    $task->delete();

    return response()->json(['message' => 'Task deleted successfully'], 200);
}

}
