<?php

namespace App\Filament\Resources\OTPRequests\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OTPRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => str_replace('_', ' ', ucfirst($state)))
                    ->color(fn (string $state): string => match ($state) {
                        'email_verification' => 'info',
                        'password_reset' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('code')
                    ->label('Code')
                    ->fontFamily('mono')
                    ->copyable()
                    ->searchable(),
                TextColumn::make('expires_at')
                    ->label('Expires')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('used_at')
                    ->label('Used')
                    ->dateTime()
                    ->placeholder('—')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->getStateUsing(fn ($record) => $record->used_at
                        ? 'used'
                        : ($record->expires_at->isPast() ? 'expired' : 'valid'))
                    ->color(fn (string $state): string => match ($state) {
                        'valid' => 'success',
                        'used' => 'gray',
                        'expired' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'email_verification' => 'Email verification',
                        'password_reset' => 'Password reset',
                    ]),
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'valid' => 'Valid',
                        'used' => 'Used',
                        'expired' => 'Expired',
                    ])
                    ->query(function ($query, array $data) {
                        $value = $data['value'] ?? null;
                        if (! $value) {
                            return $query;
                        }
                        return match ($value) {
                            'valid' => $query->whereNull('used_at')->where('expires_at', '>', now()),
                            'used' => $query->whereNotNull('used_at'),
                            'expired' => $query->whereNull('used_at')->where('expires_at', '<=', now()),
                            default => $query,
                        };
                    }),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
