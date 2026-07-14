<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $password = env('CMS_ADMIN_PASSWORD');

        if (app()->isLocal() || filled($password)) {
            User::updateOrCreate(
                ['email' => env('CMS_ADMIN_EMAIL', 'admin@example.com')],
                [
                    'name' => env('CMS_ADMIN_NAME', 'Administrador IESNH'),
                    'password' => $password ?: 'password',
                    'is_admin' => true,
                ],
            );
        }

        $this->call(CarreraSeeder::class);
    }
}
