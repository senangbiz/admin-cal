<?php

namespace App\Filament\Resources\Agents\Pages;

use App\Filament\Resources\Agents\AgentResource;
use App\Models\Role;
use App\Models\User;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateAgent extends CreateRecord
{
    protected static string $resource = AgentResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // If create_new_user toggle is enabled, create a new user
        if (!empty($data['create_new_user']) && $data['create_new_user']) {
            // Get the agent role
            $agentRole = Role::where('slug', 'agent')->first();
            if (!$agentRole) {
                // Create agent role if it doesn't exist
                $agentRole = Role::create([
                    'name' => 'Agent',
                    'slug' => 'agent',
                    'description' => 'Agent account',
                    'is_active' => true,
                ]);
            }

            // Create the new user
            $user = User::create([
                'name' => $data['new_user_name'],
                'email' => $data['new_user_email'],
                'password' => Hash::make($data['new_user_password']),
                'role_id' => $agentRole->id,
            ]);

            // Set the user_id for the agent
            $data['user_id'] = $user->id;
        }

        // Remove temporary fields
        unset($data['create_new_user'], $data['new_user_name'], $data['new_user_email'], $data['new_user_password']);

        return $data;
    }
}
