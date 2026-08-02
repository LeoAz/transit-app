<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Jobs\GenerateDocumentsZip;
use App\Jobs\ProcessDocumentUpload;
use App\Models\Document;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('a user can upload a document to a folder asynchronyously', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $folder = Folder::factory()->create();
    Storage::fake('local');
    Bus::fake();

    $file = UploadedFile::fake()->create('contract.pdf', 500);

    $response = $this
        ->actingAs($user)
        ->post("/folders/{$folder->id}/documents", [
            'document_type' => 'Contract',
            'file' => $file,
        ]);

    $response->assertSessionHasNoErrors();

    Bus::assertDispatched(ProcessDocumentUpload::class, function ($job) use ($folder, $user) {
        return $job->folder->id === $folder->id &&
               $job->documentType === 'Contract' &&
               $job->userId === $user->id;
    });
});

test('a user can download a document', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    Storage::fake('public');
    $file = UploadedFile::fake()->create('test.txt', 100);
    $path = $file->store('folders/1', 'public');

    $document = Document::factory()->create([
        'file_path' => $path,
        'file_name' => 'test.txt',
    ]);

    $response = $this
        ->actingAs($user)
        ->get("/documents/{$document->id}/download");

    $response->assertOk();
    $response->assertHeader('Content-Disposition', 'attachment; filename=test.txt');
});

test('a user can delete a document', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    Storage::fake('public');
    $file = UploadedFile::fake()->create('delete-me.txt', 100);
    $path = $file->store('folders/1', 'public');

    $document = Document::factory()->create([
        'file_path' => $path,
    ]);

    $response = $this
        ->actingAs($user)
        ->delete("/documents/{$document->id}");

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('documents', ['id' => $document->id]);
    Storage::disk('public')->assertMissing($path);
});

test('a user can download multiple documents as ZIP asynchronously', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    Bus::fake();

    $doc1 = Document::factory()->create();
    $doc2 = Document::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/documents/download-bulk', [
            'ids' => [$doc1->id, $doc2->id],
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    Bus::assertDispatched(GenerateDocumentsZip::class, function ($job) use ($doc1, $doc2, $user) {
        return $job->documentIds === [$doc1->id, $doc2->id] &&
               $job->userId === $user->id;
    });
});

test('a user can view a document in browser', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    Storage::fake('public');
    $file = UploadedFile::fake()->create('test.pdf', 100);
    $path = $file->store('folders/1', 'public');

    $document = Document::factory()->create([
        'file_path' => $path,
        'file_name' => 'test.pdf',
    ]);

    $response = $this
        ->actingAs($user)
        ->get("/documents/{$document->id}");

    $response->assertOk();
    $response->assertHeader('Content-Disposition', 'inline; filename="test.pdf"');
});
