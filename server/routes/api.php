<?php

use Illuminate\Http\Request;
use App\Http\Controllers\CitizenController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//add citizen
Route::post('/citizens', [CitizenController::class, 'store']);
//login citizen
Route::post('/login', [CitizenController::class, 'login']);
//put citizen
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/citizens/{id}', [CitizenController::class, 'update']);
});
