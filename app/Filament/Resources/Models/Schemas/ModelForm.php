<?php

namespace App\Filament\Resources\Models\Schemas;

use App\Models\Brand;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ModelForm
{
    public static function configure(Schema $schema): Schema
    {
        //     brand_id
        //     name
        //     image
        //     description
        //     is_active
        return $schema
            ->components([


                Section::make('Model Details')
                    ->description('The details of the model')
                    ->columns(3)
                    ->columnSpan('full')
                    ->schema([
                        Select::make('brand_id')
                            ->label('Brand')
                            ->required()
                            ->options(Brand::all()->pluck('name', 'id'))
                            ->columnSpan('full')
                            ->helperText('The brand of the model'),

                        TextInput::make('name')
                            ->label('Name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan('full')
                            ->helperText('The name of the model'),

                        FileUpload::make('image')
                            ->label('Image')
                            ->required()
                            ->maxFiles(1)
                            ->maxSize(1024)
                            ->columnSpan('full')
                            ->helperText('The image of the model'),

                        Textarea::make('description')
                            ->label('Description')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan('full')
                            ->helperText('The description of the model'),

                        Toggle::make('is_active')
                            ->label('Is Active')
                            ->required()
                            ->default(true)
                            ->columnSpan('full')
                            ->helperText('Whether the model is active'),
                    ])
            ]);
    }
}
