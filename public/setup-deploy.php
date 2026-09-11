<?php
/**
 * =========================================================================
 * RSU LIVASYA AWARDS - CYBERPANEL / VPS AUTOMATED WEB DEPLOYER
 * =========================================================================
 * Script ini dirancang untuk memudahkan proses instalasi, pembaruan,
 * dan eksekusi perintah terminal (Git, Artisan, Composer, NPM, Permissions)
 * langsung dari antarmuka web browser tanpa harus membuka SSH terminal.
 *
 * Keamanan:
 * Dilindungi kunci rahasia (Secret Key). Ubah SECRET_KEY di bawah sesuai selera.
 */

session_start();

// -------------------------------------------------------------------------
// KONFIGURASI KEAMANAN (UBAH KUNCI RAHASIA INI JIKA DIINGINKAN)
// -------------------------------------------------------------------------
define('SECRET_KEY', 'livasya2026');

// Tentukan direktori root Laravel (satu tingkat di atas /public jika file ada di /public, atau __DIR__ jika di root)
$isPublicDir = basename(__DIR__) === 'public';
$baseDir = $isPublicDir ? dirname(__DIR__) : __DIR__;

// Cek autentikasi
$isAuthenticated = false;
if (isset($_SESSION['deploy_auth']) && $_SESSION['deploy_auth'] === true) {
    $isAuthenticated = true;
} elseif (isset($_GET['key']) && $_GET['key'] === SECRET_KEY) {
    $_SESSION['deploy_auth'] = true;
    $isAuthenticated = true;
} elseif (isset($_POST['password']) && $_POST['password'] === SECRET_KEY) {
    $_SESSION['deploy_auth'] = true;
    $isAuthenticated = true;
}

// Tindakan Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION['deploy_auth'] = false;
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

// -------------------------------------------------------------------------
// FUNGSI EKSEKUTOR PERINTAH TERMINAL
// -------------------------------------------------------------------------
function executeCommand($cmd, $workingDir) {
    $output = "";
    $output .= "<div class='cmd-header'>$ cd " . htmlspecialchars($workingDir) . "</div>";
    $output .= "<div class='cmd-run'>$ " . htmlspecialchars($cmd) . "</div>\n";

    // Set environment path agar composer, php, git, npm dapat ditemukan
    putenv('COMPOSER_HOME=' . sys_get_temp_dir());
    $path = getenv('PATH');
    $additionalPaths = [
        '/usr/local/bin',
        '/usr/bin',
        '/bin',
        '/usr/local/games',
        '/usr/games',
        '/usr/local/lsws/lsphp82/bin',
        '/usr/local/lsws/lsphp83/bin',
        '/usr/local/lsws/lsphp81/bin',
        '/opt/cpanel/ea-php82/root/usr/bin',
        '/opt/cpanel/ea-php83/root/usr/bin',
        '/home/' . get_current_user() . '/.nvm/versions/node/v*/bin',
        '/root/.nvm/versions/node/v*/bin',
    ];
    putenv('PATH=' . $path . ':' . implode(':', $additionalPaths));

    if (function_exists('proc_open')) {
        $descriptors = [
            0 => ["pipe", "r"], // stdin
            1 => ["pipe", "w"], // stdout
            2 => ["pipe", "w"]  // stderr
        ];

        $process = proc_open($cmd . ' 2>&1', $descriptors, $pipes, $workingDir);

        if (is_resource($process)) {
            fclose($pipes[0]);
            while ($line = fgets($pipes[1])) {
                $output .= htmlspecialchars($line);
            }
            fclose($pipes[1]);
            fclose($pipes[2]);
            $returnCode = proc_close($process);
            $output .= "\n<div class='cmd-exit " . ($returnCode === 0 ? 'exit-ok' : 'exit-err') . "'>[Process exited with code: {$returnCode}]</div>\n";
        } else {
            $output .= "<span class='text-danger'>Gagal membuka proses via proc_open()!</span>\n";
        }
    } elseif (function_exists('shell_exec')) {
        $result = shell_exec("cd " . escapeshellarg($workingDir) . " && " . $cmd . " 2>&1");
        $output .= htmlspecialchars($result ?: "(Tidak ada output)");
    } else {
        $output .= "<span class='text-danger'>Fungsi proc_open() dan shell_exec() dinonaktifkan di php.ini server Anda!</span>\n";
    }

    return $output;
}

// -------------------------------------------------------------------------
// PROSES AKSI TERMINAL VIA AJAX / FORM POST
// -------------------------------------------------------------------------
$activeAction = $_POST['action'] ?? null;
$commandOutput = "";

if ($isAuthenticated && $activeAction) {
    switch ($activeAction) {
        case 'full_deploy':
            $commandOutput .= "<h4 class='text-gold'>🚀 MEMULAI DEPLOYMENT OTOMATIS PENUH</h4>";
            
            // 0. Fix permissions first so artisan can write logs/caches without Permission Denied
            if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
                $commandOutput .= executeCommand('chmod -R 775 storage bootstrap/cache && chmod -R 777 storage/logs storage/framework 2>/dev/null || true', $baseDir);
            }

            // 1. Delete cached config & routes so new .env is immediately loaded by Artisan
            @unlink($baseDir . '/bootstrap/cache/config.php');
            @unlink($baseDir . '/bootstrap/cache/routes-v7.php');
            @unlink($baseDir . '/bootstrap/cache/packages.php');
            @unlink($baseDir . '/bootstrap/cache/services.php');
            $commandOutput .= "<div class='text-gold'>🧹 Cache konfigurasi lama dibersihkan agar membaca .env terbaru.</div>\n";

            // 2. Git pull
            if (is_dir($baseDir . '/.git')) {
                $commandOutput .= executeCommand('git fetch --all && git reset --hard origin/main && git pull origin main', $baseDir);
            }

            // 3. Auto-Ensure APP_KEY
            $envPath = $baseDir . '/.env';
            if (file_exists($envPath)) {
                $content = file_get_contents($envPath);
                if (!preg_match('/^APP_KEY=base64:[A-Za-z0-9+\/=]{20,}/m', $content)) {
                    $generatedKey = 'base64:' . base64_encode(random_bytes(32));
                    if (preg_match('/^APP_KEY=/m', $content)) {
                        $content = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY=' . $generatedKey, $content);
                    } else {
                        $content = "APP_KEY={$generatedKey}\n" . $content;
                    }
                    file_put_contents($envPath, $content);
                    $commandOutput .= "<div class='text-success'>🔑 APP_KEY otomatis dibuat di .env: <code>{$generatedKey}</code></div>\n";
                }
            }

            // 4. Storage link
            $commandOutput .= executeCommand('php artisan storage:link', $baseDir);
            
            // 5. Migrate database
            $commandOutput .= executeCommand('php artisan migrate --force', $baseDir);

            // 6. Seed database (Initial admin, default settings, etc.)
            $commandOutput .= executeCommand('php artisan db:seed --force', $baseDir);
            
            // 7. Clear & Optimize
            $commandOutput .= executeCommand('php artisan optimize:clear', $baseDir);
            
            $commandOutput .= "<h4 class='text-success'>🎉 DEPLOYMENT PENUH SELESAI DENGAN SUKSES! Silakan refresh web Anda.</h4>";
            break;

        case 'git_pull':
            $commandOutput .= executeCommand('git fetch --all && git pull origin main', $baseDir);
            break;

        case 'storage_link':
            $commandOutput .= executeCommand('php artisan storage:link', $baseDir);
            break;

        case 'migrate':
            $commandOutput .= executeCommand('php artisan migrate --force', $baseDir);
            break;

        case 'seed':
            $commandOutput .= executeCommand('php artisan db:seed --force', $baseDir);
            break;

        case 'cache_clear':
            $commandOutput .= executeCommand('php artisan optimize:clear', $baseDir);
            $commandOutput .= executeCommand('php artisan config:cache', $baseDir);
            $commandOutput .= executeCommand('php artisan route:cache', $baseDir);
            $commandOutput .= executeCommand('php artisan view:cache', $baseDir);
            break;

        case 'composer_install':
            $commandOutput .= executeCommand('composer install --no-dev --optimize-autoloader', $baseDir);
            break;

        case 'npm_build':
            $commandOutput .= executeCommand('npm run build', $baseDir);
            break;

        case 'key_generate':
            $envPath = $baseDir . '/.env';
            if (!file_exists($envPath)) {
                if (file_exists($baseDir . '/.env.example')) {
                    copy($baseDir . '/.env.example', $envPath);
                    $commandOutput .= "<div class='text-gold'>File .env dibuat otomatis dari .env.example.</div>\n";
                } else {
                    file_put_contents($envPath, "APP_NAME=\"RSU Livasya Awards\"\nAPP_ENV=production\nAPP_KEY=\nAPP_DEBUG=false\nAPP_URL=https://" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\n");
                    $commandOutput .= "<div class='text-gold'>File .env dasar berhasil dibuat.</div>\n";
                }
            }

            $content = file_get_contents($envPath);
            if (!preg_match('/^APP_KEY=/m', $content)) {
                $content = "APP_KEY=\n" . $content;
                file_put_contents($envPath, $content);
                $commandOutput .= "<div class='text-success'>✅ Variabel APP_KEY= berhasil ditambahkan otomatis ke dalam file .env!</div>\n";
            }

            $commandOutput .= executeCommand('php artisan key:generate --force', $baseDir);

            // Verifikasi apakah key benar-benar terisi, jika artisan gagal inject manual
            $refreshed = file_get_contents($envPath);
            if (!preg_match('/^APP_KEY=base64:[A-Za-z0-9+\/=]{20,}/m', $refreshed)) {
                $generatedKey = 'base64:' . base64_encode(random_bytes(32));
                $refreshed = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY=' . $generatedKey, $refreshed);
                file_put_contents($envPath, $refreshed);
                $commandOutput .= "<div class='text-success'>🎉 APP_KEY berhasil di-generate secara otomatis: <code>{$generatedKey}</code></div>\n";
            }
            break;

        case 'apply_prod_env':
            $envPath = $baseDir . '/.env';
            $prodEnv = "APP_NAME=\"RSU Livasya Awards\"\n" .
                "APP_ENV=production\n" .
                "APP_KEY=base64:0UVyB1d6RYVyiALlhTjG4bRgCcqKWuJ1NH/S6dLANVE=\n" .
                "APP_DEBUG=false\n" .
                "APP_URL=https://livasya-award.frahesta.com\n\n" .
                "APP_LOCALE=id\n" .
                "APP_FALLBACK_LOCALE=en\n" .
                "APP_FAKER_LOCALE=id_ID\n\n" .
                "BCRYPT_ROUNDS=12\n\n" .
                "LOG_CHANNEL=stack\n" .
                "LOG_STACK=single\n" .
                "LOG_DEPRECATIONS_CHANNEL=null\n" .
                "LOG_LEVEL=error\n\n" .
                "DB_CONNECTION=mysql\n" .
                "DB_HOST=127.0.0.1\n" .
                "DB_PORT=3306\n" .
                "DB_DATABASE=liva_awarddb\n" .
                "DB_USERNAME=liva_awarddb\n" .
                "DB_PASSWORD=tfrahesta\n\n" .
                "SESSION_DRIVER=database\n" .
                "SESSION_LIFETIME=120\n" .
                "SESSION_ENCRYPT=false\n" .
                "SESSION_PATH=/\n" .
                "SESSION_DOMAIN=null\n\n" .
                "BROADCAST_CONNECTION=log\n" .
                "FILESYSTEM_DISK=public\n" .
                "QUEUE_CONNECTION=database\n\n" .
                "CACHE_STORE=database\n" .
                "CACHE_PREFIX=livasya_award_cache_\n\n" .
                "MEMCACHED_HOST=127.0.0.1\n\n" .
                "REDIS_CLIENT=phpredis\n" .
                "REDIS_HOST=127.0.0.1\n" .
                "REDIS_PASSWORD=null\n" .
                "REDIS_PORT=6379\n\n" .
                "MAIL_MAILER=log\n" .
                "MAIL_HOST=127.0.0.1\n" .
                "MAIL_PORT=2525\n" .
                "MAIL_USERNAME=null\n" .
                "MAIL_PASSWORD=null\n" .
                "MAIL_ENCRYPTION=null\n" .
                "MAIL_FROM_ADDRESS=\"no-reply@livasya-award.frahesta.com\"\n" .
                "MAIL_FROM_NAME=\"\${APP_NAME}\"\n\n" .
                "VITE_APP_NAME=\"\${APP_NAME}\"\n";
            file_put_contents($envPath, $prodEnv);
            $commandOutput .= "<h4 class='text-success'>✅ Konfigurasi .env Produksi Berhasil Diterapkan ke livasya-award.frahesta.com!</h4>\n";
            $commandOutput .= "<div style='font-size:12px;color:#cbd5e1;'>DB: <b>liva_awarddb</b> | User: <b>liva_awarddb</b> | URL: <b>https://livasya-award.frahesta.com</b></div>\n";
            break;

        case 'copy_env':
            if (!file_exists($baseDir . '/.env') && file_exists($baseDir . '/.env.example')) {
                copy($baseDir . '/.env.example', $baseDir . '/.env');
                $commandOutput .= "<h4 class='text-success'>✅ Berhasil menyalin .env.example menjadi .env!</h4>\n";
            } elseif (file_exists($baseDir . '/.env')) {
                $commandOutput .= "<h4 class='text-gold'>ℹ️ File .env sudah ada. Tidak ditimpa.</h4>\n";
            } else {
                $commandOutput .= "<h4 class='text-danger'>❌ File .env.example tidak ditemukan!</h4>\n";
            }
            break;

        case 'toggle_debug':
            $envPath = $baseDir . '/.env';
            if (file_exists($envPath)) {
                $content = file_get_contents($envPath);
                if (preg_match('/APP_DEBUG=true/i', $content)) {
                    $content = preg_replace('/APP_DEBUG=true/i', 'APP_DEBUG=false', $content);
                    file_put_contents($envPath, $content);
                    $commandOutput .= "<h4 class='text-warning'>🔧 APP_DEBUG diubah menjadi: FALSE (Mode Produksi Aman)</h4>\n";
                } else {
                    $content = preg_replace('/APP_DEBUG=false/i', 'APP_DEBUG=true', $content);
                    file_put_contents($envPath, $content);
                    $commandOutput .= "<h4 class='text-success'>🐞 APP_DEBUG diubah menjadi: TRUE (Mode Debug Aktif)!</h4>\n<p style='font-size:12px;color:#cbd5e1;'>Silakan refresh halaman website Anda sekarang. Pesan error 500 akan berganti menjadi penjelasan error detail lengkap dengan nomor baris.</p>\n";
                }
            } else {
                $commandOutput .= "<h4 class='text-danger'>❌ File .env belum dibuat! Buat atau salin dari .env.example terlebih dahulu.</h4>\n";
            }
            break;

        case 'view_log':
            $logPath = $baseDir . '/storage/logs/laravel.log';
            if (file_exists($logPath)) {
                $lines = file($logPath);
                $totalLines = count($lines);
                $slice = array_slice($lines, max(0, $totalLines - 120));
                $commandOutput .= "<h4 class='text-gold'>📜 120 Baris Terakhir dari storage/logs/laravel.log:</h4>\n";
                $commandOutput .= "<div style='font-size:11px;line-height:1.5;color:#f87171;background:rgba(0,0,0,0.6);padding:12px;border-radius:8px;max-height:400px;overflow-y:auto;'>" . htmlspecialchars(implode('', $slice)) . "</div>\n";
            } else {
                $commandOutput .= "<h4 class='text-warning'>ℹ️ File log storage/logs/laravel.log belum ada atau belum ada error yang tercatat di log.</h4>\n";
            }
            break;

        case 'test_db':
            $envPath = $baseDir . '/.env';
            if (file_exists($envPath)) {
                $envVars = @parse_ini_file($envPath);
                $dbHost = $envVars['DB_HOST'] ?? '127.0.0.1';
                $dbPort = $envVars['DB_PORT'] ?? '3306';
                $dbName = $envVars['DB_DATABASE'] ?? '';
                $dbUser = $envVars['DB_USERNAME'] ?? '';
                $dbPass = $envVars['DB_PASSWORD'] ?? '';

                $commandOutput .= "<h4 class='text-info'>🔌 Menguji Koneksi Database MySQL...</h4>";
                $commandOutput .= "<div style='font-size:12px;color:#94a3b8;margin-bottom:8px;'>Host: <b>$dbHost:$dbPort</b> | DB: <b>$dbName</b> | User: <b>$dbUser</b></div>";
                try {
                    $pdo = new PDO("mysql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPass, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_TIMEOUT => 5
                    ]);
                    $commandOutput .= "<div class='text-success' style='font-size:14px;font-weight:bold;'>✅ KONEKSI DATABASE BERHASIL! Database siap digunakan oleh Laravel.</div>\n";
                } catch (Exception $e) {
                    $commandOutput .= "<div class='text-danger' style='font-size:13px;font-weight:bold;'>❌ KONEKSI DATABASE GAGAL: " . htmlspecialchars($e->getMessage()) . "</div>\n";
                    $commandOutput .= "<div style='font-size:12px;color:#cbd5e1;margin-top:6px;'>Pastikan Database dan User telah dibuat di menu <b>Databases -> Create Database</b> CyberPanel, serta password di <code>.env</code> sudah benar.</div>\n";
                }
            } else {
                $commandOutput .= "<h4 class='text-danger'>❌ File .env tidak ditemukan!</h4>\n";
            }
            break;

        case 'fix_permissions':
            if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
                $commandOutput .= executeCommand('chmod -R 775 storage bootstrap/cache', $baseDir);
                $commandOutput .= executeCommand('chmod -R 777 storage/framework storage/logs 2>/dev/null || true', $baseDir);
                $commandOutput .= executeCommand('chown -R ' . get_current_user() . ':' . get_current_user() . ' storage bootstrap/cache 2>/dev/null || true', $baseDir);
            } else {
                $commandOutput .= "Sistem operasi Windows terdeteksi. Permissions chmod tidak diperlukan.\n";
            }
            break;

        case 'custom_command':
            $customCmd = trim($_POST['custom_cmd'] ?? '');
            if ($customCmd) {
                // Keamanan dasar mencegah perintah sangat destruktif
                if (preg_match('/rm\s+-rf\s+\/|mkfs|dd\s+if=/i', $customCmd)) {
                    $commandOutput .= "<span class='text-danger'>Perintah ini diblokir demi keamanan server!</span>";
                } else {
                    $commandOutput .= executeCommand($customCmd, $baseDir);
                }
            }
            break;
    }
}

// Status sistem diagnostik
$hasEnv = file_exists($baseDir . '/.env');
$envContent = $hasEnv ? file_get_contents($baseDir . '/.env') : '';
$hasAppKey = preg_match('/APP_KEY=base64:[A-Za-z0-9+\/=]{20,}/', $envContent);
$isDebugOn = preg_match('/APP_DEBUG=true/i', $envContent);
$hasVendor = is_dir($baseDir . '/vendor');
$hasBuild = is_dir($baseDir . '/public/build');
$hasStorageLink = file_exists($baseDir . '/public/storage');
$isStorageWritable = is_writable($baseDir . '/storage');
$isLogsWritable = is_dir($baseDir . '/storage/logs') && is_writable($baseDir . '/storage/logs');
$isFrameworkWritable = is_dir($baseDir . '/storage/framework/views') && is_writable($baseDir . '/storage/framework/views');
$isCacheWritable = is_writable($baseDir . '/bootstrap/cache');
$hasLogFile = file_exists($baseDir . '/storage/logs/laravel.log');

// Test DB Status & Table Count
$dbStatus = 'unknown';
$dbTableCount = 0;
$dbErrorMsg = '';
if ($hasEnv) {
    $envVars = @parse_ini_file($baseDir . '/.env');
    $dbHost = $envVars['DB_HOST'] ?? '127.0.0.1';
    $dbPort = $envVars['DB_PORT'] ?? '3306';
    $dbName = $envVars['DB_DATABASE'] ?? '';
    $dbUser = $envVars['DB_USERNAME'] ?? '';
    $dbPass = $envVars['DB_PASSWORD'] ?? '';
    if ($dbName && $dbUser) {
        try {
            $pdo = new PDO("mysql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 3
            ]);
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $dbTableCount = count($tables);
            $dbStatus = 'connected';
        } catch (Exception $e) {
            $dbStatus = 'error';
            $dbErrorMsg = $e->getMessage();
        }
    }
}

// Baca error terakhir dari laravel.log jika ada
$lastErrorMsg = '';
if (file_exists($baseDir . '/storage/logs/laravel.log')) {
    $logLines = @file($baseDir . '/storage/logs/laravel.log');
    if ($logLines) {
        $recent = array_slice($logLines, -150);
        foreach (array_reverse($recent) as $line) {
            if (stripos($line, '.ERROR:') !== false) {
                $lastErrorMsg = trim($line);
                break;
            }
        }
    }
}

$phpVersion = PHP_VERSION;
$currentOS = PHP_OS;
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Deployer & Terminal Runner — RSU Livasya Awards</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #070a14;
            --surface: #0e1424;
            --surface-hover: #151d33;
            --border: rgba(245, 158, 11, 0.25);
            --border-muted: rgba(255, 255, 255, 0.08);
            --gold: #f59e0b;
            --gold-bright: #fbbf24;
            --gold-glow: rgba(245, 158, 11, 0.35);
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --success: #10b981;
            --danger: #ef4444;
            --info: #38bdf8;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 24px 16px;
        }

        .container {
            max-width: 1050px;
            width: 100%;
            margin: 0 auto;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(14, 20, 36, 0.95));
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 24px 28px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
        }

        .header h1 {
            font-size: 22px;
            font-weight: 800;
            color: var(--gold-bright);
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header p {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }

        /* Auth Box */
        .auth-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            max-width: 440px;
            margin: 60px auto;
            padding: 32px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }

        .auth-card input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: rgba(0, 0, 0, 0.4);
            color: white;
            font-size: 14px;
            margin: 18px 0;
            outline: none;
            font-family: inherit;
        }

        /* Grid */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }

        @media (max-width: 768px) {
            .grid-2 {
                grid-template-columns: 1fr;
            }
        }

        /* Card */
        .card {
            background: var(--surface);
            border: 1px solid var(--border-muted);
            border-radius: 18px;
            padding: 20px;
        }

        .card-header {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--gold);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1px solid var(--border-muted);
            padding-bottom: 10px;
        }

        /* Diagnostic Badges */
        .diag-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            font-size: 13px;
        }

        .diag-row:last-child {
            border-bottom: none;
        }

        .badge {
            font-size: 11px;
            padding: 3px 10px;
            border-radius: 20px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }

        .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-danger  { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

        /* Buttons & Actions */
        .btn-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 14px;
        }

        .btn {
            font-family: inherit;
            padding: 11px 16px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            border: 1px solid transparent;
            transition: all 0.2s ease;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
        }

        .btn-gold {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
        }

        .btn-gold:hover {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px var(--gold-glow);
        }

        .btn-dark {
            background: #111728;
            color: var(--text);
            border-color: rgba(255, 255, 255, 0.1);
        }

        .btn-dark:hover {
            background: #1a223a;
            border-color: var(--gold);
            color: var(--gold-bright);
        }

        .btn-danger {
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            border-color: rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
            background: rgba(239, 68, 68, 0.3);
        }

        /* Terminal Output Console */
        .terminal {
            background: #040711;
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 16px;
            overflow: hidden;
            margin-top: 24px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.9);
        }

        .terminal-header {
            background: #090e1c;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 11px;
            color: var(--text-muted);
            font-family: 'JetBrains Mono', monospace;
        }

        .terminal-dots {
            display: flex;
            gap: 6px;
        }

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .terminal-body {
            padding: 18px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            line-height: 1.6;
            color: #cbd5e1;
            max-height: 480px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .cmd-header { color: #64748b; margin-top: 8px; }
        .cmd-run { color: #38bdf8; font-weight: bold; margin-bottom: 6px; }
        .cmd-exit { margin-top: 8px; margin-bottom: 12px; font-weight: bold; }
        .exit-ok { color: #34d399; }
        .exit-err { color: #f87171; }
        .text-gold { color: #fbbf24; font-weight: bold; margin: 10px 0; }
        .text-success { color: #34d399; font-weight: bold; margin: 10px 0; }
        .text-danger { color: #f87171; font-weight: bold; }

        /* Custom Input */
        .custom-form {
            display: flex;
            gap: 10px;
            margin-top: 14px;
        }

        .custom-form input {
            flex: 1;
            padding: 10px 14px;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid var(--border-muted);
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>

<div class="container">

    <!-- Header -->
    <div class="header">
        <div>
            <h1>⚡ CyberPanel Web Deployer</h1>
            <p>RSU Livasya Awards 2026 — Terminal Command Runner & Auto Deployment Engine</p>
        </div>
        <?php if ($isAuthenticated): ?>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span class="badge badge-success">● Terautentikasi</span>
                <a href="?action=logout" class="btn btn-dark" style="padding: 6px 12px; font-size: 11px;">Logout</a>
            </div>
        <?php endif; ?>
    </div>

    <?php if (!$isAuthenticated): ?>
        <!-- Login Form -->
        <div class="auth-card">
            <h2 style="color: var(--gold); margin-bottom: 8px;">Kunci Akses Diperlukan</h2>
            <p style="font-size: 13px; color: var(--text-muted);">Masukkan Security Key untuk menjalankan perintah deployment:</p>
            
            <form method="POST">
                <input type="password" name="password" placeholder="Masukkan Secret Key..." autofocus required>
                <button type="submit" class="btn btn-gold" style="width: 100%;">Buka Dashboard Deployer</button>
            </form>
            <p style="font-size: 11px; color: #64748b; margin-top: 14px;">Default Key: <code>livasya2026</code> (dapat diubah di file <code>setup-deploy.php</code>)</p>
        </div>
    <?php else: ?>

        <?php if ($lastErrorMsg): ?>
            <!-- Recent Server Error Banner -->
            <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: 16px; padding: 18px 22px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);">
                <div style="color: #f87171; font-weight: 800; font-size: 14px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                    <span>⚠️</span> PESAN ERROR TERAKHIR DI SERVER (laravel.log):
                </div>
                <div style="color: #fecaca; font-family: 'JetBrains Mono', monospace; font-size: 12px; word-break: break-word; line-height: 1.5; max-height: 120px; overflow-y: auto;">
                    <?= htmlspecialchars($lastErrorMsg) ?>
                </div>
                <div style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
                    💡 <em>Klik tombol <b>⚡ JALANKAN FULL AUTO DEPLOY SEKARANG</b> di bawah untuk membuat tabel database dan memperbaiki izin folder.</em>
                </div>
            </div>
        <?php endif; ?>

        <!-- Diagnostic & System Summary -->
        <div class="grid-2">
            <!-- System Status -->
            <div class="card">
                <div class="card-header">📊 Status Lingkungan Server</div>
                <div class="diag-row">
                    <span>Versi PHP Server</span>
                    <span class="badge badge-success"><?= htmlspecialchars($phpVersion) ?></span>
                </div>
                <div class="diag-row">
                    <span>Sistem Operasi (OS)</span>
                    <span class="badge badge-warning"><?= htmlspecialchars($currentOS) ?></span>
                </div>
                <div class="diag-row">
                    <span>File Konfigurasi .env</span>
                    <span class="badge <?= $hasEnv ? 'badge-success' : 'badge-danger' ?>">
                        <?= $hasEnv ? 'Tersedia (.env Aktif)' : 'Hilang! (Salin .env.example)' ?>
                    </span>
                </div>
                <div class="diag-row">
                    <span>Encryption Key (APP_KEY)</span>
                    <span class="badge <?= $hasAppKey ? 'badge-success' : 'badge-danger' ?>">
                        <?= $hasAppKey ? 'Terpasang (OK)' : 'KOSONG! Klik Generate Key' ?>
                    </span>
                </div>
                <div class="diag-row">
                    <span>Mode Debug (APP_DEBUG)</span>
                    <span class="badge <?= $isDebugOn ? 'badge-warning' : 'badge-info' ?>">
                        <?= $isDebugOn ? 'Aktif (Mode Debug)' : 'Nonaktif (Mode Produksi)' ?>
                    </span>
                </div>
                <div class="diag-row">
                    <span>Folder Vendor (Composer)</span>
                    <span class="badge <?= $hasVendor ? 'badge-success' : 'badge-warning' ?>">
                        <?= $hasVendor ? 'Tersedia' : 'Belum Ada (Jalankan Composer)' ?>
                    </span>
                </div>
                <div class="diag-row">
                    <span>Aset Frontend (public/build)</span>
                    <span class="badge <?= $hasBuild ? 'badge-success' : 'badge-warning' ?>">
                        <?= $hasBuild ? 'Tersedia (Siap Tampil)' : 'Belum Ada (Build NPM)' ?>
                    </span>
                </div>
                <div class="diag-row">
                    <span>Symlink Storage (public/storage)</span>
                    <span class="badge <?= $hasStorageLink ? 'badge-success' : 'badge-warning' ?>">
                        <?= $hasStorageLink ? 'Terhubung' : 'Belum Terhubung (storage:link)' ?>
                    </span>
                </div>
                <div class="diag-row">
                    <span>Koneksi Database MySQL</span>
                    <?php if ($dbStatus === 'connected'): ?>
                        <span class="badge <?= $dbTableCount > 0 ? 'badge-success' : 'badge-warning' ?>">
                            <?= $dbTableCount > 0 ? "Tersambung ({$dbTableCount} Tabel)" : 'Tersambung (0 Tabel - Perlu Migrate!)' ?>
                        </span>
                    <?php elseif ($dbStatus === 'error'): ?>
                        <span class="badge badge-danger" title="<?= htmlspecialchars($dbErrorMsg) ?>">Gagal Terhubung (Cek .env)</span>
                    <?php else: ?>
                        <span class="badge badge-warning">Belum Dikonfigurasi</span>
                    <?php endif; ?>
                </div>
                <div class="diag-row">
                    <span>Izin Tulis /storage & logs</span>
                    <span class="badge <?= ($isStorageWritable && $isLogsWritable && $isFrameworkWritable) ? 'badge-success' : 'badge-danger' ?>">
                        <?= ($isStorageWritable && $isLogsWritable && $isFrameworkWritable) ? 'Writable (775/777)' : 'Terkunci! (Klik Fix Permissions)' ?>
                    </span>
                </div>
            </div>

            <!-- 1-Click Deployment Card -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="card-header">🚀 1-Click Auto Deploy (Direkomendasikan)</div>
                    <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
                        Menjalankan alur pembaruan standar dalam 1 langkah otomatis:
                        <br>1. <code>git pull origin main</code>
                        <br>2. <code>php artisan storage:link</code>
                        <br>3. <code>php artisan migrate --force</code>
                        <br>4. <code>php artisan db:seed --force</code>
                        <br>5. <code>php artisan optimize:clear & cache</code>
                        <br>6. <code>chmod permissions storage</code>
                    </p>
                </div>
                <form method="POST" style="margin-top: 16px;">
                    <input type="hidden" name="action" value="full_deploy">
                    <button type="submit" class="btn btn-gold" style="width: 100%; padding: 14px; font-size: 14px;" onclick="return confirm('Jalankan Full Auto Deploy sekarang?');">
                        ⚡ JALANKAN FULL AUTO DEPLOY SEKARANG
                    </button>
                </form>
            </div>
        </div>

        <!-- Individual Action Buttons -->
        <div class="card">
            <div class="card-header">🛠️ Eksekusi Perintah & Solusi Masalah (Troubleshooting)</div>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Jalankan perintah khusus secara terpisah jika terjadi kendala / error 500 pada website:</p>
            
            <div class="btn-grid">
                <!-- Git Pull -->
                <form method="POST">
                    <input type="hidden" name="action" value="git_pull">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">📥 Git Pull (Update Kode)</button>
                </form>

                <!-- Key Generate -->
                <form method="POST">
                    <input type="hidden" name="action" value="key_generate">
                    <button type="submit" class="btn btn-dark" style="width: 100%; border-color: <?= $hasAppKey ? 'var(--border-muted)' : 'var(--danger)' ?>;" onclick="return confirm('Generate APP_KEY baru?');">🔑 Generate APP_KEY <?= $hasAppKey ? '' : '⚠️ (Wajib!)' ?></button>
                </form>

                <!-- Migrate Database -->
                <form method="POST">
                    <input type="hidden" name="action" value="migrate">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🗄️ php artisan migrate</button>
                </form>

                <!-- Seed Database -->
                <form method="POST">
                    <input type="hidden" name="action" value="seed">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🌱 php artisan db:seed (Data Awal)</button>
                </form>

                <!-- Test Database Connection -->
                <form method="POST">
                    <input type="hidden" name="action" value="test_db">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🔌 Test Koneksi Database</button>
                </form>

                <!-- Apply Production .ENV -->
                <form method="POST">
                    <input type="hidden" name="action" value="apply_prod_env">
                    <button type="submit" class="btn btn-gold" style="width: 100%;" onclick="return confirm('Terapkan konfigurasi .env resmi untuk livasya-award.frahesta.com?');">⚙️ Terapkan .ENV Produksi Otomatis</button>
                </form>

                <!-- Fix Permissions -->
                <form method="POST">
                    <input type="hidden" name="action" value="fix_permissions">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🔒 Fix Chmod 775 Permissions</button>
                </form>

                <!-- Storage Link -->
                <form method="POST">
                    <input type="hidden" name="action" value="storage_link">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🔗 php artisan storage:link</button>
                </form>

                <!-- Clear & Rebuild Cache -->
                <form method="POST">
                    <input type="hidden" name="action" value="cache_clear">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🧹 Clear & Rebuild Cache</button>
                </form>

                <!-- Toggle APP_DEBUG -->
                <form method="POST">
                    <input type="hidden" name="action" value="toggle_debug">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">🐞 Toggle Debug (<?= $isDebugOn ? 'Matikan' : 'Aktifkan' ?> Error 500 Detail)</button>
                </form>

                <!-- View Error Log -->
                <form method="POST">
                    <input type="hidden" name="action" value="view_log">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">📜 Lihat Log Error (laravel.log)</button>
                </form>

                <!-- Composer Install -->
                <form method="POST">
                    <input type="hidden" name="action" value="composer_install">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">📦 composer install --no-dev</button>
                </form>

                <!-- NPM Build -->
                <form method="POST">
                    <input type="hidden" name="action" value="npm_build">
                    <button type="submit" class="btn btn-dark" style="width: 100%;">⚡ npm run build</button>
                </form>

                <?php if (!$hasEnv): ?>
                <!-- Copy .env -->
                <form method="POST">
                    <input type="hidden" name="action" value="copy_env">
                    <button type="submit" class="btn btn-gold" style="width: 100%;">📄 Salin .env.example ke .env</button>
                </form>
                <?php endif; ?>
            </div>

            <!-- Custom Command Form -->
            <form method="POST" class="custom-form">
                <input type="hidden" name="action" value="custom_command">
                <input type="text" name="custom_cmd" placeholder="Ketik perintah kustom terminal (contoh: php -v, git status, git log -n 3)..." required>
                <button type="submit" class="btn btn-gold">Jalankan</button>
            </form>
        </div>

        <!-- Terminal Output Screen -->
        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-dots">
                    <div class="dot dot-red"></div>
                    <div class="dot dot-yellow"></div>
                    <div class="dot dot-green"></div>
                </div>
                <div>TERMINAL CONSOLE OUTPUT</div>
                <div>Dir: <?= htmlspecialchars($baseDir) ?></div>
            </div>
            <div class="terminal-body" id="terminalLog">
<?php if ($commandOutput): ?>
<?= $commandOutput ?>
<?php else: ?>
<span style="color: #64748b;">[Terminal Siap. Klik salah satu tombol aksi di atas untuk mengeksekusi perintah terminal...]</span>
<?php endif; ?>
            </div>
        </div>

        <div style="margin-top: 18px; text-align: center; font-size: 11px; color: #64748b;">
            ⚠️ <em>Catatan Keamanan: Setelah proses deployment selesai, Anda disarankan untuk menghapus atau mengganti nama file <code>setup-deploy.php</code> ini untuk mencegah akses yang tidak diinginkan.</em>
        </div>

    <?php endif; ?>

</div>

<script>
    // Auto-scroll terminal to bottom
    const term = document.getElementById('terminalLog');
    if (term) {
        term.scrollTop = term.scrollHeight;
    }
</script>

</body>
</html>
