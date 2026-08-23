<table>
    <thead>
        <tr>
            <th>Chargeur</th>
            <th>Dossiers affectés</th>
            <th>En cours</th>
            <th>Clôturés</th>
            <th>Volume traité</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row['shipper'] }}</td>
                <td>{{ $row['folders_assigned_count'] }}</td>
                <td>{{ $row['folders_in_progress_count'] }}</td>
                <td>{{ $row['folders_closed_count'] }}</td>
                <td>{{ $row['volume_treated'] }}</td>
            </tr>
        @empty
            <tr><td colspan="5">Aucune donnée pour cette période.</td></tr>
        @endforelse
    </tbody>
</table>
