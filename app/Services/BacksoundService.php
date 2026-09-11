<?php

namespace App\Services;

use App\Models\Backsound;
use App\Repositories\Contracts\BacksoundRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class BacksoundService
{
    public function __construct(
        protected BacksoundRepositoryInterface $backsoundRepository,
        protected MediaUploadService $mediaUploadService
    ) {}

    public function getAll(): Collection
    {
        return $this->backsoundRepository->all();
    }

    public function getActive(): Collection
    {
        return $this->backsoundRepository->getActive();
    }

    public function getByContext(string $context, ?int $categoryId = null): Collection
    {
        return $this->backsoundRepository->getByContext($context, $categoryId);
    }

    public function create(array $data, UploadedFile $audioFile): Backsound
    {
        $data['file_path'] = $this->mediaUploadService->uploadAudio($audioFile);
        return $this->backsoundRepository->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $audioFile = null): bool
    {
        $backsound = $this->backsoundRepository->findById($id);
        if (!$backsound) {
            return false;
        }

        if ($audioFile) {
            $this->mediaUploadService->deleteFile($backsound->file_path);
            $data['file_path'] = $this->mediaUploadService->uploadAudio($audioFile);
        }

        return $this->backsoundRepository->update($id, $data);
    }

    public function toggleActive(int $id): bool
    {
        $backsound = $this->backsoundRepository->findById($id);
        if ($backsound) {
            return $this->backsoundRepository->update($id, ['is_active' => !$backsound->is_active]);
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $backsound = $this->backsoundRepository->findById($id);
        if ($backsound) {
            $this->mediaUploadService->deleteFile($backsound->file_path);
            return $this->backsoundRepository->delete($id);
        }
        return false;
    }
}
