<?php
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\CitizenController;
use app\Http\Controllers\CertficateRequestController;
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

    //kheirallah
    Route::put('/citizens/update/{citizenId}', [CitizenController::class, 'update']);
    //by yehya
    //service requests routes
    Route::apiResource('request', ServiceRequestController::class);
    //Route::get('/serviceRequest/citizen/{citizenId}',[ServiceRequestController::class,'getByCitizen'] );


    //for merging
    Route::get('/request/citizen/{citizenId}', [ServiceRequestController::class, 'getCitizenRequests']);
    Route::post('/request/{citizenId}', [ServiceRequestController::class, 'store']);
    Route::put('/request/status/{id}', [ServiceRequestController::class, 'updateStatus']);

  
//});