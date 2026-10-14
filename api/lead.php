<?php

declare(strict_types=1);

const CONFIG_FILE_NAME = 'soliance-mail.php';
const RESEND_URL = 'https://api.resend.com/emails';
const MAX_BODY_BYTES = 20000;
const MAX_FIELDS = 40;
const MAX_VALUE_BYTES = 4000;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 600;
const MIN_FILL_MILLISECONDS = 2500;
const SPAM_DROP = 'drop';
const SPAM_SUSPECT = 'suspect';
const SPAM_CLEAN = 'clean';
const ALLOWED_ORIGINS = ['https://soliance-enr.fr', 'https://www.soliance-enr.fr'];
const LEAD_RECIPIENTS = [
    'adv@soliance-enr.fr',
    'commercial@soliance-enr.fr',
    'ruben.darmon@soliance-enr.fr',
];

const PORTFOLIO_URL = 'https://soliance-enr.fr/documents/portfolio-soliance-enr.pdf';
const LEAD_KINDS = [
    'STUDY_REQUEST' => ['title' => "Demande d'étude gratuite"],
    'PROFESSIONAL_STUDY' => ['title' => 'Demande professionnelle'],
    'REFERRAL' => ['title' => 'Parrainage'],
    'SIMULATION' => ['title' => 'Simulation solaire'],
    'CARE_REQUEST' => ['title' => 'Demande Soliance Care'],
    'PORTFOLIO_REQUEST' => ['title' => 'Demande de portfolio'],
];

const FIELD_LABELS = [
    'care_request_type' => 'Demande',
    'company' => 'Société',
    'full_name' => 'Nom',
    'first_name' => 'Prénom',
    'last_name' => 'Nom',
    'job_title' => 'Fonction',
    'referrer_full_name' => 'Parrain',
    'referrer_phone' => 'Téléphone du parrain',
    'referrer_email' => 'E-mail du parrain',
    'referee_full_name' => 'Filleul',
    'referee_phone' => 'Téléphone du filleul',
    'referee_project' => 'Projet du filleul',
    'phone' => 'Téléphone',
    'email' => 'E-mail',
    'address' => 'Adresse',
    'zip' => 'Code postal',
    'project_type' => 'Projet',
    'surface_m2' => 'Surface (m²)',
    'monthly_electricity_bill' => "Facture d'électricité mensuelle",
    'inverter_brand' => "Marque de l'onduleur",
    'installation_situation' => 'Situation',
    'roof_area_m2' => 'Surface de toiture (m²)',
    'orientation' => 'Orientation',
    'roof_tilt' => 'Pente du toit',
    'roof_covering' => 'Couverture',
    'monthly_bill_eur' => 'Facture mensuelle (€)',
    'equipment' => 'Équipements',
    'daytime_presence' => 'Présence en journée',
    'ev_km_per_year' => 'Kilométrage du véhicule électrique (km/an)',
    'ev_charging' => 'Recharge du véhicule électrique',
    'annual_consumption_kwh' => 'Consommation annuelle (kWh)',
    'consumption_source' => 'Origine de la consommation',
    'kwh_price_eur' => 'Prix du kWh retenu (€)',
    'recommended_kwc' => 'Puissance conseillée (kWc)',
    'installed_kwc' => 'Puissance simulée (kWc)',
    'panel_count' => 'Nombre de panneaux',
    'panel_choice' => 'Nombre de panneaux',
    'recommended_battery_kwh' => 'Batterie conseillée (kWh)',
    'battery_kwh' => 'Batterie simulée (kWh)',
    'battery_choice' => 'Batterie',
    'shading' => 'Ombrage',
    'annual_production_kwh' => 'Production annuelle (kWh)',
    'self_consumed_kwh' => 'Énergie autoconsommée (kWh)',
    'autonomy_percent' => 'Autonomie (%)',
    'annual_savings_eur' => 'Économies annuelles (€)',
    'solar_yield_kwh_kwc' => 'Ensoleillement retenu (kWh/kWc/an)',
    'solar_yield_source' => "Source de l'ensoleillement",
];

const PROJECT_TYPE_LABELS = [
    'SOLAR_PANELS' => 'Panneaux solaires',
    'HEAT_PUMP' => 'Pompe à chaleur',
    'EV_CHARGER' => 'Borne de recharge',
    'PROFESSIONAL_PROJECT' => 'Projet professionnel',
    'UNDECIDED' => 'Ne sait pas encore',
    'INDUSTRIAL_OR_AGRICULTURAL_ROOF' => 'Toiture industrielle ou agricole',
    'PARKING_CARPORT' => 'Ombrière de parking',
    'EV_CHARGING' => 'Bornes de recharge',
    'CONDOMINIUM_OR_LANDLORD' => 'Copropriété / bailleur',
    'PUBLIC_AUTHORITY_OR_TENDER' => "Collectivité / appel d'offres",
];

const VALUE_LABELS = [
    'project_type' => PROJECT_TYPE_LABELS,
    'referee_project' => PROJECT_TYPE_LABELS,
    'care_request_type' => [
        'SUBSCRIBE_CARE' => 'Souscrire à Soliance Care (19,99 €/mois)',
        'SUBSCRIBE_CONNECT' => 'Souscrire à Care Connect (4,99 €/mois)',
        'HEALTH_CHECK' => 'Bilan de santé gratuit',
        'TAKEOVER' => 'Reprise (installateur disparu)',
        'CLAIM' => 'Déclaration de sinistre',
        'PRO' => 'Soliance Care Pro : audit de performance',
        'PARTNER' => 'Installateur : démo',
    ],
    'orientation' => [
        'SOUTH' => 'Sud',
        'SOUTH_EAST' => 'Sud-est',
        'SOUTH_WEST' => 'Sud-ouest',
        'EAST_WEST' => 'Est / Ouest',
    ],
    'roof_covering' => [
        'TILES' => 'Tuiles',
        'SLATE' => 'Ardoise',
        'METAL_SHEET' => 'Bac acier',
        'FLAT_ROOF' => 'Toit-terrasse',
        'OTHER' => 'Autre / ne sait pas',
    ],
    'solar_yield_source' => [
        'COMMUNE' => 'PVGIS de la commune',
        'DEPARTMENT' => 'PVGIS du département',
        'REGIONAL_DEFAULT' => 'Valeur régionale par défaut',
    ],
    'daytime_presence' => [
        'MOSTLY_ABSENT' => 'Souvent absent',
        'PRESENT' => 'Présent (télétravail, retraite)',
    ],
    'roof_tilt' => [
        'LOW' => 'Faible (15°)',
        'CLASSIC' => 'Classique (30°)',
        'STEEP' => 'Forte (45°)',
    ],
    'shading' => [
        'NONE' => 'Aucun',
        'LIGHT' => 'Léger',
        'STRONG' => 'Marqué',
    ],
    'ev_charging' => [
        'NIGHT' => 'La nuit',
        'MIXED' => 'Jour et nuit',
        'DAYTIME' => 'En journée',
    ],
    'consumption_source' => [
        'ANNUAL' => 'Consommation annuelle saisie par le visiteur',
        'BILL' => 'Déduite de la facture mensuelle',
        'REFERENCE' => 'Foyer type à 180 €/mois (aucune facture saisie)',
    ],
    'panel_choice' => [
        'RECOMMENDED' => 'Conseillé par le simulateur',
        'CUSTOM' => 'Choisi par le visiteur',
    ],
    'battery_choice' => [
        'RECOMMENDED' => 'Conseillée par le simulateur',
        'CUSTOM' => 'Choisie par le visiteur',
    ],
    'equipment' => [
        'ELECTRIC_HEATING' => 'Chauffage électrique',
        'AIR_CONDITIONING' => 'Climatisation',
        'POOL' => 'Piscine',
        'ELECTRIC_VEHICLE' => 'Véhicule électrique',
    ],
];

const LIST_FIELDS = ['equipment'];
const IDENTITY_FIELDS = ['full_name', 'company', 'referrer_full_name', 'email', 'phone'];
const REPLY_TO_FIELDS = ['email', 'referrer_email'];
const RESULT_REPLY_TO = 'commercial@soliance-enr.fr';
const RESULT_FIELDS = [
    'installed_kwc' => ['label' => 'Puissance conseillée', 'customLabel' => 'Puissance choisie', 'choice' => 'panel_choice', 'unit' => 'kWc'],
    'panel_count' => ['label' => 'Panneaux', 'unit' => ''],
    'battery_kwh' => ['label' => 'Batterie conseillée', 'customLabel' => 'Batterie choisie', 'choice' => 'battery_choice', 'unit' => 'kWh'],
    'annual_production_kwh' => ['label' => 'Production estimée', 'unit' => 'kWh par an'],
    'annual_savings_eur' => ['label' => "Économies estimées", 'unit' => '€ par an'],
    'autonomy_percent' => ['label' => 'Autonomie', 'unit' => '%'],
];

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function readConfig(): ?array
{
    $path = dirname(__DIR__, 2) . '/' . CONFIG_FILE_NAME;
    if (!is_file($path) || !is_readable($path)) {
        return null;
    }
    $config = require $path;
    if (!is_array($config)) {
        return null;
    }
    $apiKey = trim((string) ($config['resend_api_key'] ?? ''));
    $from = trim((string) ($config['resend_from'] ?? ''));
    if ($apiKey === '' || $from === '') {
        return null;
    }
    return ['apiKey' => $apiKey, 'from' => $from];
}

function isBoundedString($value, int $maxBytes): bool
{
    return is_string($value) && trim($value) !== '' && strlen($value) <= $maxBytes;
}

function readLead($payload): ?array
{
    if (!is_array($payload)) {
        return null;
    }
    $kind = $payload['kind'] ?? null;
    $fields = $payload['fields'] ?? null;
    if (!is_string($kind) || !array_key_exists($kind, LEAD_KINDS)) {
        return null;
    }
    if (!is_array($fields) || count($fields) === 0 || count($fields) > MAX_FIELDS) {
        return null;
    }
    $cleanFields = [];
    foreach ($fields as $name => $value) {
        if (!is_string($name) || preg_match('/^[a-z][a-z0-9_]{0,39}$/', $name) !== 1 || !isBoundedString($value, MAX_VALUE_BYTES)) {
            return null;
        }
        $cleanFields[$name] = trim($value);
    }
    $consentText = $payload['consentText'] ?? null;
    $consentedAt = $payload['callbackConsentedAt'] ?? null;
    $pageUri = $payload['pageUri'] ?? null;
    $pageName = $payload['pageName'] ?? null;
    $website = $payload['website'] ?? null;
    if (!isBoundedString($consentText, MAX_VALUE_BYTES) || !isBoundedString($consentedAt, 40) || strtotime($consentedAt) === false) {
        return null;
    }
    if (!isBoundedString($pageUri, 500) || !is_string($pageName) || strlen($pageName) > 300) {
        return null;
    }
    return [
        'kind' => $kind,
        'fields' => $cleanFields,
        'consentText' => trim($consentText),
        'consentedAt' => $consentedAt,
        'pageUri' => $pageUri,
        'pageName' => trim($pageName),
        'honeypot' => is_string($website) && strlen($website) <= MAX_VALUE_BYTES ? $website : null,
        'fillDurationMs' => readDuration($payload['fillDurationMs'] ?? null),
        'suspect' => false,
        'notice' => null,
    ];
}

function readDuration($value): ?int
{
    if (is_int($value) && $value >= 0) {
        return $value;
    }
    if (is_float($value) && is_finite($value) && $value >= 0) {
        return (int) round($value);
    }
    return null;
}

function spamVerdict(array $lead): string
{
    if ($lead['honeypot'] === null || trim($lead['honeypot']) !== '' || $lead['fillDurationMs'] === null) {
        return SPAM_DROP;
    }
    return $lead['fillDurationMs'] < MIN_FILL_MILLISECONDS ? SPAM_SUSPECT : SPAM_CLEAN;
}

function suspectNotice(array $lead): ?string
{
    if (!$lead['suspect']) {
        return null;
    }
    $seconds = number_format($lead['fillDurationMs'] / 1000, 1, ',', '');
    return 'Envoi suspect : formulaire rempli en ' . $seconds . ' s, peut-être par un robot. Vérifiez la demande avant de rappeler.';
}

function isRateLimited(string $clientIp): bool
{
    $file = sys_get_temp_dir() . '/soliance-lead-' . hash('sha256', $clientIp);
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

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function fieldLabel(string $name): string
{
    return FIELD_LABELS[$name] ?? $name;
}

function displayValue(string $name, string $value): string
{
    $labels = VALUE_LABELS[$name] ?? [];
    if (in_array($name, LIST_FIELDS, true)) {
        $items = array_map(function ($item) use ($labels) {
            return $labels[$item] ?? $item;
        }, explode(';', $value));
        return implode(', ', $items);
    }
    return $labels[$value] ?? $value;
}

function orderedFields(array $fields): array
{
    $known = array_intersect_key(FIELD_LABELS, $fields);
    $ordered = [];
    foreach (array_keys($known) as $name) {
        $ordered[$name] = $fields[$name];
    }
    return $ordered + $fields;
}

function htmlValue(string $name, string $value): string
{
    $display = escapeHtml(displayValue($name, $value));
    if (preg_match('/(^|_)phone$/', $name) === 1 && preg_match('/^\+?[0-9]{6,15}$/', $value) === 1) {
        return '<a href="tel:' . $display . '">' . $display . '</a>';
    }
    if (preg_match('/(^|_)email$/', $name) === 1 && filter_var($value, FILTER_VALIDATE_EMAIL) !== false) {
        return '<a href="mailto:' . $display . '">' . $display . '</a>';
    }
    return nl2br($display);
}

function formatConsentDate(string $isoDate): string
{
    $date = new DateTimeImmutable($isoDate);
    return $date->setTimezone(new DateTimeZone('Europe/Paris'))->format('d/m/Y à H:i');
}

function firstFilled(array $fields, array $names): ?string
{
    foreach ($names as $name) {
        if (isset($fields[$name])) {
            return $fields[$name];
        }
    }
    return null;
}

function personName(array $fields): ?string
{
    $name = trim(($fields['first_name'] ?? '') . ' ' . ($fields['last_name'] ?? ''));
    return $name === '' ? null : $name;
}

function buildSubject(array $lead): string
{
    $parts = [($lead['suspect'] ? '[Envoi suspect] ' : '') . LEAD_KINDS[$lead['kind']]['title']];
    $identity = personName($lead['fields']) ?? firstFilled($lead['fields'], IDENTITY_FIELDS);
    if ($identity !== null) {
        $parts[] = $identity;
    }
    if (isset($lead['fields']['zip'])) {
        $parts[] = $lead['fields']['zip'];
    }
    return preg_replace('/[\r\n]+/', ' ', implode(' · ', $parts));
}

function buildHtml(array $lead): string
{
    $rows = '';
    foreach (orderedFields($lead['fields']) as $name => $value) {
        $rows .= '<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;color:#475569;font-weight:600;white-space:nowrap">'
            . escapeHtml(fieldLabel($name)) . '</th><td style="padding:6px 0">' . htmlValue($name, $value) . '</td></tr>';
    }
    $page = escapeHtml($lead['pageName'] !== '' ? $lead['pageName'] : $lead['pageUri']);
    $notice = suspectNotice($lead);
    $pageLink = strpos($lead['pageUri'], 'https://') === 0
        ? '<a href="' . escapeHtml($lead['pageUri']) . '">' . $page . '</a>'
        : $page;

    return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0f172a;line-height:1.5">'
        . '<h2 style="margin:0 0 16px">' . escapeHtml(LEAD_KINDS[$lead['kind']]['title']) . '</h2>'
        . ($notice === null ? '' : '<p style="margin:0 0 16px;padding:10px 14px;border-radius:8px;background:#fff4ea;color:#7a3a0c;font-size:14px">' . escapeHtml($notice) . '</p>')
        . ($lead['notice'] === null ? '' : '<p style="margin:0 0 16px;padding:10px 14px;border-radius:8px;background:#f1f5f9;color:#0f172a;font-size:14px">' . escapeHtml($lead['notice']) . '</p>')
        . '<table cellspacing="0" cellpadding="0" style="border-collapse:collapse">' . $rows . '</table>'
        . '<p style="margin:24px 0 4px;color:#475569;font-size:13px">Rappel accepté le ' . escapeHtml(formatConsentDate($lead['consentedAt'])) . ' (heure de Paris).</p>'
        . '<p style="margin:0 0 4px;color:#475569;font-size:13px">Consentement affiché : « ' . escapeHtml($lead['consentText']) . ' »</p>'
        . '<p style="margin:0;color:#475569;font-size:13px">Envoyé depuis : ' . $pageLink . '</p>'
        . '</div>';
}

function buildText(array $lead): string
{
    $lines = [LEAD_KINDS[$lead['kind']]['title'], ''];
    $notice = suspectNotice($lead);
    if ($notice !== null) {
        array_push($lines, $notice, '');
    }
    if ($lead['notice'] !== null) {
        array_push($lines, $lead['notice'], '');
    }
    foreach (orderedFields($lead['fields']) as $name => $value) {
        $lines[] = fieldLabel($name) . ' : ' . displayValue($name, $value);
    }
    $lines[] = '';
    $lines[] = 'Rappel accepté le ' . formatConsentDate($lead['consentedAt']) . ' (heure de Paris).';
    $lines[] = 'Consentement affiché : « ' . $lead['consentText'] . ' »';
    $lines[] = 'Envoyé depuis : ' . $lead['pageUri'];
    return implode("\n", $lines);
}

function buildMessage(array $lead, string $from): array
{
    $message = [
        'from' => $from,
        'to' => LEAD_RECIPIENTS,
        'subject' => buildSubject($lead),
        'html' => buildHtml($lead),
        'text' => buildText($lead),
    ];
    $replyTo = firstFilled($lead['fields'], REPLY_TO_FIELDS);
    if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL) !== false) {
        $message['reply_to'] = $replyTo;
    }
    return $message;
}

function formatNumber(string $value): string
{
    $decimals = strpos($value, '.') === false ? 0 : 1;
    return number_format((float) $value, $decimals, ',', "\u{202F}");
}

function resultRows(array $fields): ?array
{
    $rows = [];
    foreach (RESULT_FIELDS as $name => $field) {
        $value = $fields[$name] ?? '';
        if (!is_string($value) || preg_match('/^\d+(?:\.\d)?$/', $value) !== 1) {
            return null;
        }
        if ($name === 'battery_kwh' && $value === '0') {
            $rows[] = ['Batterie', 'Sans batterie'];
            continue;
        }
        $isCustom = isset($field['choice']) && ($fields[$field['choice']] ?? '') === 'CUSTOM';
        $label = $isCustom ? $field['customLabel'] : $field['label'];
        $rows[] = [$label, trim(formatNumber($value) . ' ' . $field['unit'])];
    }
    return $rows;
}

function buildResultMessage(array $lead, string $from): ?array
{
    if ($lead['kind'] !== 'SIMULATION' || $lead['suspect']) {
        return null;
    }
    $email = $lead['fields']['email'] ?? '';
    $rows = resultRows($lead['fields']);
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || $rows === null) {
        return null;
    }
    $hasBattery = ($lead['fields']['battery_kwh'] ?? '') !== '0';
    $intro = $hasBattery
        ? 'Voici l’estimation de votre installation solaire avec batterie, calculée avec les données d’ensoleillement PVGIS de la Commission européenne.'
        : 'Voici l’estimation de votre installation solaire sans batterie, calculée avec les données d’ensoleillement PVGIS de la Commission européenne.';
    $profileOrigins = [
        'ANNUAL' => 'Cette estimation repose sur la consommation annuelle que vous avez indiquée, répartie selon votre présence en journée et vos équipements.',
        'REFERENCE' => 'Cette estimation repose sur un foyer type à 180 € d’électricité par mois, faute de facture indiquée.',
    ];
    $profile = $profileOrigins[$lead['fields']['consumption_source'] ?? ''] ?? 'Cette estimation repose sur un profil de consommation type, déduit de votre facture, de votre présence en journée et de vos équipements.';
    $outro = $profile . ' Elle est améliorable : un conseiller Soliance vous rappelle pour l’affiner avec vos relevés Linky réels et les caractéristiques de votre maison, puis vous adresser un devis à prix fixe. Estimation indicative, sans valeur contractuelle.';
    $htmlRows = '';
    $textRows = [];
    foreach ($rows as [$label, $value]) {
        $htmlRows .= '<tr><th align="left" style="padding:6px 16px 6px 0;color:#475569;font-weight:600">' . escapeHtml($label)
            . '</th><td style="padding:6px 0;font-weight:700;color:#b85f17">' . escapeHtml($value) . '</td></tr>';
        $textRows[] = $label . ' : ' . $value;
    }
    return [
        'from' => $from,
        'to' => [$email],
        'reply_to' => RESULT_REPLY_TO,
        'subject' => 'Votre estimation solaire Soliance',
        'html' => '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0f172a;line-height:1.5">'
            . '<h2 style="margin:0 0 12px">Votre estimation solaire</h2>'
            . '<p style="margin:0 0 16px">' . escapeHtml($intro) . '</p>'
            . '<table cellspacing="0" cellpadding="0" style="border-collapse:collapse">' . $htmlRows . '</table>'
            . '<p style="margin:16px 0 0;color:#475569;font-size:14px">' . escapeHtml($outro) . '</p>'
            . '</div>',
        'text' => implode("\n", array_merge(['Votre estimation solaire', '', $intro, ''], $textRows, ['', $outro])),
    ];
}

function isPortfolioRequest(array $lead): bool
{
    return $lead['kind'] === 'PORTFOLIO_REQUEST';
}

function hasValidEmail(array $fields): bool
{
    return filter_var($fields['email'] ?? '', FILTER_VALIDATE_EMAIL) !== false;
}

function buildPortfolioMessage(array $lead, string $from): ?array
{
    if (!isPortfolioRequest($lead) || $lead['suspect']) {
        return null;
    }
    $firstName = $lead['fields']['first_name'] ?? '';
    $greeting = $firstName === '' ? 'Bonjour,' : 'Bonjour ' . $firstName . ',';
    $intro = 'Merci de l’intérêt que vous portez à Soliance. Comme promis, voici notre portfolio : une sélection de nos réalisations en photovoltaïque, pompe à chaleur et bornes de recharge.';
    $outro = 'Un conseiller Soliance pourra vous contacter pour échanger sur votre projet. Vous pouvez aussi répondre directement à cet e-mail ou nous appeler au 07 63 54 51 44.';
    return [
        'from' => $from,
        'to' => [$lead['fields']['email']],
        'reply_to' => RESULT_REPLY_TO,
        'subject' => 'Le portfolio Soliance',
        'html' => '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0f172a;line-height:1.5">'
            . '<p style="margin:0 0 12px">' . escapeHtml($greeting) . '</p>'
            . '<p style="margin:0 0 20px">' . escapeHtml($intro) . '</p>'
            . '<p style="margin:0 0 20px"><a href="' . escapeHtml(PORTFOLIO_URL) . '" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#E07B28;color:#ffffff;font-weight:700;text-decoration:none">Télécharger le portfolio (PDF)</a></p>'
            . '<p style="margin:0 0 16px;color:#475569;font-size:13px">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : <a href="' . escapeHtml(PORTFOLIO_URL) . '">' . escapeHtml(PORTFOLIO_URL) . '</a></p>'
            . '<p style="margin:0 0 16px">' . escapeHtml($outro) . '</p>'
            . '<p style="margin:0">L’équipe Soliance</p>'
            . '</div>',
        'text' => implode("\n", [$greeting, '', $intro, '', 'Télécharger le portfolio (PDF) : ' . PORTFOLIO_URL, '', $outro, '', 'L’équipe Soliance']),
    ];
}

function portfolioNotice(array $lead, bool $sent): string
{
    if ($lead['suspect']) {
        return 'Portfolio non envoyé automatiquement (envoi suspect). Si la demande est réelle, envoyez ce lien au demandeur : ' . PORTFOLIO_URL;
    }
    if (!$sent) {
        return 'L’envoi automatique du portfolio a échoué. Envoyez ce lien au demandeur : ' . PORTFOLIO_URL;
    }
    return 'Le portfolio a été envoyé automatiquement à ' . $lead['fields']['email'] . '.';
}

function sendWithResend(string $apiKey, array $message): bool
{
    $curl = curl_init(RESEND_URL);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'User-Agent: soliance-site',
        ],
        CURLOPT_POSTFIELDS => json_encode($message),
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curlError = curl_error($curl);
    if ($status >= 200 && $status < 300) {
        return true;
    }
    error_log('soliance lead mail: Resend answered ' . $status . ' ' . $curlError . ' ' . substr((string) $response, 0, 500));
    return false;
}

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'METHOD_NOT_ALLOWED']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;
if ($origin === null || !in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(403, ['error' => 'FORBIDDEN_ORIGIN']);
}

$config = readConfig();
if ($config === null) {
    respond(503, ['error' => 'NOT_CONFIGURED']);
}

$body = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if (!is_string($body) || strlen($body) > MAX_BODY_BYTES) {
    respond(400, ['error' => 'INVALID_REQUEST']);
}

$lead = readLead(json_decode($body, true));
if ($lead === null || (isPortfolioRequest($lead) && !hasValidEmail($lead['fields']))) {
    respond(400, ['error' => 'INVALID_REQUEST']);
}

if (isRateLimited((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
    respond(429, ['error' => 'TOO_MANY_REQUESTS']);
}

$verdict = spamVerdict($lead);
if ($verdict === SPAM_DROP) {
    error_log('soliance lead mail: dropped a ' . $lead['kind'] . ' submission caught by the spam trap');
    respond(200, ['status' => 'sent']);
}
$lead['suspect'] = $verdict === SPAM_SUSPECT;

$portfolioMessage = buildPortfolioMessage($lead, $config['from']);
$portfolioSent = $portfolioMessage !== null && sendWithResend($config['apiKey'], $portfolioMessage);
if (isPortfolioRequest($lead)) {
    $lead['notice'] = portfolioNotice($lead, $portfolioSent);
}

if (!sendWithResend($config['apiKey'], buildMessage($lead, $config['from']))) {
    respond(502, ['error' => 'SUBMISSION_FAILED']);
}

if ($portfolioMessage !== null && !$portfolioSent) {
    error_log('soliance lead mail: the portfolio could not be sent to the lead');
    respond(502, ['error' => 'SUBMISSION_FAILED']);
}

$resultMessage = buildResultMessage($lead, $config['from']);
if ($resultMessage !== null && !sendWithResend($config['apiKey'], $resultMessage)) {
    error_log('soliance lead mail: the result could not be sent to the simulation lead');
}

respond(200, ['status' => 'sent']);
