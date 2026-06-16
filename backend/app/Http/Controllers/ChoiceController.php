<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChoiceRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Choice;
use Illuminate\Http\Request;

class ChoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ChoiceRequest $request)
    {
        try {

            $choice = Choice::updateOrCreate(
                [
                    'userId' => $request->user()->getKey(),
                    'questionId' => $request->input('questionId'),
                ],
                [
                    'queryItemId' => $request->input('queryItemId'),
                ]
            );

            return ApiResponse::success(
                ['choice' => $choice],
                '回答を保存しました',
                $choice->wasRecentlyCreated ? 201 : 200
            );
        } catch (\Throwable $th) {
            report($th);

            return ApiResponse::error(
                '回答の保存に失敗しました',
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
