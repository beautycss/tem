<?php

namespace Beautycss\Tem;

use Encore\Admin\Admin;
use Encore\Admin\Form;
use Illuminate\Support\ServiceProvider;

class TemServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot(Tem $extension)
    {
        if (! Tem::boot()) {
            return ;
        }

        if ($views = $extension->views()) {
            $this->loadViewsFrom($views, 'tem');
        }

        if ($this->app->runningInConsole() && $assets = $extension->assets()) {
            $this->publishes(
                [$assets => public_path('vendor/beautycss/tem')],
                'tem'
            );
        }

        Admin::booting(function () {
            Form::extend('tem', TemField::class);
        });
    }
}
