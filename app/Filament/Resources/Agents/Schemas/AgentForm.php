<?php

namespace App\Filament\Resources\Agents\Schemas;

use App\Models\Role;
use App\Models\User;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class AgentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Information')
                    ->description('Select an existing user or create a new user account for this agent')
                    ->columns(2)
                    ->columnSpan('full')
                    ->schema([
                        Toggle::make('create_new_user')
                            ->label('Create New User')
                            ->default(false)
                            ->reactive()
                            ->dehydrated(false)
                            ->visible(fn ($livewire) => $livewire instanceof \App\Filament\Resources\Agents\Pages\CreateAgent)
                            ->columnSpan('full')
                            ->helperText('Toggle to create a new user account instead of selecting an existing one'),

                        Select::make('user_id')
                            ->label('Select User')
                            ->relationship('user', 'name')
                            ->getOptionLabelFromRecordUsing(fn (User $record): string => "{$record->name} ({$record->email})")
                            ->searchable(['name', 'email'])
                            ->preload()
                            ->required(fn (callable $get) => !$get('create_new_user'))
                            ->visible(fn (callable $get) => !$get('create_new_user'))
                            ->dehydrated(fn (callable $get) => !$get('create_new_user'))
                            ->columnSpan('full')
                            ->helperText('Select an existing user account'),

                        TextInput::make('new_user_name')
                            ->label('Name')
                            ->required(fn (callable $get) => $get('create_new_user'))
                            ->maxLength(255)
                            ->visible(fn (callable $get) => $get('create_new_user'))
                            ->dehydrated(fn (callable $get) => $get('create_new_user'))
                            ->columnSpan(1)
                            ->reactive(),

                        TextInput::make('new_user_email')
                            ->label('Email')
                            ->email()
                            ->required(fn (callable $get) => $get('create_new_user'))
                            ->maxLength(255)
                            ->unique(User::class, 'email', ignoreRecord: true)
                            ->visible(fn (callable $get) => $get('create_new_user'))
                            ->dehydrated(fn (callable $get) => $get('create_new_user'))
                            ->columnSpan(1)
                            ->reactive(),

                        TextInput::make('new_user_password')
                            ->label('Password')
                            ->password()
                            ->required(fn (callable $get) => $get('create_new_user'))
                            ->minLength(8)
                            ->visible(fn (callable $get) => $get('create_new_user'))
                            ->dehydrated(fn (callable $get) => $get('create_new_user'))
                            ->columnSpan('full')
                            ->helperText('Minimum 8 characters')
                            ->reactive(),
                    ]),

                Section::make('Contact Information')
                    ->description('Agent contact details and location')
                    ->columns(2)
                    ->columnSpan('full')
                    ->schema([
                        TextInput::make('phone')
                            ->label('Phone Number')
                            ->tel()
                            ->maxLength(20)
                            ->columnSpan(1)
                            ->helperText('Contact phone number for the agent (e.g., +60123456789)')
                            ->prefixIcon('heroicon-o-phone')
                            ->placeholder('+60123456789'),

                        FileUpload::make('profile_photo')
                            ->label('Profile Photo')
                            ->image()
                            ->directory('agents/profile-photos')
                            ->imagePreviewHeight('150')
                            ->maxSize(2048)
                            ->maxFiles(1)
                            ->columnSpan(1)
                            ->helperText('Upload agent profile photo (max 2MB)')
                            ->nullable(),

                        Textarea::make('showroom_location')
                            ->label('Showroom Location')
                            ->rows(3)
                            ->maxLength(500)
                            ->columnSpan('full')
                            ->helperText('Full address of the showroom location')
                            ->nullable(),
                    ]),

                Section::make('Coverage Areas')
                    ->description('Areas where this agent provides service')
                    ->columnSpan('full')
                    ->schema([
                        Repeater::make('coverage_areas')
                            ->label('Coverage Areas')
                            ->schema([
                                TextInput::make('area')
                                    ->label('Area Name')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('e.g., Kuala Lumpur'),
                            ])
                            ->defaultItems(0)
                            ->addActionLabel('Add Coverage Area')
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['area'] ?? null)
                            ->columnSpan('full')
                            ->helperText('Add all areas where this agent provides service. Click "Add Coverage Area" to add more.')
                            ->reorderable()
                            ->cloneable(),
                    ]),

                Section::make('Settings')
                    ->description('Agent status and QR code')
                    ->columns(2)
                    ->columnSpan('full')
                    ->schema([
                        Toggle::make('is_active')
                            ->label('Active Status')
                            ->required()
                            ->default(true)
                            ->columnSpan(1)
                            ->helperText('Whether this agent is currently active'),

                        TextInput::make('qr_code')
                            ->label('QR Code')
                            ->disabled()
                            ->dehydrated()
                            ->columnSpan(1)
                            ->helperText('QR code will be generated automatically')
                            ->visible(fn ($record) => $record !== null),
                    ]),
            ]);
    }
}
