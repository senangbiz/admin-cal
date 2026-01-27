<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function model()
    {
        return $this->belongsTo(CarModel::class, 'model_id');
    }
}
