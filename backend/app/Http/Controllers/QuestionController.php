<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Question;

class QuestionController extends Controller
{
    //
     public function index()
    {
        $questions = Question::with('queryItems')->get();

        return response()->json($questions);
    }

}
