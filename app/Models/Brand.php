<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $guarded = [ 'id' , 'created_at' , 'updated_at' ];

    public function models()
    {
        return $this->hasMany(Model::class);
    }
}
