<?php

declare(strict_types=1);

const PVGIS_URL = 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc';
const PVGIS_TIMEOUT_SECONDS = 10;
const CACHE_TTL_SECONDS = 2592000;
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_SECONDS = 600;
const LATITUDE_RANGE = [41.2, 51.2];
const LONGITUDE_RANGE = [-5.3, 9.7];
const COORDINATE_DECIMALS = 2;
const MONTHS_PER_YEAR = 12;
const PVGIS_ATTEMPTS = 2;

function respond(int $status, array $body, bool $cacheable = false): void
{
    http_response_code($status);
    header('Cache-Control: ' . ($cacheable ? 'public, max-age=' . CACHE_TTL_SECONDS : 'no-store'));
    echo json_encode($body);
    exit;
}

function readCoordinate(string $name, array $range): ?float
{
    $raw = $_GET[$name] ?? null;
    if (!is_string($raw) || !is_numeric($raw)) {
        return null;
    }
    $value = round((float) $raw, COORDINATE_DECIMALS);
    return $value >= $range[0] && $value <= $range[1] ? $value : null;
}

function isRateLimited(string $clientIp): bool
{
    $file = sys_get_temp_dir() . '/soliance-pvgis-rate-' . hash('sha256', $clientIp);
    $now = time();
    $recent = [];
    $stored = @is_file($file) ? json_decode((string) @file_get_contents($file), true) : null;
    if (is_array($stored)) {
        $recent = array_values(array_filter($stored, function ($timestamp) use ($now) {
            return is_int($timestamp) && $timestamp > $now - RATE_LIMIT_WINDOW_SECONDS;
        }));
    }
    if (count($recent) >= RATE_LIMIT_MAX) {
        return true;
    }
    $recent[] = $now;
    @file_put_contents($file, json_encode($recent), LOCK_EX);
    return false;
}

function cacheFile(float $latitude, float $longitude): string
{
    return sys_get_temp_dir() . '/soliance-pvgis-' . number_format($latitude, COORDINATE_DECIMALS, '.', '') . '_' . number_format($longitude, COORDINATE_DECIMALS, '.', '') . '.json';
}

function readCache(string $file): ?array
{
    if (!@is_file($file) || time() - (int) @filemtime($file) > CACHE_TTL_SECONDS) {
        return null;
    }
    $cached = json_decode((string) @file_get_contents($file), true);
    return is_array($cached) ? $cached : null;
}

function requestPvgis(string $url): ?string
{
    for ($attempt = 1; $attempt <= PVGIS_ATTEMPTS; $attempt++) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => PVGIS_TIMEOUT_SECONDS,
            CURLOPT_CONNECTTIMEOUT => PVGIS_TIMEOUT_SECONDS,
        ]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (is_string($response) && $status === 200) {
            return $response;
        }
        error_log('soliance pvgis: PVGIS answered ' . $status . ' on attempt ' . $attempt);
    }
    return null;
}

function fetchPvgis(float $latitude, float $longitude): ?array
{
    $query = http_build_query([
        'lat' => $latitude,
        'lon' => $longitude,
        'peakpower' => 1,
        'loss' => 14,
        'angle' => 30,
        'aspect' => 0,
        'raddatabase' => 'PVGIS-SARAH3',
        'outputformat' => 'json',
    ]);
    $response = requestPvgis(PVGIS_URL . '?' . $query);
    if ($response === null) {
        return null;
    }

    $data = json_decode($response, true);
    $yearly = $data['outputs']['totals']['fixed']['E_y'] ?? null;
    $months = $data['outputs']['monthly']['fixed'] ?? null;
    if (!is_numeric($yearly) || !is_array($months) || count($months) !== MONTHS_PER_YEAR) {
        return null;
    }
    $monthly = [];
    foreach ($months as $month) {
        if (!is_numeric($month['E_m'] ?? null)) {
            return null;
        }
        $monthly[] = (int) round((float) $month['E_m']);
    }
    return ['yearlyKwhPerKwc' => (int) round((float) $yearly), 'monthlyKwhPerKwc' => $monthly];
}

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    respond(405, ['error' => 'METHOD_NOT_ALLOWED']);
}

$fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? null;
if ($fetchSite !== null && $fetchSite !== 'same-origin') {
    respond(403, ['error' => 'FORBIDDEN_ORIGIN']);
}

$latitude = readCoordinate('lat', LATITUDE_RANGE);
$longitude = readCoordinate('lon', LONGITUDE_RANGE);
if ($latitude === null || $longitude === null) {
    respond(400, ['error' => 'INVALID_LOCATION']);
}

$file = cacheFile($latitude, $longitude);
$cached = readCache($file);
if ($cached !== null) {
    respond(200, $cached, true);
}

if (isRateLimited((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
    respond(429, ['error' => 'TOO_MANY_REQUESTS']);
}

$yield = fetchPvgis($latitude, $longitude);
if ($yield === null) {
    respond(502, ['error' => 'PVGIS_UNAVAILABLE']);
}

@file_put_contents($file, json_encode($yield), LOCK_EX);
respond(200, $yield, true);
