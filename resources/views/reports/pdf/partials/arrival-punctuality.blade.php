@forelse ($rows as $group)
    <h2 class="section-title">
        {{ $group['company'] }} — {{ $group['total'] }} arrivée(s), ponctualité {{ $group['punctuality_rate'] }} %
    </h2>
    <table>
        <thead>
            <tr>
                <th>Navire</th>
                <th>N° Dossier</th>
                <th>ETA</th>
                <th>ATA</th>
                <th>Écart (jours)</th>
                <th>Statut d'arrivée</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($group['folders'] as $row)
                <tr>
                    <td>{{ $row['vessel'] }}</td>
                    <td>{{ $row['folder_number'] }}</td>
                    <td>{{ $row['eta'] }}</td>
                    <td>{{ $row['ata'] }}</td>
                    <td>{{ $row['gap_days'] }}</td>
                    <td>{{ $row['punctuality_label'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@empty
    <p>Aucune arrivée pour cette période.</p>
@endforelse
