<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateVisitLocationRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Spot;
use DB;
use Exception;
use Illuminate\Http\Request;
use Log;

class VisitLocationController extends Controller
{
    public function __construct(private ApiResponse $apiResponse) {}

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
    public function store(Request $request)
    {
        //
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
    public function update(UpdateVisitLocationRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                // 更新をかけるデータを取得
                $spotData = $request->user()->spots()->findOrFail($request->input('id'));
                // 行き済み(true)に更新
                $spotData->isVisited = $spotData->isVisited ? false : true;

                // 更新を保存
                $spotData->save();
            });

            // レスポンスを返す
            return $this->apiResponse->success(
                [],
                "行き済み登録に成功しました。",
                200
            );

        } catch (Exception $e) {
            Log::error("行き済み登録に失敗しました。", [
                'message' => $e->getMessage(), // エラー内容
                'file' => $e->getFile(),    // 発生したファイル
                'line' => $e->getLine(),    // 発生した行
            ]);

            return $this->apiResponse->error(
                "行き済み登録に失敗しました。",
                500
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
