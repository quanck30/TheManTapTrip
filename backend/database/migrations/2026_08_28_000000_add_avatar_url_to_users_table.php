<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 0001_01_01_000000_create_users_table.php に avatarUrl カラムが後から追加されたが、
 * 本番環境ではそのマイグレーションが既に実行済みとして記録されており、
 * ファイルを直接書き換えても再実行されないため、追加専用のマイグレーションとして分離する。
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'avatarUrl')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('avatarUrl', 2048)->nullable()->after('displayName');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'avatarUrl')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('avatarUrl');
            });
        }
    }
};
