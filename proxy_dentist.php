<?php
// public_html/proxy_dentist.php
// imeclinic.com/best-clinic-istanbul -> Coolify VPS
//
// KULLANIM:
// 1. Bu dosyayı imeclinic.com hosting'inin public_html klasörüne yükleyin
// 2. .htaccess'e aşağıdaki kuralı ekleyin:
//    RewriteRule ^best-clinic-istanbul(/.*)?$ /proxy_dentist.php?path=$1 [QSA,L]
// 3. Coolify'da deploy ettikten sonra aşağıdaki $upstreamBase ve $upstreamHost
//    değerlerini Coolify'ın verdiği URL ile güncelleyin

// =============================================
// COOLIFY ADRESİ - Deploy sonrası güncelleyin!
// =============================================
$upstreamBase = 'http://COOLIFY_URL_BURAYA.sslip.io';
$upstreamHost = 'COOLIFY_URL_BURAYA.sslip.io';
$hostPublic = 'https://www.imeclinic.com/best-clinic-istanbul';

$path = $_GET['path'] ?? '/';

// /best-clinic-istanbul prefix'ini koru
if (strpos($path, '/best-clinic-istanbul') !== 0) {
    $path = '/best-clinic-istanbul' . $path;
}

$query = $_SERVER['QUERY_STRING'] ?? '';
parse_str($query, $qs);
unset($qs['path']);
$q = http_build_query($qs);

// Path segmentlerini URL-encode et
$encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
$target = rtrim($upstreamBase, '/') . $encodedPath . ($q ? ('?' . $q) : '');

$ch = curl_init($target);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// === HEADERS ===
$headers = [];
$headers[] = 'Host: ' . $upstreamHost;

if (isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}

$copyHeaders = ['Authorization', 'X-Auth-Token', 'User-Agent', 'Accept', 'Accept-Language', 'Accept-Encoding'];
foreach ($copyHeaders as $headerName) {
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $headerName));
    if (isset($_SERVER[$serverKey])) {
        $headers[] = $headerName . ': ' . $_SERVER[$serverKey];
    }
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    echo "Proxy Error (Dental Istanbul): " . curl_error($ch);
    exit;
}

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$rawHeaders = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

$lines = explode("\r\n", $rawHeaders);
foreach ($lines as $line) {
    if ($line === '' || strpos($line, ':') === false)
        continue;
    $parts = explode(':', $line, 2);
    $key = strtolower(trim($parts[0]));
    $val = trim($parts[1]);

    if (in_array($key, ['content-length', 'transfer-encoding', 'connection', 'keep-alive', 'host']))
        continue;

    if ($key === 'location') {
        $val = str_replace($upstreamBase, $hostPublic, $val);
        header('Location: ' . $val, true);
        continue;
    }

    header($line, false);
}

header('X-Proxied-By: dental-istanbul-proxy');
http_response_code($status);
echo $body;
?>
