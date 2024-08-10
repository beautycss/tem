<?php

namespace Beautycss\Tem\Http\Controllers;

use Encore\Admin\Layout\Content;
use Illuminate\Routing\Controller;

class TemController extends Controller
{
    public function index(Content $content)
    {
        return $content
            ->title('Title')
            ->description('Description')
            ->body(view('tem::index'));
    }
}