<?php

namespace App\Services;

use App\Models\Employee;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class EmployeeService
{
    public function __construct(
        protected EmployeeRepositoryInterface $employeeRepository,
        protected MediaUploadService $mediaUploadService
    ) {}

    public function getAll(): Collection
    {
        return $this->employeeRepository->all();
    }

    public function getById(int $id): ?Employee
    {
        return $this->employeeRepository->findById($id);
    }

    public function create(array $data, ?UploadedFile $photo = null): Employee
    {
        if ($photo) {
            $data['photo_path'] = $this->mediaUploadService->uploadImage($photo, 'employees');
        }

        return $this->employeeRepository->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $photo = null): bool
    {
        $employee = $this->employeeRepository->findById($id);
        if (!$employee) {
            return false;
        }

        if ($photo) {
            $this->mediaUploadService->deleteFile($employee->photo_path);
            $data['photo_path'] = $this->mediaUploadService->uploadImage($photo, 'employees');
        }

        return $this->employeeRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        $employee = $this->employeeRepository->findById($id);
        if ($employee) {
            $this->mediaUploadService->deleteFile($employee->photo_path);
            return $this->employeeRepository->delete($id);
        }
        return false;
    }
}
