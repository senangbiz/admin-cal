<?php

namespace App\Filament\Resources\OTPRequests\Pages;

use App\Filament\Resources\OTPRequests\OTPRequestResource;
use Filament\Resources\Pages\ListRecords;

class ListOTPRequests extends ListRecords
{
    protected static string $resource = OTPRequestResource::class;
}
