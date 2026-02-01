<?php

namespace App\Filament\Resources\Brands\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BrandForm
{
    public static function configure(Schema $schema): Schema
    {
        // name
        // logo
        // description
        // is_active
        return $schema
            ->components([


                FileUpload::make('logo')
                    ->label('Logo')
                    ->required()
                    ->disk('public')
                    ->directory('brands')
                    ->maxFiles(1)
                    ->maxSize(1024)
                    ->columnSpan('full')
                    ->helperText('The logo of the brand (stored in public storage so it can be shown on the agent loan calculator).'),
                    
                TextInput::make('name')
                    ->label('Name')
                    ->required()
                    ->maxLength(255)
                    ->columnSpan('full')
                    ->helperText('The name of the brand'),

                Textarea::make('description')
                    ->label('Description')
                    ->required()
                    ->maxLength(255)
                    ->columnSpan('full')
                    ->helperText('The description of the brand'),

                Toggle::make('is_active')
                    ->label('Is Active')
                    ->required()
                    ->default(true)
                    ->columnSpan('full')
                    ->helperText('Whether the brand is active'),
            ]);
    }
}
