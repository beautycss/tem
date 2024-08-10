<?php

namespace Beautycss\Tem;

use Encore\Admin\Form\Field;

class TemField extends Field
{
    protected $view = 'tem::tem_field';

    protected static $js = [
        'vendor/beautycss/tem/tem.js'
    ];

    protected static $css = [
        'vendor/beautycss/tem/tem.css'
    ];

    public function render()
    {

        $this->script = <<< EOF
window.DemoTem = new BeautycssTEM('{$this->getElementClassSelector()}');
EOF;
        return parent::render();
    }

}
