<?php

use Illuminate\Http\Request;
use App\Http\Controllers\CitizenController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//add citizen
Route::post('/citizens', [CitizenController::class, 'store']);
//login citizen
Route::post('/login', [CitizenController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // Citizen update
    Route::put('/citizens/{id}', [CitizenController::class, 'update']);
    // Get all citizen requests + filters
    Route::get('/citizens/{id}/requests', [RequestController::class, 'index']);

    // Submit new request
    Route::post('/citizens/{id}/requests', [RequestController::class, 'store']);

    // Update request status
    Route::put('/requests/{id}/status', [RequestController::class, 'updateStatus']);
});