<?php

namespace Database\Seeders;

use App\Models\Tariff;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevUsersSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('Test123');

        $tariffs = Tariff::all();
        $tariffIds = $tariffs->pluck('id')->toArray();

        $users = [
            [
                'login' => 'ivan_petrov',
                'name' => 'Иван Петров',
                'email' => 'ivan.petrov@mail.ru',
                'phone' => '+7-900-000-0001',
            ],
            [
                'login' => 'elena_smirnova',
                'name' => 'Елена Смирнова',
                'email' => 'elena.smirnova@yandex.ru',
                'phone' => '+7-900-000-0002',
            ],
            [
                'login' => 'alex_dubrov',
                'name' => 'Алексей Дубров',
                'email' => 'alex.dubrov@gmail.com',
                'phone' => '+7-900-000-0003',
            ],
            [
                'login' => 'olga_volkova',
                'name' => 'Ольга Волкова',
                'email' => 'olga.volkova@bk.ru',
                'phone' => '+7-900-000-0004',
            ],
            [
                'login' => 'dmitry_kozlov',
                'name' => 'Дмитрий Козлов',
                'email' => 'dmitry.kozlov@inbox.ru',
                'phone' => '+7-900-000-0005',
            ],
            [
                'login' => 'natalia_popova',
                'name' => 'Наталья Попова',
                'email' => 'natalia.popova@list.ru',
                'phone' => '+7-900-000-0006',
            ],
            [
                'login' => 'sergey_morozov',
                'name' => 'Сергей Морозов',
                'email' => 'sergey.morozov@mail.ru',
                'phone' => '+7-900-000-0007',
            ],
            [
                'login' => 'anna_belova',
                'name' => 'Анна Белова',
                'email' => 'anna.belova@gmail.com',
                'phone' => '+7-900-000-0008',
            ],
            [
                'login' => 'mikhail_sokolov',
                'name' => 'Михаил Соколов',
                'email' => 'mikhail.sokolov@yandex.ru',
                'phone' => '+7-900-000-0009',
            ],
            [
                'login' => 'tatyana_novikova',
                'name' => 'Татьяна Новикова',
                'email' => 'tatyana.novikova@bk.ru',
                'phone' => '+7-900-000-0010',
            ],
            [
                'login' => 'andrey_fedorov',
                'name' => 'Андрей Фёдоров',
                'email' => 'andrey.fedorov@mail.ru',
                'phone' => '+7-900-000-0011',
            ],
            [
                'login' => 'marina_zaiceva',
                'name' => 'Марина Зайцева',
                'email' => 'marina.zaiceva@inbox.ru',
                'phone' => '+7-900-000-0012',
            ],
            [
                'login' => 'pavel_romanov',
                'name' => 'Павел Романов',
                'email' => 'pavel.romanov@gmail.com',
                'phone' => '+7-900-000-0013',
            ],
            [
                'login' => 'svetlana_ivanova',
                'name' => 'Светлана Иванова',
                'email' => 'svetlana.ivanova@yandex.ru',
                'phone' => '+7-900-000-0014',
            ],
            [
                'login' => 'vladimir_orlov',
                'name' => 'Владимир Орлов',
                'email' => 'vladimir.orlov@list.ru',
                'phone' => '+7-900-000-0015',
            ],
            [
                'login' => 'irina_makarova',
                'name' => 'Ирина Макарова',
                'email' => 'irina.makarova@bk.ru',
                'phone' => '+7-900-000-0016',
            ],
            [
                'login' => 'maxim_kuznecov',
                'name' => 'Максим Кузнецов',
                'email' => 'maxim.kuznecov@mail.ru',
                'phone' => '+7-900-000-0017',
            ],
            [
                'login' => 'ekaterina_vasileva',
                'name' => 'Екатерина Васильева',
                'email' => 'ekaterina.vasileva@gmail.com',
                'phone' => '+7-900-000-0018',
            ],
            [
                'login' => 'denis_titov',
                'name' => 'Денис Титов',
                'email' => 'denis.titov@inbox.ru',
                'phone' => '+7-900-000-0019',
            ],
            [
                'login' => 'lubov_frolova',
                'name' => 'Любовь Фролова',
                'email' => 'lubov.frolova@yandex.ru',
                'phone' => '+7-900-000-0020',
            ],
        ];

        foreach ($users as $data) {
            $tariffId = $tariffIds[array_rand($tariffIds)];
            $tariff = $tariffs->firstWhere('id', $tariffId);

            $user = User::create([
                'login' => $data['login'],
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'email_verified_at' => now(),
                'password' => $defaultPassword,
                'tariff_id' => $tariffId,
                'max_gallery_images' => 100,
                'max_videos' => 10,
            ]);

            // Создаём транзакцию покупки тарифа
            Transaction::create([
                'user_id' => $user->id,
                'purchasable_type' => Tariff::class,
                'purchasable_id' => $tariffId,
                'amount' => $tariff->price,
                'currency' => 'RUB',
                'status' => 'completed',
                'metadata' => json_encode([
                    'created_by' => 'DevUsersSeeder',
                    'tariff_title' => $tariff->title,
                ]),
            ]);

            $this->command->info("Created user: {$data['login']} with tariff: {$tariff->title}");
        }
    }
}
