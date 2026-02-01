<?php

namespace App\Filament\Resources\OTPRequests\Pages;

use App\Filament\Resources\OTPRequests\OTPRequestResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditOTPRequest extends EditRecord
{
    protected static string $resource = OTPRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
