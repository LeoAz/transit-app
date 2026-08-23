<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        @page { margin: 24px 28px 40px 28px; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #1f2937; }
        header.report-header { border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 16px; }
        header.report-header h1 { font-size: 18px; margin: 0 0 4px 0; color: #1e3a5f; }
        header.report-header .meta { font-size: 10px; color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        thead th { background-color: #1e3a5f; color: #ffffff; text-align: left; padding: 6px 8px; font-size: 10px; text-transform: uppercase; }
        tbody td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 10.5px; }
        tbody tr:nth-child(even) { background-color: #f8fafc; }
        h2.section-title { font-size: 13px; color: #1e3a5f; margin: 18px 0 8px 0; }
        footer { position: fixed; bottom: -24px; left: 0; right: 0; font-size: 9px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <header class="report-header">
        <h1>{{ $title }}</h1>
        <div class="meta">
            Période : {{ $period->startDate->translatedFormat('d/m/Y') }} — {{ $period->endDate->translatedFormat('d/m/Y') }}
            &nbsp;·&nbsp; Généré le {{ $generatedAt->translatedFormat('d/m/Y à H:i') }}
        </div>
    </header>

    @include($contentView)

    <footer>Document généré automatiquement — Application de suivi des conteneurs</footer>
</body>
</html>
