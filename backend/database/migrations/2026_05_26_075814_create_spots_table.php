<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spots', function (Blueprint $table) {
             $table->id();

        // ユーザー番号
        $table->foreignId('userId')
            ->constrained('users')
            ->cascadeOnDelete();

        // スポット名
        $table->string('sName');

        // Places API の place_id
        $table->string('spotId', 255);

        // 住所
        $table->string('address', 255);

        // 訪問済みフラグ
        $table->boolean('isVisited')->default(false);

        // 緯度・経度
        $table->decimal('lat', 10, 7);
        $table->decimal('long', 10, 7);

        // 評価
        $table->decimal('rating',2,1)->nullable();

        // 価格帯
        $table->string('price')->nullable();

        // 駐車場有無
        $table->boolean('hasParking')->default(false);

        // 説明
        $table->string('summary', 255)->nullable();

        // 写真リファレンス
        $table->string('photoReference', 255)->nullable();

        // ルート案内URL
        $table->string('directionUrl', 255)->nullable();

        $table->timestamps();

        // 同一ユーザーによる重複登録防止
        $table->unique(['userId', 'spotId']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spots');
    }
};
