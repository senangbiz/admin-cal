<?php

namespace App\Filament\Resources\Models\Tables;

use App\Models\Brand;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ModelsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('brand.name')->searchable(),
                ToggleColumn::make('is_active'),
            ])
            ->filters([
                SelectFilter::make('brand_id')
                    ->label('Brand')
                    ->options(Brand::all()->pluck('name', 'id'))
                    ->searchable(),

                SelectFilter::make('is_active')
                    ->label('Is Active')
                    ->options([
                        'true' => 'True',
                        'false' => 'False',
                    ])
                    ->searchable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
