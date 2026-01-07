<?php
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\EmployeeController;

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\TaskController;

use App\Http\Controllers\AttendanceController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PerformanceOverviewController;




Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//authentication by kheirallah
//add citizen
Route::post('/citizens', [CitizenController::class, 'store']);
//login citizen
Route::post('/login', [CitizenController::class, 'login']);



//middleware by kheirallah
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [CitizenController::class, 'logout']);


    //kheirallah
        Route::get('/citizens', [CitizenController::class, 'index']);
        Route::put('/citizens/update/{citizenId}', [CitizenController::class, 'update']);
        //permit routes
        Route::post('/citizens/{id}/permits', [PermitController::class, 'store']);
        Route::get('/citizens/{id}/permits', [PermitController::class, 'getCitizenPermits']);
        Route::put('/admin/permits/{id}', [PermitController::class, 'decide']);
        Route::get('/admin/permits/pending', [PermitController::class, 'getPending']);
        //request routes
        Route::get('/request/citizen/{citizenId}', [RequestController::class, 'getCitizenRequests']);
        Route::post('/request/{citizenId}', [RequestController::class, 'store']);
        Route::put('/request/status/{id}', [RequestController::class, 'updateStatus']);
        // Payments routes
        Route::get('/property-tax/{citizenId}', [PaymentController::class, 'getPropertyTax']);
        Route::post('/property-tax/pay', [PaymentController::class, 'pay']);
        Route::get('/payments/{paymentId}', [PaymentController::class, 'generateReceipt']);
        Route::post('/admin/property-tax', [PaymentController::class, 'storePropertyTax']);
        //project routes
        Route::post('/admin/projects', [ProjectController::class, 'store']);
        Route::put('/admin/projects/{id}', [ProjectController::class, 'update']);
        Route::put('/admin/projects/{id}/status', [ProjectController::class, 'updateStatus']);
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{id}', [ProjectController::class, 'show']);
        // Departments routes
        Route::post('/admin/departments', [DepartmentController::class, 'store']);
        Route::put('/admin/departments/{id}', [DepartmentController::class, 'update']);
        Route::get('/departments', [DepartmentController::class, 'index']);
        Route::get('/departments/{id}', [DepartmentController::class, 'show']);
        // Tasks routes
        Route::post('/admin/tasks', [TaskController::class, 'store']);
        Route::put('/admin/tasks/{id}', [TaskController::class, 'update']);
        Route::put('/tasks/{id}/status', [TaskController::class, 'updateStatus']);
        Route::get('/projects/{projectId}/tasks', [TaskController::class, 'getByProject']);
        Route::get('/employees/{employeeId}/tasks', [TaskController::class, 'getByEmployee']);


    //by yehya
    //service requests routes
    Route::apiResource('request', RequestController::class);
    //Route::get('/serviceRequest/citizen/{citizenId}',[ServiceRequestController::class,'getByCitizen'] );

     //by yehya
    //hr employees management
    //get all employees
    Route::apiResource('employees', EmployeeController::class);

    //by yehya
    //attendances routes

    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::get('/attendance/employee/{id}', [AttendanceController::class, 'employeeAttendance']);
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
    Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
    Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);

    //payroll by yehya
    Route::get('/payroll', [PayrollController::class, 'index']);
    Route::post('/payroll/{employee}/calculate', [PayrollController::class, 'calculate']);
    Route::get('/employee-performance/{id}', [PerformanceOverviewController::class, 'show']);
});