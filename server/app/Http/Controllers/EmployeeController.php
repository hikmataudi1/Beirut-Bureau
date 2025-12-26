<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index()
    {
        $employees = Employee::with(['user', 'department'])->get();

        return response()->json($employees);
    }

    /**
     * Store a newly created employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
             'position'      => 'required|in:Admin,Mayor,Municipal Director,Finance Officer,Urban Planner,Project Manager,HR Manager,Clerk,Staff,Citizen,Resident',
            'department_id'  => 'required|exists:departments,id',
            'hire_date'      => 'required|date',
            'salary'         => 'required|numeric|min:0',
        ]);

        $employee = Employee::create($validated);

        //add user role
         $user = User::findOrFail($validated['user_id']);
        $user->role = $validated['position'];
        $user->save(); 

        return response()->json([
            'message' => 'Employee created successfully',
            'employee' => $employee
        ], 201);
    }

    /**
     * Display the specified employee.
     */
    public function show($id)
    {
        $employee = Employee::with([
            'user',
            'department',
            'tasks'
        ])->findOrFail($id);

        return response()->json($employee);
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $user = User::findOrFail($employee->user_id);

        $validated = $request->validate([
            'position'      => 'required|in:Admin,Mayor,Municipal Director,Finance Officer,Urban Planner,Project Manager,HR Manager,Clerk,Staff,Citizen,Resident',
            'department_id'  => 'sometimes|required|exists:departments,id',
            'hire_date'      => 'sometimes|required|date',
            'salary'         => 'sometimes|required|numeric|min:0',
        ]);

        $employee->update($validated);
        $user->update(['role' => $validated['position']]);

        return response()->json([
            'message' => 'Employee updated successfully',
            'employee' => $employee
        ]);
    }

    /**
     * Remove the specified employee.
     */
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully'
        ]);
    }
}