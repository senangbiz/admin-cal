<?php

namespace App\Filament\Resources\Variants\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;

class VariantsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('model.name')
                    ->label('Model')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('model.brand.name')
                    ->label('Brand')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('price')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('discount_price')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('discount_percentage')
                    ->suffix('%')
                    ->sortable(),
                ToggleColumn::make('is_active'),
            ])
            ->filters([
                //
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
