<?php

namespace App\Filament\Resources\Roles\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RoleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Role Information')
                    ->description('Define the role name, slug, and description')
                    ->columns(2)
                    ->columnSpan('full')
                    ->schema([
                        TextInput::make('name')
                            ->label('Role Name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(1)
                            ->helperText('Display name for the role (e.g., Administrator)'),

                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->columnSpan(1)
                            ->helperText('Unique identifier for the role (e.g., admin, agent, user)')
                            ->placeholder('admin'),

                        Textarea::make('description')
                            ->label('Description')
                            ->rows(3)
                            ->maxLength(500)
                            ->columnSpan('full')
                            ->helperText('Brief description of what this role can do')
                            ->nullable(),

                        Toggle::make('is_active')
                            ->label('Active Status')
                            ->required()
                            ->default(true)
                            ->columnSpan(1)
                            ->helperText('Whether this role is currently active and can be assigned'),
                    ]),
            ]);
    }
}
