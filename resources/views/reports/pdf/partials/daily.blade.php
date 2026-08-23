<h2 class="section-title">Chargements du jour</h2>
<table>
    <thead>
        <tr>
            <th>N° Dossier</th>
            <th>Client</th>
            <th>Chargeur</th>
            <th>N° Camion</th>
            <th>Conteneurs chargés</th>
            <th>Destination</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($loadings as $row)
            <tr>
                <td>{{ $row['folder_number'] }}</td>
                <td>{{ $row['customer'] }}</td>
                <td>{{ $row['shipper'] }}</td>
                <td>{{ $row['truck_number'] }}</td>
                <td>{{ $row['loaded_container_count'] }}</td>
                <td>{{ $row['destination'] }}</td>
            </tr>
        @empty
            <tr><td colspan="6">Aucun chargement aujourd'hui.</td></tr>
        @endforelse
    </tbody>
</table>

<h2 class="section-title">Alertes actives</h2>
<table>
    <thead>
        <tr>
            <th>N° Dossier</th>
            <th>Client</th>
            <th>Statut</th>
            <th>Date limite</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($alerts as $row)
            <tr>
                <td>{{ $row['folder_number'] }}</td>
                <td>{{ $row['customer'] }}</td>
                <td>{{ $row['status_label'] }}</td>
                <td>{{ $row['loading_deadline'] }}</td>
            </tr>
        @empty
            <tr><td colspan="4">Aucune alerte active.</td></tr>
        @endforelse
    </tbody>
</table>
