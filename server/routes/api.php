<?php
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\PaymentController;
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
        Route::post('/payments/{paymentId}', [PaymentController::class, 'generateReceipt']);
        Route::post('/admin/property-tax', [PaymentController::class, 'storePropertyTax']);


    //by yehya
    //service requests routes
    Route::apiResource('request', RequestController::class);
    //Route::get('/serviceRequest/citizen/{citizenId}',[ServiceRequestController::class,'getByCitizen'] );

  
//});