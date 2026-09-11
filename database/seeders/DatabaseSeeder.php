<?php

namespace Database\Seeders;

use App\Models\Backsound;
use App\Models\Category;
use App\Models\Employee;
use App\Models\Nominee;
use App\Models\Setting;
use App\Models\User;
use App\Models\Winner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Superadmin User
        User::updateOrCreate(
            ['email' => 'admin@livasya.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('password123'),
                'role' => 'superadmin',
            ]
        );

        // 2. Default Event Settings
        $settings = [
            'event_title' => 'Livasya Excellence Awards 2026',
            'event_subtitle' => 'Malam Penganugerahan & Apresiasi Karyawan Berprestasi',
            'slide_duration' => '8',
            'suspense_duration' => '4',
            'reveal_duration' => '10',
            'auto_loop' => '1',
        ];

        foreach ($settings as $key => $val) {
            Setting::set($key, $val);
        }

        // 3. Generate Audio Samples (Pure 16-bit PCM WAV)
        Storage::disk('public')->makeDirectory('uploads/audio');
        Storage::disk('public')->makeDirectory('uploads/categories');
        Storage::disk('public')->makeDirectory('uploads/employees');

        $this->generateAudioSample('uploads/audio/general_ambient.wav', 'ambient', 8.0);
        $this->generateAudioSample('uploads/audio/nominee_loop.wav', 'rhythm', 6.0);
        $this->generateAudioSample('uploads/audio/winner_fanfare.wav', 'fanfare', 7.0);

        // 4. Backsound Database Records
        Backsound::updateOrCreate(
            ['file_path' => 'uploads/audio/general_ambient.wav'],
            [
                'title' => 'Gala Night Warm Ambient Chime',
                'context' => 'general',
                'category_id' => null,
                'is_active' => true,
            ]
        );

        Backsound::updateOrCreate(
            ['file_path' => 'uploads/audio/nominee_loop.wav'],
            [
                'title' => 'Nomination Stage Pulse',
                'context' => 'nominee_display',
                'category_id' => null,
                'is_active' => true,
            ]
        );

        Backsound::updateOrCreate(
            ['file_path' => 'uploads/audio/winner_fanfare.wav'],
            [
                'title' => 'Grand Winner Reveal Fanfare',
                'context' => 'winner_reveal',
                'category_id' => null,
                'is_active' => true,
            ]
        );

        // 5. Sample Categories
        $categoriesData = [
            [
                'name' => 'Best Employee of the Year',
                'slug' => 'best-employee-of-the-year',
                'description' => 'Penghargaan tertinggi bagi karyawan dengan dedikasi luar biasa, konsistensi performa, dan dampak signifikan bagi perusahaan.',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Rising Star Award',
                'slug' => 'rising-star-award',
                'description' => 'Apresiasi kepada talenta baru dengan adaptasi kilat, inisiatif tinggi, dan kontribusi gemilang dalam 1 tahun pertama.',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Innovation & Technology Leader',
                'slug' => 'innovation-technology-leader',
                'description' => 'Diberikan kepada inovator yang menghadirkan solusi teknologi mutakhir serta efisiensi proses bisnis tertinggi.',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Customer Care Champion',
                'slug' => 'customer-care-champion',
                'description' => 'Penghargaan untuk dedikasi tulus dalam memberikan pengalaman terbaik dan kepuasan pelanggan yang melampaui ekspektasi.',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $catData) {
            $categories[$catData['slug']] = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        // 6. Sample Employees
        $employeesData = [
            [
                'name' => 'Budi Santoso, S.Kom.',
                'position' => 'Principal Software Engineer',
                'department' => 'Technology & Engineering',
                'photo_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Siti Rahmawati, M.Ds.',
                'position' => 'Lead Product Designer',
                'department' => 'Product & Design',
                'photo_path' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Denny Pratama, S.E.',
                'position' => 'Customer Success Specialist',
                'department' => 'Operations & Support',
                'photo_path' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Amanda Putri, S.Ak.',
                'position' => 'Senior Financial Strategist',
                'department' => 'Finance & Strategy',
                'photo_path' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Hendra Wijaya, S.T.',
                'position' => 'Cloud Infrastructure Architect',
                'department' => 'Technology & Infrastructure',
                'photo_path' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Maya Anggraini, S.Psi.',
                'position' => 'Senior People Partner',
                'department' => 'Human Resources',
                'photo_path' => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
            ],
        ];

        $employees = [];
        foreach ($employeesData as $empData) {
            $employees[$empData['name']] = Employee::updateOrCreate(
                ['name' => $empData['name']],
                $empData
            );
        }

        // 7. Nominees Assignment
        $nomineesPlan = [
            'best-employee-of-the-year' => [
                ['name' => 'Budi Santoso, S.Kom.', 'desc' => 'Memimpin migrasi arsitektur sistem core dengan downtime 0% dan peningkatan performa 400%.', 'order' => 1, 'winner' => true],
                ['name' => 'Siti Rahmawati, M.Ds.', 'desc' => 'Merancang ulang antarmuka layanan sehingga skor kepuasan pengguna melonjak hingga 98.4%.', 'order' => 2, 'winner' => false],
                ['name' => 'Amanda Putri, S.Ak.', 'desc' => 'Menghadirkan efisiensi anggaran operasional tahunan sebesar 24% tanpa mengorbankan kualitas.', 'order' => 3, 'winner' => false],
            ],
            'rising-star-award' => [
                ['name' => 'Denny Pratama, S.E.', 'desc' => 'Menyelesaikan lebih dari 2.500 tiket resolusi pelanggan dengan tingkat kepuasan sempurna dalam 6 bulan.', 'order' => 1, 'winner' => true],
                ['name' => 'Maya Anggraini, S.Psi.', 'desc' => 'Menginisiasi program retensi talenta muda dengan peningkatan employee engagement sebesar 35%.', 'order' => 2, 'winner' => false],
            ],
            'innovation-technology-leader' => [
                ['name' => 'Hendra Wijaya, S.T.', 'desc' => 'Membangun pipeline automasi CI/CD zero-friction dan sistem monitoring berbasis AI preventif.', 'order' => 1, 'winner' => true],
                ['name' => 'Budi Santoso, S.Kom.', 'desc' => 'Mengembangkan framework micro-services modular yang diadopsi seluruh divisi teknologi.', 'order' => 2, 'winner' => false],
            ],
            'customer-care-champion' => [
                ['name' => 'Denny Pratama, S.E.', 'desc' => 'Dikenal memiliki empati luar biasa dan selalu memberikan solusi yang melebihi ekspektasi klien.', 'order' => 1, 'winner' => true],
                ['name' => 'Amanda Putri, S.Ak.', 'desc' => 'Mempercepat proses klaim dan rekonsiliasi vendor dari 5 hari kerja menjadi 2 jam.', 'order' => 2, 'winner' => false],
            ],
        ];

        foreach ($nomineesPlan as $categorySlug => $nomineeItems) {
            $cat = $categories[$categorySlug] ?? null;
            if (!$cat) continue;

            foreach ($nomineeItems as $item) {
                $emp = $employees[$item['name']] ?? null;
                if (!$emp) continue;

                $nominee = Nominee::updateOrCreate(
                    [
                        'category_id' => $cat->id,
                        'employee_id' => $emp->id,
                    ],
                    [
                        'description' => $item['desc'],
                        'order' => $item['order'],
                    ]
                );

                // Set winner if configured
                if ($item['winner']) {
                    Winner::updateOrCreate(
                        ['category_id' => $cat->id],
                        [
                            'nominee_id' => $nominee->id,
                            'announced_at' => now(),
                        ]
                    );
                }
            }
        }
    }

    /**
     * Synthesize clean, harmonious harmonic tone files in WAV format
     */
    protected function generateAudioSample(string $storageRelativePath, string $type, float $durationSeconds): void
    {
        $sampleRate = 22050; // 22.05kHz for light, fast-loading WAV
        $numSamples = (int) ($sampleRate * $durationSeconds);
        $data = '';

        for ($i = 0; $i < $numSamples; $i++) {
            $t = $i / $sampleRate;
            $sample = 0.0;

            if ($type === 'ambient') {
                // Gentle celestial chord: C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz), B4 (493.88Hz)
                $envelope = sin(pi() * ($i / $numSamples)); // Smooth fade in & out
                $sample += 0.25 * sin(2 * pi() * 261.63 * $t);
                $sample += 0.20 * sin(2 * pi() * 329.63 * $t);
                $sample += 0.20 * sin(2 * pi() * 392.00 * $t);
                $sample += 0.15 * sin(2 * pi() * 523.25 * $t);
                $sample *= $envelope;
            } elseif ($type === 'rhythm') {
                // Upbeat subtle pulse: alternating rhythmic arpeggio
                $beat = fmod($t * 2.0, 1.0);
                $envBeat = exp(-4.0 * $beat);
                $freq = 220.0 * (1 + 0.25 * floor(fmod($t * 4, 4)));
                $sample = 0.4 * sin(2 * pi() * $freq * $t) * $envBeat;
            } elseif ($type === 'fanfare') {
                // Celebratory ascending fanfare: D4 -> F#4 -> A4 -> D5 triumph
                $segment = (int) ($t * 2.5);
                $freqs = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00];
                $noteFreq = $freqs[min($segment, count($freqs) - 1)];
                $sample = 0.4 * sin(2 * pi() * $noteFreq * $t) + 0.2 * sin(2 * pi() * ($noteFreq * 2) * $t);
                if ($segment >= 3) {
                    // sustained celebration chord at the end
                    $sample += 0.25 * sin(2 * pi() * 440.00 * $t) + 0.25 * sin(2 * pi() * 587.33 * $t);
                }
            }

            // Clamp sample to [-1.0, 1.0]
            $sample = max(-1.0, min(1.0, $sample));
            $intSample = (int) ($sample * 32767);
            $data .= pack('v', $intSample); // 16-bit little endian
        }

        $dataSize = strlen($data);
        $header = 'RIFF';
        $header .= pack('V', 36 + $dataSize);
        $header .= 'WAVE';
        $header .= 'fmt ';
        $header .= pack('V', 16); // SubChunk1Size (16 for PCM)
        $header .= pack('v', 1);  // AudioFormat (1 for PCM)
        $header .= pack('v', 1);  // NumChannels (1 = Mono)
        $header .= pack('V', $sampleRate);
        $header .= pack('V', $sampleRate * 2); // ByteRate
        $header .= pack('v', 2);  // BlockAlign
        $header .= pack('v', 16); // BitsPerSample
        $header .= 'data';
        $header .= pack('V', $dataSize);

        Storage::disk('public')->put($storageRelativePath, $header . $data);
    }
}
