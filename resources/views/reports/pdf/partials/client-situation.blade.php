<table>
    <thead>
        <tr>
            <th>Client</th>
            <th>Nb dossiers</th>
            <th>Conteneurs commandés</th>
            <th>Conteneurs chargés</th>
            <th>Conteneurs restants</th>
            <th>Taux d'avancement</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($rows as $row)
            <tr>
                <td>{{ $row['customer'] }}</td>
                <td>{{ $row['folders_count'] }}</td>
                <td>{{ $row['containers_ordered'] }}</td>
                <td>{{ $row['containers_loaded'] }}</td>
                <td>{{ $row['containers_remaining'] }}</td>
                <td>{{ $row['progress_rate'] }} %</td>
            </tr>
        @empty
            <tr><td colspan="6">Aucune donnée pour cette période.</td></tr>
        @endforelse
    </tbody>
</table>
