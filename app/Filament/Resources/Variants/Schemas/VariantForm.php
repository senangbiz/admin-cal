<?php

namespace App\Filament\Resources\Variants\Schemas;

use App\Models\Brand;
use App\Models\CarModel;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class VariantForm
{
    public static function configure(Schema $schema): Schema
    {



        return $schema
            ->components([

                Select::make('brand_id')
                    ->label('Brand')
                    ->required()
                    ->options(
                        Brand::query()
                            ->where('is_active', true)
                            ->pluck('name', 'id')
                    )
                    ->reactive()
                    ->afterStateUpdated(fn(callable $set) => $set('model_id', null))
                    ->dehydrated(false)
                    ->default(function ($record) {
                        return $record?->model?->brand_id;
                    })
                    ->columnSpan('full')
                    ->helperText('Select car brand'),

                Select::make('model_id')
                    ->label('Model')
                    ->required()
                    ->options(function (callable $get) {
                        $brandId = $get('brand_id');

                        if (! $brandId) {
                            return [];
                        }

                        return CarModel::query()
                            ->where('brand_id', $brandId)
                            ->where('is_active', true)
                            ->pluck('name', 'id');
                    })
                    ->disabled(fn(callable $get) => ! $get('brand_id'))
                    ->reactive()
                    ->columnSpan('full')
                    ->helperText('Select car model'),


                TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->directory('variants')
                    ->imagePreviewHeight('200')
                    ->maxSize(2048)
                    ->nullable(),

                Textarea::make('description')
                    ->rows(4)
                    ->columnSpan('full')
                    ->nullable(),

                TextInput::make('price')
                    ->numeric()
                    ->prefix('RM')
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function (callable $set, callable $get) {
                        self::calculateDiscount($set, $get);
                    }),

                // 🔻 Discount Section
                Select::make('discount_type')
                    ->options([
                        'percentage' => 'Percentage (%)',
                        'fixed' => 'Fixed Amount (RM)',
                    ])
                    ->reactive()
                    ->afterStateUpdated(function (callable $set, callable $get) {
                        self::calculateDiscount($set, $get);
                    })
                    ->nullable(),

                TextInput::make('discount_value')
                    ->numeric()
                    ->prefix(
                        fn(callable $get) =>
                        $get('discount_type') === 'percentage' ? '%' : 'RM'
                    )
                    ->visible(fn(callable $get) => filled($get('discount_type')))
                    ->reactive()
                    ->afterStateUpdated(function (callable $set, callable $get) {
                        self::calculateDiscount($set, $get);
                    })
                    ->nullable(),

                TextInput::make('discount_price')
                    ->numeric()
                    ->prefix('RM')
                    ->disabled()
                    ->dehydrated()
                    ->helperText('Auto-calculated after discount')
                    ->nullable(),

                TextInput::make('discount_percentage')
                    ->numeric()
                    ->suffix('%')
                    ->disabled()
                    ->dehydrated()
                    ->nullable(),

                DatePicker::make('discount_start_date')
                    ->visible(fn(callable $get) => filled($get('discount_type')))
                    ->nullable(),

                DatePicker::make('discount_end_date')
                    ->visible(fn(callable $get) => filled($get('discount_type')))
                    ->nullable(),

                TextInput::make('discount_code')
                    ->maxLength(50)
                    ->nullable(),

                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->columnSpan('full')
                    ->helperText('Whether the variant is active'),



            ]);
    }

    protected static function calculateDiscount(callable $set, callable $get): void
    {
        $price = (float) ($get('price') ?? 0);
        $discountType = $get('discount_type');
        $discountValue = (float) ($get('discount_value') ?? 0);

        if (!$price || !$discountType || !$discountValue) {
            $set('discount_price', null);
            $set('discount_percentage', null);
            return;
        }

        if ($discountType === 'percentage') {
            // Calculate discount price: price - (price * discount_value / 100)
            $discountPrice = $price - ($price * $discountValue / 100);
            $set('discount_price', number_format($discountPrice, 2, '.', ''));
            $set('discount_percentage', number_format($discountValue, 2, '.', ''));
        } elseif ($discountType === 'fixed') {
            // Calculate discount price: price - discount_value
            $discountPrice = $price - $discountValue;
            // Calculate discount percentage: (discount_value / price) * 100
            $discountPercentage = ($discountValue / $price) * 100;
            $set('discount_price', number_format($discountPrice, 2, '.', ''));
            $set('discount_percentage', number_format($discountPercentage, 2, '.', ''));
        }
    }
}
