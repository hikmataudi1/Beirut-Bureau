<?php
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\CitizenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//authentication by kheirallah
//add citizen
Route::post('/citizens', [CitizenController::class, 'store']);
//login citizen
Route::post('/login', [CitizenController::class, 'login']);





//middleware by kheirallah
//Route::middleware('auth:sanctum')->group(function () {


    //by yehya
    //service requests routes
    Route::apiResource('serviceRequest', ServiceRequestController::class);
    //Route::get('/serviceRequest/citizen/{citizenId}',[ServiceRequestController::class,'getByCitizen'] );


    //for merging
    Route::get('/serviceRequest/citizen/{citizenId}', [ServiceRequestController::class, 'getCitizenRequests']);
    Route::post('/serviceRequest/{citizenId}', [ServiceRequestController::class, 'store']);
    Route::put('/serviceRequest/status/{id}', [ServiceRequestController::class, 'updateStatus']);

//});