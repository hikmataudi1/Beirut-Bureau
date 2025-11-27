<?php
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\RequestController;
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

Route::post('/citizens/{id}/permits', [PermitController::class, 'store']);




//middleware by kheirallah
//Route::middleware('auth:sanctum')->group(function () {

    //kheirallah
    Route::put('/citizens/update/{citizenId}', [CitizenController::class, 'update']);
    //by yehya
    //service requests routes
    Route::apiResource('request', RequestController::class);
    //Route::get('/serviceRequest/citizen/{citizenId}',[ServiceRequestController::class,'getByCitizen'] );


    //for merging
    Route::get('/request/citizen/{citizenId}', [RequestController::class, 'getCitizenRequests']);
    Route::post('/request/{citizenId}', [RequestController::class, 'store']);
    Route::put('/request/status/{id}', [RequestController::class, 'updateStatus']);

  
//});