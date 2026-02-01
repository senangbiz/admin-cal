<?php

namespace App\Filament\Resources\OTPRequests;

use App\Filament\Resources\OTPRequests\Pages\EditOTPRequest;
use App\Filament\Resources\OTPRequests\Pages\ListOTPRequests;
use App\Filament\Resources\OTPRequests\Schemas\OTPRequestForm;
use App\Filament\Resources\OTPRequests\Tables\OTPRequestsTable;
use App\Models\Otp;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OTPRequestResource extends Resource
{
    protected static ?string $model = Otp::class;

    protected static ?string $navigationLabel = 'OTP Requests';

    protected static ?string $modelLabel = 'OTP Request';

    protected static ?string $pluralModelLabel = 'OTP Requests';

    protected static ?string $recordTitleAttribute = 'code';

    protected static string|\UnitEnum|null $navigationGroup = 'Auth';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedKey;

    public static function form(Schema $schema): Schema
    {
        return OTPRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OTPRequestsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListOTPRequests::route('/'),
            'edit' => EditOTPRequest::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
