<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;

class PayrollController extends Controller
{
    /**
     * Get payroll summary for all employees (monthly)
     */
    public function index(Request $request)
    {
        $month = $request->get('month', now()->format('Y-m'));

        $employees = Employee::with('user')->get();

        $payroll = $employees->map(function ($employee) use ($month) {

            $totalHours = Attendance::where('employee_id', $employee->id)
                ->whereMonth('date', Carbon::parse($month)->month)
                ->whereYear('date', Carbon::parse($month)->year)
                ->sum('hours_worked');

            $monthlySalary = $employee->salary;
            $hourlyRate = $monthlySalary / 160;
            $basePay = $totalHours * $hourlyRate;

            return [
                'employee_id'    => $employee->id,
                'employee_name'  => $employee->user->name,
                'month'          => $month,
                'total_hours'    => round($totalHours, 2),
                'hourly_rate'    => round($hourlyRate, 2),
                'base_salary'    => $monthlySalary,
                'calculated_pay'=> round($basePay, 2),
            ];
        });

        return response()->json($payroll);
    }

    /**
     * Calculate final payroll with bonus & deduction
     */
    public function calculate(Request $request, $employeeId)
    {
        $request->validate([
            'month'     => 'required|date_format:Y-m',
            'bonus'     => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
        ]);

        $employee = Employee::with('user')->findOrFail($employeeId);

        $totalHours = Attendance::where('employee_id', $employee->id)
            ->whereMonth('date', Carbon::parse($request->month)->month)
            ->whereYear('date', Carbon::parse($request->month)->year)
            ->sum('hours_worked');

        $hourlyRate = $employee->salary / 160;
        $basePay = $totalHours * $hourlyRate;

        $bonus = $request->bonus ?? 0;
        $deduction = $request->deduction ?? 0;

        $finalPay = $basePay + $bonus - $deduction;

        return response()->json([
            'employee_id'   => $employee->id,
            'employee_name' => $employee->user->name,
            'month'         => $request->month,
            'total_hours'   => round($totalHours, 2),
            'hourly_rate'   => round($hourlyRate, 2),
            'base_pay'      => round($basePay, 2),
            'bonus'         => $bonus,
            'deduction'     => $deduction,
            'final_pay'     => round($finalPay, 2),
        ]);
    }
}
