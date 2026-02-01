<?php

namespace App\Filament\Resources\OTPRequests\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OTPRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('OTP Details')
                    ->description('Verification code and usage')
                    ->schema([
                        Placeholder::make('user_email')
                            ->label('User')
                            ->content(fn ($record) => $record?->user?->name.' ('.$record?->user?->email.')'),
                        TextInput::make('type')
                            ->label('Type')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('code')
                            ->label('Code')
                            ->disabled()
                            ->dehydrated(false)
                            ->prefix('')
                            ->extraInputAttributes(['class' => 'font-mono']),
                        DateTimePicker::make('expires_at')
                            ->label('Expires at')
                            ->disabled()
                            ->dehydrated(false),
                        DateTimePicker::make('used_at')
                            ->label('Used at')
                            ->disabled()
                            ->dehydrated(false)
                            ->placeholder('Not used'),
                    ]),
            ]);
    }
}
