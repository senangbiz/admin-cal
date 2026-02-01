<?php

namespace App\Filament\Resources\OTPRequests\Pages;

use App\Filament\Resources\OTPRequests\OTPRequestResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOTPRequest extends CreateRecord
{
    protected static string $resource = OTPRequestResource::class;
}
