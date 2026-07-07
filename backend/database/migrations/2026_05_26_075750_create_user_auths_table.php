<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * user_authsテーブルを作成します。
     */
    public function up(): void
    {
        Schema::create('user_auths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->cascadeOnDelete();
            // 認証プロバイダー名と外部アカウントの識別子を保存します。
            $table->string('provider', 20);
            $table->string('providerKey', 255)->nullable();
            $table->string('passHash', 255)->nullable();
            $table->string('email')->unique()->nullable();
            $table->timestamps();
            // 同じ外部アカウントでユーザーが重複作成されないようにします。
            $table->unique([
                'provider',
                'providerKey'
            ]);
        });
    }

    /**
     * user_authsテーブルを削除します。
     */
    public function down(): void
    {
        Schema::dropIfExists('user_auths');
    }
};
