<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarModel extends Model
{

    protected $table = 'models';
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function variants()
    {
        return $this->hasMany(Variant::class, 'model_id');
    }
}
