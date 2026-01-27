<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\Role;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Information')
                    ->description('Basic user account details')
                    ->columns(2)
                    ->columnSpan('full')
                    ->schema([
                        TextInput::make('name')
                            ->label('Name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(1),

                        TextInput::make('email')
                            ->label('Email Address')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->columnSpan(1),

                        TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->required(fn ($livewire) => $livewire instanceof \App\Filament\Resources\Users\Pages\CreateUser)
                            ->dehydrated(fn ($state) => filled($state))
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->minLength(8)
                            ->columnSpan(1)
                            ->helperText('Leave blank to keep current password when editing'),

                        Select::make('role_id')
                            ->label('Role')
                            ->relationship('role', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->columnSpan(1)
                            ->helperText('Select the user role'),

                        DateTimePicker::make('email_verified_at')
                            ->label('Email Verified At')
                            ->columnSpan('full')
                            ->nullable(),
                    ]),
            ]);
    }
}
