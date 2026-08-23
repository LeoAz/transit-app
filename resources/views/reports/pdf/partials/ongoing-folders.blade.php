<table>
    <thead>
        <tr>
            <th>N° Dossier</th>
            <th>Client</th>
            <th>Chargeur</th>
            <th>Statut</th>
            <th>Cdrs cmd.</th>
            <th>Cdrs chg.</th>
            <th>ETA</th>
            <th>ATA</th>
            <th>Date limite</th>
            <th>J. restants</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row['folder_number'] }}</td>
                <td>{{ $row['customer'] }}</td>
                <td>{{ $row['shipper'] }}</td>
                <td>{{ $row['status_label'] }}</td>
                <td>{{ $row['container_count'] }}</td>
                <td>{{ $row['loaded'] }}</td>
                <td>{{ $row['eta'] }}</td>
                <td>{{ $row['ata'] }}</td>
                <td>{{ $row['loading_deadline'] }}</td>
                <td>{{ $row['days_until_deadline'] }}</td>
            </tr>
        @empty
            <tr><td colspan="10">Aucun dossier en cours pour cette période.</td></tr>
        @endforelse
    </tbody>
</table>
