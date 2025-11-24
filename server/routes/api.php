<?php
use App\Http\Controllers\ServiceRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//service requests routes
Route::apiResource('serviceRequest', ServiceRequestController::class);
Route::get('/serviceRequest/citizen/{citizenId}',[ServiceRequestController::class,'getByCitizen'] );
