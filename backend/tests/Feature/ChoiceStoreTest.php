<?php

use App\Models\QueryItem;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('creates and updates a user choice for the same question', function () {
    $user = User::factory()->create();
    $question = Question::create(['title' => 'Question']);
    $firstItem = QueryItem::create([
        'questionId' => $question->id,
        'title' => 'First',
        'searchType' => '',
    ]);
    $secondItem = QueryItem::create([
        'questionId' => $question->id,
        'title' => 'Second',
        'searchType' => '',
    ]);

    Sanctum::actingAs($user);

    $this->postJson('/api/v1/choices', [
        'queId' => $question->id,
        'itemId' => $firstItem->id,
    ])->assertCreated()
        ->assertJsonPath('data.choice.queryItemId', $firstItem->id);

    $this->postJson('/api/v1/choices', [
        'queId' => $question->id,
        'itemId' => $secondItem->id,
    ])->assertOk()
        ->assertJsonPath('data.choice.queryItemId', $secondItem->id);

    $this->assertDatabaseCount('choices', 1);
    $this->assertDatabaseHas('choices', [
        'userId' => $user->id,
        'questionId' => $question->id,
        'queryItemId' => $secondItem->id,
    ]);
});

it('rejects an item that does not belong to the selected question', function () {
    $user = User::factory()->create();
    $selectedQuestion = Question::create(['title' => 'Selected question']);
    $otherQuestion = Question::create(['title' => 'Other question']);
    $otherItem = QueryItem::create([
        'questionId' => $otherQuestion->id,
        'title' => 'Other item',
        'searchType' => '',
    ]);

    Sanctum::actingAs($user);

    $this->postJson('/api/v1/choices', [
        'queId' => $selectedQuestion->id,
        'itemId' => $otherItem->id,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('itemId');

    $this->assertDatabaseCount('choices', 0);
});
