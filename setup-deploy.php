<?php
// Forwarder / Runner when uploaded directly to root public_html
if (file_exists(__DIR__ . '/public/setup-deploy.php')) {
    require __DIR__ . '/public/setup-deploy.php';
} else {
    echo "setup-deploy.php not found in public folder.";
}
