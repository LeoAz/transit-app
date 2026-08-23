<table>
    <thead>
        <tr>
            <th>N° Dossier</th>
            <th>Client</th>
            <th>Statut</th>
            <th>ATA</th>
            <th>Date de clôture</th>
            <th>Délai (j. ouvrables)</th>
            <th>En retard</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row['folder_number'] }}</td>
                <td>{{ $row['customer'] }}</td>
                <td>{{ $row['status_label'] }}</td>
                <td>{{ $row['ata'] }}</td>
                <td>{{ $row['closed_at'] }}</td>
                <td>{{ $row['delay_working_days'] }}</td>
                <td>{{ $row['is_late'] ? 'Oui' : 'Non' }}</td>
            </tr>
        @empty
            <tr><td colspan="7">Aucun dossier clôturé pour cette période.</td></tr>
        @endforelse
    </tbody>
</table>
