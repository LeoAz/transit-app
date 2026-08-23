<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1f2937; font-size: 14px; line-height: 1.5; }
        .card { max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; }
        h1 { font-size: 16px; color: #1e3a5f; }
        a.button { display: inline-block; margin-top: 16px; padding: 10px 16px; background-color: #1e3a5f; color: #ffffff; text-decoration: none; border-radius: 6px; }
        .muted { color: #6b7280; font-size: 12px; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>{{ $schedule->report_type->label() }}</h1>
        <p>
            Bonjour,<br>
            Voici votre rapport « {{ $schedule->report_type->label() }} », généré automatiquement
            selon la périodicité que vous avez définie ({{ $schedule->frequency->label() }}).
            Le fichier est joint à cet e-mail au format {{ $schedule->format->label() }}.
        </p>
        <a class="button" href="{{ route('reports.scheduled.index') }}">Voir l'historique des envois</a>
        <p class="muted">
            Vous recevez cet e-mail car une programmation d'envoi automatique est active sur votre compte.
            Vous pouvez la modifier ou la désactiver à tout moment depuis l'application.
        </p>
    </div>
</body>
</html>
