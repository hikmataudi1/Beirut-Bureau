<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Task;
use Carbon\Carbon;

class PerformanceOverviewController extends Controller
{
    public function show(Request $request, $employeeId)
    {
        // Optional month filter
        $month = $request->get('month', now()->format('Y-m'));
        $parsedDate = Carbon::createFromFormat('Y-m', $month);

        $employee = Employee::with('user')->findOrFail($employeeId);

        // Attendance
        $totalHours = Attendance::where('employee_id', $employee->id)
            ->whereMonth('date', $parsedDate->month)
            ->whereYear('date', $parsedDate->year)
            ->sum('hours_worked');

        $expectedDailyHours = 8;
        $daysInMonth = $parsedDate->daysInMonth;
        $attendanceScore = min(($totalHours / ($expectedDailyHours * $daysInMonth)) * 100, 100);

        // Tasks
        $tasks = Task::where('assignee_id', $employee->id)
            ->whereMonth('start_date', $parsedDate->month)
            ->whereYear('start_date', $parsedDate->year)
            ->get();

        $completed = $tasks->where('status', 'Completed')->count();
        $taskScore = $tasks->count() > 0
            ? ($completed / $tasks->count()) * 100
            : 100;

        // Overall performance
        $overallScore = 0.6 * $taskScore + 0.4 * $attendanceScore;

        // Category
        $status = $overallScore >= 85 ? 'Excellent' :
                  ($overallScore >= 70 ? 'Good' :
                  ($overallScore >= 50 ? 'Average' : 'Poor'));

        return response()->json([
            'employee_id' => $employee->id,
            'employee_name' => $employee->user->name,
            'department_id' => $employee->department_id,
            'total_hours' => round($totalHours, 2),
            'attendance_score' => round($attendanceScore, 1),
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $completed,
            'task_score' => round($taskScore, 1),
            'overall_score' => round($overallScore, 1),
            'status' => $status,
            'tasks' => $tasks->map(fn($t) => [
                'title' => $t->title,
                'status' => $t->status,
                'start_date' => $t->start_date,
                'end_date' => $t->end_date,
            ]),
        ]);
    }
}
