<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display all attendance records (HR view).
     */
    public function index(Request $request)
    {
        $query = Attendance::with('employee.user');

        // Optional filters by employee id
        if ($request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->date) {
            $query->where('date', $request->date);
        }

        return response()->json(
            $query->orderBy('date', 'desc')->get()
        );
    }

    /**
     * Employee check-in.
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
        ]);

        $today = Carbon::today()->toDateString();

        // Prevent double check-in
        $attendance = Attendance::where('employee_id', $request->employee_id)
            ->where('date', $today)
            ->first();

        if ($attendance) {
            return response()->json([
                'message' => 'Already checked in today.'
            ], 400);
        }

        $attendance = Attendance::create([
            'employee_id' => $request->employee_id,
            'date'        => $today,
            'check_in'    => Carbon::now()->toTimeString(),
        ]);

        return response()->json($attendance, 201);
    }

    /**
     * Employee check-out.
     */
    public function checkOut(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
        ]);

        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('employee_id', $request->employee_id)
            ->where('date', $today)
            ->firstOrFail();

        if ($attendance->check_out) {
            return response()->json([
                'message' => 'Already checked out.'
            ], 400);
        }

        $checkOutTime = Carbon::now();

        $attendance->update([
            'check_out'    => $checkOutTime->toTimeString(),
            'hours_worked' => Carbon::parse($attendance->check_in)
                                ->diffInMinutes($checkOutTime) / 60
        ]);

        return response()->json($attendance);
    }

    /**
     * Update attendance record (HR correction).
     */
    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $request->validate([
            'check_in'  => 'nullable|date_format:H:i:s',
            'check_out' => 'nullable|date_format:H:i:s',
        ]);

        $attendance->update($request->only([
            'check_in',
            'check_out',
            'hours_worked'
        ]));

        return response()->json($attendance);
    }

    /**
     * Delete attendance record (HR only).
     */
    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return response()->json([
            'message' => 'Attendance record deleted successfully.'
        ]);
    }

    /**
     * Show attendance for a specific employee.
     */
    public function employeeAttendance($employeeId)
    {
        $employee = Employee::findOrFail($employeeId);

        return response()->json(
            Attendance::where('employee_id', $employeeId)
                ->orderBy('date', 'desc')
                ->get()
        );
    }
}
